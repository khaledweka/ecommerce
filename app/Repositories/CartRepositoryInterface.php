<?php
namespace App\Repositories;

interface CartRepositoryInterface extends BaseRepositoryInterface {
    /**
     * Add a product to the user's cart
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
    public function store($userId, $productId, $quantity = 1);

    /**
     * Update the quantity of a product in the user's cart
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
    public function updateItem($userId, $productId, $quantity);

    /**
     * Remove a product from the user's cart
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function removeItem($userId, $productId);

    /**
     * Get all items in the user's cart
     * @param int $userId
     * @return mixed
     */
    public function getUserCart($userId);

    /**
     * Clear the user's cart
     * @param int $userId
     * @return mixed
     */
    public function clearCart($userId);
} 