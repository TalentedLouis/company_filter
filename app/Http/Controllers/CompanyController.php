<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

use Symfony\Component\HttpFoundation\StreamedResponse;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request )
    {
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
                   $query->where('category_id', 'LIKE', '%'.$industry.'%');
                if($free_keyword)
                   $query->orWhere('name', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('furi', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('en_name', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('category_id', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('url', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('contact_url', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('zip', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('pref', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('address', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('tel', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('dainame', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('corporate_number', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('established', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('capital', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('earnings', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('employees', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('category_txt', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('houjin_flg', 'Like', '%'.$free_keyword.'%')
                         ->orWhere('status', 'Like', '%'.$free_keyword.'%');
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
                // 'data1' => $companies1,
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

    public function export_csv(Request $request)
    {
        $allData;
        if($request){
            $prefectures = $request->prefectures;
            $industry = $request->industry;
            $site_url = $request->siteUrl;
            $capital = $request->capital;
            $amount_of_sales = $request->amountOfSales;
            $free_keyword = $request->freeKeyword;
            $establish_date_from = $request->establishDateFrom;
            $establish_date_to = $request->establishDateTo;
            
            $allData = Company::where(function ($query) use ($prefectures, $industry, $site_url, $free_keyword, $establish_date_from, $establish_date_to) {
                if($prefectures && $prefectures != 0 )
                    $query->where('address', 'LIKE', $prefectures.'%');
                if($industry && $industry != 0 )
                    $query->where('category_id', 'LIKE', '%'.$industry.'%');
                if($free_keyword)
                    $query->orWhere('name', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('furi', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('en_name', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('category_id', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('url', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('contact_url', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('zip', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('pref', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('address', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('tel', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('dainame', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('corporate_number', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('established', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('capital', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('earnings', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('employees', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('category_txt', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('houjin_flg', 'Like', '%'.$free_keyword.'%')
                            ->orWhere('status', 'Like', '%'.$free_keyword.'%');
                if($site_url == 1)
                    $query->where('url', '!=', '');
                if($site_url == 2)
                    $query->where('url', '');
            });
        } else {
            $allData = Company::all();
        }
        
        $response = new StreamedResponse(function() use($allData) {
            // Open output stream
            $handle = fopen('php://output', 'w');

            // Add CSV headers
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($handle, [
                'name',
                'furi',
                'en_name',
                'category_id',
                'url',
                'contact_url',
                'zip',
                'address',
                'tel',
                'dainame',
                'corporate_number',
                'established',
                'capital',
                'earnings',
                'employees',
                'category_txt',
                'created',
                'modified'
            ]);
                
           $allData->chunk(1000, function($companies) use ($handle) {
                    foreach ($companies as $company) {
                        // Add a new row with data
                        fputcsv($handle, [
                            $company->name,
                            $company->furi,
                            $company->en_name,
                            $company->category_id,
                            $company->url,
                            $company->contact_url,
                            $company->zip,
                            $company->address,
                            $company->tel,
                            $company->dainame,
                            $company->corporate_number,
                            $company->established,
                            $company->capital,
                            $company->earnings,
                            $company->employees,
                            $company->category_txt,
                            $company->created,
                            $company->modifie
                        ]);
                    }
                });
            
            // Close the output stream
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="企業リスト'.date('d-m-Y').'.csv"',
        ]);

        return $response;
    }
}
