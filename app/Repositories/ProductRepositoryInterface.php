<?php
namespace App\Repositories;

interface ProductRepositoryInterface extends BaseRepositoryInterface {
    /**
     * Get all products with optional filters
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function all($request);

    /**
     * Find a product by ID
     *
     * @param int $id
     * @return \App\Models\Product
     */
    public function find($id);

    /**
     * Create a new product
     *
     * @param array $data
     * @return \App\Models\Product
     */
    public function create(array $data);

    /**
     * Update a product
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Product
     */
    public function update($id, array $data);

    /**
     * Delete a product
     *
     * @param int $id
     * @return bool
     */
    public function delete($id);
} 