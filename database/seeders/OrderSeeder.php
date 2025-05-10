<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create();
        }

        // Create some sample orders
        $orders = [
            [
                'user_id' => $user->id,
                'status' => 'pending',
                'total_amount' => 0,
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Sample City',
                    'state' => 'Sample State',
                    'zip_code' => '12345',
                    'country' => 'Sample Country'
                ]
            ],
            [
                'user_id' => $user->id,
                'status' => 'completed',
                'total_amount' => 0,
                'shipping_address' => [
                    'street' => '456 Oak Ave',
                    'city' => 'Another City',
                    'state' => 'Another State',
                    'zip_code' => '67890',
                    'country' => 'Another Country'
                ]
            ],
            [
                'user_id' => $user->id,
                'status' => 'cancelled',
                'total_amount' => 0,
                'shipping_address' => [
                    'street' => '789 Pine Rd',
                    'city' => 'Third City',
                    'state' => 'Third State',
                    'zip_code' => '13579',
                    'country' => 'Third Country'
                ]
            ]
        ];

        foreach ($orders as $orderData) {
            $order = Order::create($orderData);

            // Attach some random products to each order
            $products = Product::inRandomOrder()->take(rand(1, 3))->get();
            foreach ($products as $product) {
                $quantity = rand(1, 3);
                $order->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'price_at_time' => $product->price
                ]);
            }

            // Update the total amount
            $total = $order->products->sum(function ($product) {
                return $product->pivot->quantity * $product->pivot->price_at_time;
            });
            $order->update(['total_amount' => $total]);
        }
    }

    private function getRandomStatus(): string
    {
        $statuses = ['pending', 'processing', 'completed', 'cancelled'];
        return $statuses[array_rand($statuses)];
    }

    private function getRandomAddress(): string
    {
        $streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd'];
        $numbers = rand(100, 9999);
        return $numbers . ' ' . $streets[array_rand($streets)];
    }

    private function getRandomCity(): string
    {
        $cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        return $cities[array_rand($cities)];
    }

    private function getRandomState(): string
    {
        $states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
        return $states[array_rand($states)];
    }

    private function getRandomZipcode(): string
    {
        return str_pad(rand(10000, 99999), 5, '0', STR_PAD_LEFT);
    }
} 