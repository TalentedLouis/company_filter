<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/home', function () {
    return view('welcome');
});

Route::get('/menu', function () {
    return view('welcome');
});

Route::get('/users', function () {
    return view('welcome');
});

Route::get('/article', function () {
    return view('welcome');
});

Route::get('/company', function () {
    return view('welcome');
});

Route::get('/construction/{number}', function () {
    return view('welcome');
});

Route::get('/payment', function () {
    return view('welcome');
});