<?php

namespace App\Http\Controllers;

use App\Repositories\CartRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    protected $carts;

    public function __construct(CartRepositoryInterface $carts)
    {
        $this->carts = $carts;
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $cartItems = $this->carts->getUserCart($userId);
        $total = $cartItems->sum(function($item) {
            return $item->product ? $item->product->price * $item->quantity : 0;
        });
        return response()->json([
            'cart' => $cartItems,
            'total' => $total,
        ]);
    }

    public function add(Request $request, $productId)
    {
        $userId = $request->user()->id;
        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
        ]);
        $quantity = $validated['quantity'] ?? 1;
        $cartItem = $this->carts->store($userId, $productId, $quantity);
        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart_item' => $cartItem,
        ], 201);
    }

    public function update(Request $request, $productId)
    {
        $userId = $request->user()->id;
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $cartItem = $this->carts->updateItem($userId, $productId, $validated['quantity']);
        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart_item' => $cartItem,
        ]);
    }

    public function remove(Request $request, $productId)
    {
        $userId = $request->user()->id;
        $this->carts->removeItem($userId, $productId);
        return response()->json(['message' => 'Cart item removed successfully']);
    }

    public function clear(Request $request)
    {
        $userId = $request->user()->id;
        $this->carts->clearCart($userId);
        return response()->json(['message' => 'Cart cleared successfully']);
    }
} 