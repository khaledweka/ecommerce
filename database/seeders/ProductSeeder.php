<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Smartphone X',
                'description' => 'Latest smartphone with advanced features',
                'price' => 999.99,
                'stock' => 50,
                'image' => 'smartphone-x.jpg',
            ],
            [
                'name' => 'Laptop Pro',
                'description' => 'High-performance laptop for professionals',
                'price' => 1499.99,
                'stock' => 30,
                'image' => 'laptop-pro.jpg',
            ],
            [
                'name' => 'Wireless Earbuds',
                'description' => 'Premium wireless earbuds with noise cancellation',
                'price' => 199.99,
                'stock' => 100,
                'image' => 'wireless-earbuds.jpg',
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Feature-rich smartwatch with health monitoring',
                'price' => 299.99,
                'stock' => 75,
                'image' => 'smart-watch.jpg',
            ],
            [
                'name' => 'Bluetooth Speaker',
                'description' => 'Portable bluetooth speaker with amazing sound',
                'price' => 79.99,
                'stock' => 150,
                'image' => 'bluetooth-speaker.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Create additional random products
        Product::factory()->count(10)->create();
    }
} 