<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

use Illuminate\Pagination\Paginator;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request )
    {
        // return $request;
        if($request){
            $rows_per_page = $request-> rowsPerPage;
            $page = $request -> page;

            $prefectures = $request->prefectures;
            $industry = $request->industry;
            $site_url = $request->siteUrl;
            $capital = $request->capital;
            $amount_of_sales = $request->amountOfSales;
            $free_keyword = $request->freeKeyword;
            $establish_date_from = $request->establishDateFrom;
            $establish_date_to = $request->establishDateTo;

            $companies = Company::where(function ($query) use ($prefectures, $industry, $site_url, $free_keyword, $establish_date_from, $establish_date_to, $page, $rows_per_page) {
                if($prefectures && $prefectures != 0 )
                   $query->where('address', 'LIKE', $prefectures.'%');
                if($industry && $industry != 0 )
                   $query->where('category_id', $industry);
                if($free_keyword)
                   $query->where('category_txt', 'Like', '%'.$free_keyword.'%');
                if($site_url === 1)
                   $query->where('url', '!=', '');
                if($site_url === 2)
                   $query->where('url', '');
                if($page)
                    $query->skip($rows_per_page * $page);
            })->paginate($rows_per_page);


            return response()->json([
                'success' => true,
                'data' => $companies
            ]);
        }
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Company $company)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function destroy(Company $company)
    {
        //
    }
}
