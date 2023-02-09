<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
	use HasFactory;

	public $table = 'articles';

	protected $guard_name = 'api';

	protected $primaryKey = 'id';

	protected $fillable = [
		'id',
		'name',
		'is_house',
		'street_name',
		'ended',
		'contract_amount',
		'created_at',
        'created_user_id',
		'updated_at',
        'updated_user_id',
		'deleted',
	];

	public function payments()
	{
		return $this->hasMany(Payments::class);
	}

	public function budgets()
	{
		return $this->hasMany(Budgets::class);
	}

	public function constructions()
	{
		return $this->belongsTo(Constructions::class);
	}
}
