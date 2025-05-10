<?php

namespace App\Http\Controllers;

use App\Repositories\OrderRepositoryInterface;
use App\Repositories\CartRepositoryInterface;
use App\Events\OrderPlaced;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected $orders;
    protected $carts;

    public function __construct(OrderRepositoryInterface $orders, CartRepositoryInterface $carts)
    {
        $this->orders = $orders;
        $this->carts = $carts;
    }

    public function index()
    {
        $orders = $this->orders->all(request());
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = $this->orders->find($id);
        
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order->load('products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.zip_code' => 'required|string',
            'shipping_address.country' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Get cart items for the user
            $userId = Auth::id();
            $cartItems = $this->carts->getUserCart($userId);

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            $totalAmount = 0;
            $orderItems = [];

            // Check product availability and calculate total
            foreach ($cartItems as $item) {
                $product = $item->product;
                
                if ($product->stock < $item->quantity) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                $totalAmount += $product->price * $item->quantity;
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'price_at_time' => $product->price,
                ];

                // Update stock
                $product->stock -= $item->quantity;
                $product->save();
            }

            // Create order
            $order = $this->orders->create([
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
            ]);

            // Attach products to order
            foreach ($orderItems as $item) {
                $order->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity'],
                    'price_at_time' => $item['price_at_time'],
                ]);
            }

            // Clear the cart for the user
            $this->carts->clearCart($userId);

            DB::commit();

            // Trigger order placed event
            event(new OrderPlaced($order));

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('products'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
} 