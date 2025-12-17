<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeoMetadata extends Model
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     */
    protected $table = 'seo_metadata';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'blog_id',
        'meta_title',
        'meta_description',
        'keywords',
        'keyword_density',
        'readability_score',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'keyword_density' => 'integer',
            'readability_score' => 'integer',
        ];
    }

    /**
     * Get the blog that owns the SEO metadata
     */
    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }
}
