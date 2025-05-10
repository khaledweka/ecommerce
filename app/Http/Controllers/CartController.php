<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        $total = 0;
        $formattedCart = [];

        foreach ($cartItems as $item) {
            $price = (float) $item->product->price;
            $total += $price * $item->quantity;
            $formattedCart[$item->product_id] = [
                'id' => $item->product->id,
                'name' => $item->product->name,
                'price' => $price,
                'quantity' => $item->quantity,
                'image_url' => $item->product->image_url,
            ];
        }

        return response()->json([
            'cart' => $formattedCart,
            'total' => (float) $total,
        ]);
    }

    public function add(Request $request, Product $product)
    {
        $quantity = $request->input('quantity', 1);
        
        // Check if product is already in cart
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Update quantity if product exists
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            // Create new cart item
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        return $this->index($request);
    }

    public function update(Request $request, Product $product)
    {
        $quantity = $request->input('quantity', 1);
        
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity = $quantity;
            $cartItem->save();
        }

        return $this->index($request);
    }

    public function remove(Product $product)
    {
        Cart::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->delete();

        return $this->index(request());
    }
} 