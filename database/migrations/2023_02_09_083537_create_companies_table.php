<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->nullable();
            $table->string('furi')->nullable();
            $table->string('en_name')->nullable();
            $table->string('category_id')->nullable();
            $table->string('url')->nullable();
            $table->string('contact_url')->nullable();
            $table->string('zip')->nullable();
            $table->string('pref')->nullable();
            $table->string('address')->nullable();
            $table->string('tel')->nullable();
            $table->string('dainame')->nullable();
            $table->string('corporate_number')->nullable();
            $table->string('established')->nullable();
            $table->string('capital')->nullable();
            $table->string('earnings')->nullable();
            $table->string('employees')->nullable();
            $table->longText('category_txt')->nullable();
            $table->string('houjin_flg')->nullable();
            $table->string('session_status')->nullable();
            $table->string('status')->nullable();
            $table->string('created')->nullable();
            $table->string('modified')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
};
