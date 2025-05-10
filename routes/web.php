<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Serve the React app for all routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
