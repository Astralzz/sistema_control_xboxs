<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// * Index
Route::get('/', function () {
    return view('index');
})->name('index');

// * 404
Route::fallback(function () {
    return view('404');
})->name(("404"));
