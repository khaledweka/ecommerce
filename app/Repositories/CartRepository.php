<?php
namespace App\Repositories;

use App\Models\Cart;

class CartRepository extends BaseRepository implements CartRepositoryInterface {
    public function __construct(Cart $model) {
        parent::__construct($model);
    }

    public function store($userId, $productId, $quantity = 1)
    {
        // Check if the product is already in the user's cart
        $cartItem = $this->model->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
            return $cartItem;
        }
        return $this->model->create([
            'user_id' => $userId,
            'product_id' => $productId,
            'quantity' => $quantity,
        ]);
    }

    public function updateItem($userId, $productId, $quantity)
    {
        $cartItem = $this->model->where('user_id', $userId)
            ->where('product_id', $productId)
            ->firstOrFail();
        $cartItem->quantity = $quantity;
        $cartItem->save();
        return $cartItem;
    }

    public function removeItem($userId, $productId)
    {
        return $this->model->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }

    public function getUserCart($userId)
    {
        return $this->model->with('product')->where('user_id', $userId)->get();
    }

    public function clearCart($userId)
    {
        return $this->model->where('user_id', $userId)->delete();
    }
} 