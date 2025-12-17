<?php

namespace App\Http\Controllers;

use App\Services\GroqAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected GroqAIService $aiService;

    public function __construct(GroqAIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Generate blog outline
     */
    public function generateOutline(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic' => ['required', 'string', 'max:500'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:50'],
            'audience' => ['nullable', 'string', 'max:100'],
            'tone' => ['nullable', 'in:professional,casual,technical,storytelling'],
            'word_count' => ['nullable', 'integer', 'min:300', 'max:5000'],
            'seo_focus' => ['nullable', 'in:google,medium,devto'],
        ]);

        $result = $this->aiService->generateOutline([
            'topic' => $validated['topic'],
            'keywords' => $validated['keywords'] ?? [],
            'audience' => $validated['audience'] ?? 'general readers',
            'tone' => $validated['tone'] ?? $request->user()->preferences['tone'] ?? 'professional',
            'word_count' => $validated['word_count'] ?? 1500,
            'seo_focus' => $validated['seo_focus'] ?? 'google',
            'user_id' => $request->user()->id,
        ]);

        if (!$result['success']) {
            return response()->json([
                'message' => 'Failed to generate outline',
                'error' => $result['error'],
            ], 500);
        }

        return response()->json([
            'message' => 'Outline generated successfully',
            'data' => $result['data'],
            'tokens_used' => $result['tokens_used'] ?? 0,
        ]);
    }

    /**
     * Generate blog content from outline
     */
    public function generateContent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'outline' => ['required', 'array'],
            'title' => ['required', 'string', 'max:255'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:50'],
            'tone' => ['nullable', 'in:professional,casual,technical,storytelling'],
            'word_count' => ['nullable', 'integer', 'min:300', 'max:5000'],
        ]);

        $result = $this->aiService->generateContent([
            'outline' => $validated['outline'],
            'title' => $validated['title'],
            'keywords' => $validated['keywords'] ?? [],
            'tone' => $validated['tone'] ?? $request->user()->preferences['tone'] ?? 'professional',
            'word_count' => $validated['word_count'] ?? 1500,
            'user_id' => $request->user()->id,
        ]);

        if (!$result['success']) {
            return response()->json([
                'message' => 'Failed to generate content',
                'error' => $result['error'],
            ], 500);
        }

        return response()->json([
            'message' => 'Content generated successfully',
            'data' => $result['data'],
            'tokens_used' => $result['tokens_used'] ?? 0,
        ]);
    }

    /**
     * Analyze content for SEO
     */
    public function analyzeSeo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:50'],
        ]);

        $result = $this->aiService->analyzeSeo([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'keywords' => $validated['keywords'] ?? [],
            'user_id' => $request->user()->id,
        ]);

        if (!$result['success']) {
            return response()->json([
                'message' => 'Failed to analyze SEO',
                'error' => $result['error'],
            ], 500);
        }

        return response()->json([
            'message' => 'SEO analysis complete',
            'data' => $result['data'],
            'tokens_used' => $result['tokens_used'] ?? 0,
        ]);
    }

    /**
     * Rewrite content
     */
    public function rewrite(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
            'tone' => ['nullable', 'in:professional,casual,technical,storytelling'],
            'goal' => ['nullable', 'string', 'max:200'],
        ]);

        $result = $this->aiService->rewriteContent([
            'content' => $validated['content'],
            'tone' => $validated['tone'] ?? 'professional',
            'goal' => $validated['goal'] ?? 'improve clarity and engagement',
            'user_id' => $request->user()->id,
        ]);

        if (!$result['success']) {
            return response()->json([
                'message' => 'Failed to rewrite content',
                'error' => $result['error'],
            ], 500);
        }

        return response()->json([
            'message' => 'Content rewritten successfully',
            'data' => $result['data'],
            'tokens_used' => $result['tokens_used'] ?? 0,
        ]);
    }

    /**
     * Expand content
     */
    public function expand(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
            'additional_words' => ['nullable', 'integer', 'min:50', 'max:1000'],
        ]);

        $result = $this->aiService->expandContent([
            'content' => $validated['content'],
            'additional_words' => $validated['additional_words'] ?? 200,
            'user_id' => $request->user()->id,
        ]);

        if (!$result['success']) {
            return response()->json([
                'message' => 'Failed to expand content',
                'error' => $result['error'],
            ], 500);
        }

        return response()->json([
            'message' => 'Content expanded successfully',
            'data' => $result['data'],
            'tokens_used' => $result['tokens_used'] ?? 0,
        ]);
    }
}
