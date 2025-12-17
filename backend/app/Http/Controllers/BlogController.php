<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\SeoMetadata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Get all blogs for authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $blogs = $request->user()->blogs()
            ->with('seoMetadata')
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return response()->json($blogs);
    }

    /**
     * Store a new blog
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,published'],
            'tags' => ['nullable', 'array'],
            'category' => ['nullable', 'string', 'max:100'],
            'seo_metadata' => ['nullable', 'array'],
            'seo_metadata.meta_title' => ['nullable', 'string', 'max:60'],
            'seo_metadata.meta_description' => ['nullable', 'string', 'max:155'],
            'seo_metadata.keywords' => ['nullable', 'array'],
        ]);

        $blog = $request->user()->blogs()->create([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? '',
            'status' => $validated['status'] ?? 'draft',
            'tags' => $validated['tags'] ?? [],
            'category' => $validated['category'] ?? null,
            'seo_score' => 0,
            'reading_time' => 0,
        ]);

        // Calculate reading time
        $blog->reading_time = $blog->calculateReadingTime();
        $blog->save();

        // Create SEO metadata if provided
        if (!empty($validated['seo_metadata'])) {
            $blog->seoMetadata()->create($validated['seo_metadata']);
        }

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog->load('seoMetadata'),
        ], 201);
    }

    /**
     * Get a specific blog
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $blog = Blog::with('seoMetadata')->findOrFail($id);

        // Check if user owns the blog
        if ($blog->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['blog' => $blog]);
    }

    /**
     * Update a blog
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        // Check if user owns the blog
        if ($blog->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:draft,published'],
            'tags' => ['sometimes', 'array'],
            'category' => ['sometimes', 'string', 'max:100'],
            'seo_score' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'seo_metadata' => ['sometimes', 'array'],
            'seo_metadata.meta_title' => ['nullable', 'string', 'max:60'],
            'seo_metadata.meta_description' => ['nullable', 'string', 'max:155'],
            'seo_metadata.keywords' => ['nullable', 'array'],
        ]);

        $blog->fill($validated);

        // Recalculate reading time if content changed
        if (isset($validated['content'])) {
            $blog->reading_time = $blog->calculateReadingTime();
        }

        $blog->save();

        // Update or create SEO metadata
        if (!empty($validated['seo_metadata'])) {
            $blog->seoMetadata()->updateOrCreate(
                ['blog_id' => $blog->id],
                $validated['seo_metadata']
            );
        }

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog->load('seoMetadata'),
        ]);
    }

    /**
     * Delete a blog
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        // Check if user owns the blog
        if ($blog->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully',
        ]);
    }

    /**
     * Export blog in different formats
     */
    public function export(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'format' => ['required', 'in:markdown,html,wordpress'],
        ]);

        $blog = Blog::with('seoMetadata')->findOrFail($id);

        // Check if user owns the blog
        if ($blog->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $content = $blog->content;
        $meta = $blog->seoMetadata;

        switch ($validated['format']) {
            case 'markdown':
                $exported = $this->exportToMarkdown($blog);
                break;
            case 'html':
                $exported = $this->exportToHtml($blog);
                break;
            case 'wordpress':
                $exported = $this->exportToWordPress($blog);
                break;
            default:
                $exported = $content;
        }

        return response()->json([
            'format' => $validated['format'],
            'content' => $exported,
        ]);
    }

    /**
     * Export to Markdown format
     */
    protected function exportToMarkdown(Blog $blog): string
    {
        $markdown = "# {$blog->title}\n\n";
        
        if ($blog->seoMetadata) {
            $markdown .= "---\n";
            $markdown .= "meta_title: {$blog->seoMetadata->meta_title}\n";
            $markdown .= "meta_description: {$blog->seoMetadata->meta_description}\n";
            $keywords = implode(', ', $blog->seoMetadata->keywords ?? []);
            $markdown .= "keywords: {$keywords}\n";
            $markdown .= "---\n\n";
        }

        // Convert HTML to basic Markdown
        $content = strip_tags($blog->content, '<h1><h2><h3><h4><h5><h6><p><a><strong><em><ul><ol><li><blockquote><code><pre>');
        $content = preg_replace('/<h1>(.*?)<\/h1>/i', "# $1\n\n", $content);
        $content = preg_replace('/<h2>(.*?)<\/h2>/i', "## $1\n\n", $content);
        $content = preg_replace('/<h3>(.*?)<\/h3>/i', "### $1\n\n", $content);
        $content = preg_replace('/<p>(.*?)<\/p>/i', "$1\n\n", $content);
        $content = preg_replace('/<strong>(.*?)<\/strong>/i', "**$1**", $content);
        $content = preg_replace('/<em>(.*?)<\/em>/i', "*$1*", $content);
        $content = strip_tags($content);

        $markdown .= $content;

        return $markdown;
    }

    /**
     * Export to HTML format
     */
    protected function exportToHtml(Blog $blog): string
    {
        $html = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
        $html .= "  <meta charset=\"UTF-8\">\n";
        $html .= "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
        
        if ($blog->seoMetadata) {
            $html .= "  <title>{$blog->seoMetadata->meta_title}</title>\n";
            $html .= "  <meta name=\"description\" content=\"{$blog->seoMetadata->meta_description}\">\n";
            $keywords = implode(', ', $blog->seoMetadata->keywords ?? []);
            $html .= "  <meta name=\"keywords\" content=\"{$keywords}\">\n";
        } else {
            $html .= "  <title>{$blog->title}</title>\n";
        }

        $html .= "</head>\n<body>\n";
        $html .= "  <article>\n";
        $html .= "    <h1>{$blog->title}</h1>\n";
        $html .= "    {$blog->content}\n";
        $html .= "  </article>\n";
        $html .= "</body>\n</html>";

        return $html;
    }

    /**
     * Export to WordPress format (XML)
     */
    protected function exportToWordPress(Blog $blog): string
    {
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        $xml .= "<rss version=\"2.0\">\n<channel>\n";
        $xml .= "<item>\n";
        $xml .= "  <title><![CDATA[{$blog->title}]]></title>\n";
        $xml .= "  <content:encoded><![CDATA[{$blog->content}]]></content:encoded>\n";
        $xml .= "  <wp:post_type>post</wp:post_type>\n";
        $xml .= "  <wp:status>{$blog->status}</wp:status>\n";
        
        foreach ($blog->tags ?? [] as $tag) {
            $xml .= "  <category domain=\"post_tag\"><![CDATA[{$tag}]]></category>\n";
        }
        
        if ($blog->category) {
            $xml .= "  <category domain=\"category\"><![CDATA[{$blog->category}]]></category>\n";
        }

        $xml .= "</item>\n</channel>\n</rss>";

        return $xml;
    }
}
