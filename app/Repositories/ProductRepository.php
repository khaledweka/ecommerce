<?php
namespace App\Repositories;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface {
    public function __construct(Product $model) {
        parent::__construct($model);
    }

    public function all($request)
    {
        $cacheKey = 'products_' . md5($request->fullUrl());
        
        return Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = $this->model->query();

            // Apply search filter
            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Apply category filter
            if ($request->has('category') && $request->get('category') !== 'all') {
                $query->where('category', $request->get('category'));
            }

            // Apply price range filter
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->get('min_price'));
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->get('max_price'));
            }

            // Apply sorting
            $sortField = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            return $query->paginate(12);
        });
    }

    public function find($id)
    {
        $cacheKey = 'product_' . $id;
        
        return Cache::remember($cacheKey, 3600, function () use ($id) {
            return $this->model->findOrFail($id);
        });
    }

    public function create(array $data)
    {
        $product = $this->model->create($data);
        $this->clearProductCache();
        return $product;
    }

    public function update($id, array $data)
    {
        $product = $this->model->findOrFail($id);
        
        // Handle image update
        if (isset($data['image']) && $product->image) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->update($data);
        $this->clearProductCache($id);
        return $product;
    }

    public function delete($id)
    {
        $product = $this->model->findOrFail($id);
        
        // Delete product image
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->delete();
        $this->clearProductCache($id);
        return true;
    }

    protected function clearProductCache($id = null)
    {
        Cache::forget('products');
        if ($id) {
            Cache::forget('product_' . $id);
        }
    }
} 