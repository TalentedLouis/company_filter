<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BudgetsController;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ConstructionsController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SetingsController;
use App\Http\Controllers\SystemLogController;
use App\Http\Controllers\TransfersController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login.api');
Route::post('/register', [AuthController::class, 'register'])->name('register.api');
Route::get('/download-csv', [CompanyController::class, 'export_csv']);
Route::get('/download-excel', [CompanyController::class, 'export_excel']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('companies', [CompanyController::class, 'index']);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('user-role', UserRoleController::class);
    Route::post('/changePwd', [AuthController::class, 'changePwd']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $user['role'] = $user->roles[0]->id;
    return $user;
});
