<?php
namespace App\Repositories;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface {
    public function __construct(Order $model) {
        parent::__construct($model);
    }

    public function all($request)
    {
        return $this->model
            ->with('products')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();
    }

    public function find($id)
    {
        return $this->model
            ->with('products')
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $order = $this->model->findOrFail($id);
        
        if ($order->user_id !== Auth::id()) {
            throw new \Exception('Unauthorized');
        }

        $order->update($data);
        return $order;
    }

    public function delete($id)
    {
        $order = $this->model->findOrFail($id);
        
        if ($order->user_id !== Auth::id()) {
            throw new \Exception('Unauthorized');
        }

        return $order->delete();
    }
} 