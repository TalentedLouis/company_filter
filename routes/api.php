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


Route::middleware('auth:sanctum')->group(function () {

    //articles
    // Route::get('/articles', [ArticleController::class, 'index']);
    // Route::post('/articles', [ArticleController::class, 'create']);
    // Route::put('/articles', [ArticleController::class, 'update']);

    Route::get('articles/autocomplete', [ArticleController::class, 'get_for_autocomplete']);
    Route::apiResource('articles', ArticleController::class);

    Route::apiResource('budgets', BudgetsController::class);

    Route::get('companies/autocomplete', [CompaniesController::class, 'get_for_autocomplete']);
    // Route::apiResource('companies', CompaniesController::class);

    Route::post('companies', [CompanyController::class, 'index']);

    Route::get('constructions/autocomplete', [ConstructionsController::class, 'get_for_autocomplete']);
    // Route::get('constructions/run', [ConstructionsController::class, 'run']);
    Route::apiResource('constructions', ConstructionsController::class);

    Route::get('payments/get_statistics_by_date', [PaymentsController::class, 'get_statistics_by_date']);
    // Route::get('payments/download_excel', [PaymentsController::class, 'download_excel']);
    Route::apiResource('payments', PaymentsController::class);

    Route::apiResource('roles', RoleController::class);

    Route::apiResource('settings', SetingsController::class);

    Route::apiResource('transfer', TransfersController::class);

    Route::apiResource('users', UserController::class);

    Route::apiResource('user-role', UserRoleController::class);

    Route::apiResource('menu', MenuController::class);

    Route::get('systemlog/get_budget_log_from_article_id', [SystemLogController::class, 'get_budget_log_from_article_id']);
    Route::get('systemlog/get_construction_log_from_house_value', [SystemLogController::class, 'get_construction_log_from_house_value']);
    Route::apiResource('systemlog', SystemLogController::class);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $user['role'] = $user->roles[0]->id;
    return $user;
});
