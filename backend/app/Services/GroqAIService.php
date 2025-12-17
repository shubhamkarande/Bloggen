<?php

namespace App\Services;

use App\Models\AiLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqAIService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    protected string $model = 'llama-3.1-70b-versatile';

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key', '');
    }

    /**
     * Generate blog outline based on topic and preferences
     */
    public function generateOutline(array $params): array
    {
        $systemPrompt = "You are an expert blog writer and SEO specialist. Generate a well-structured blog outline with clear headings (H1, H2, H3). 
        Focus on creating engaging, SEO-friendly content structure.
        Return the response as a JSON object with the following structure:
        {
            \"title_options\": [\"Title 1\", \"Title 2\", \"Title 3\"],
            \"outline\": [
                {\"level\": \"h1\", \"text\": \"Main Title\"},
                {\"level\": \"h2\", \"text\": \"Section 1\"},
                {\"level\": \"h3\", \"text\": \"Subsection 1.1\"},
                ...
            ],
            \"estimated_word_count\": 1500
        }";

        $userPrompt = sprintf(
            "Create a blog outline for the following:
            Topic: %s
            Target Audience: %s
            Tone: %s
            Target Word Count: %d
            SEO Focus: %s
            Keywords: %s",
            $params['topic'] ?? '',
            $params['audience'] ?? 'general readers',
            $params['tone'] ?? 'professional',
            $params['word_count'] ?? 1500,
            $params['seo_focus'] ?? 'Google',
            implode(', ', $params['keywords'] ?? [])
        );

        return $this->sendRequest($systemPrompt, $userPrompt, 'generate_outline', $params['user_id'] ?? null);
    }

    /**
     * Generate full blog content from outline
     */
    public function generateContent(array $params): array
    {
        $systemPrompt = "You are an expert blog writer. Write engaging, original content based on the provided outline.
        Guidelines:
        - Write in a {$params['tone']} tone
        - Target approximately {$params['word_count']} words
        - Include relevant keywords naturally
        - Make content SEO-friendly but readable
        - Use proper formatting with paragraphs
        - Include a compelling introduction and conclusion
        
        Return the response as a JSON object:
        {
            \"content\": \"Full blog content in HTML format\",
            \"word_count\": 1500,
            \"reading_time\": 7
        }";

        $userPrompt = sprintf(
            "Write the full blog content based on this outline:\n%s\n\nTarget Keywords: %s",
            json_encode($params['outline'] ?? []),
            implode(', ', $params['keywords'] ?? [])
        );

        return $this->sendRequest($systemPrompt, $userPrompt, 'generate_content', $params['user_id'] ?? null);
    }

    /**
     * Analyze content for SEO
     */
    public function analyzeSeo(array $params): array
    {
        $systemPrompt = "You are an SEO expert. Analyze the provided content and return SEO suggestions.
        Return the response as a JSON object:
        {
            \"seo_score\": 75,
            \"meta_title\": \"Suggested meta title (max 60 chars)\",
            \"meta_description\": \"Suggested meta description (max 155 chars)\",
            \"keywords\": [\"keyword1\", \"keyword2\"],
            \"keyword_density\": 2.5,
            \"readability_score\": 80,
            \"suggestions\": [
                \"Add more internal links\",
                \"Improve heading structure\",
                ...
            ]
        }";

        $userPrompt = sprintf(
            "Analyze this blog content for SEO:\n\nTitle: %s\n\nContent: %s\n\nTarget Keywords: %s",
            $params['title'] ?? '',
            $params['content'] ?? '',
            implode(', ', $params['keywords'] ?? [])
        );

        return $this->sendRequest($systemPrompt, $userPrompt, 'seo_analyze', $params['user_id'] ?? null);
    }

    /**
     * Rewrite content section
     */
    public function rewriteContent(array $params): array
    {
        $systemPrompt = "You are an expert content editor. Rewrite the provided content to improve clarity, engagement, and SEO.
        Maintain the original meaning and tone.
        Return the response as a JSON object:
        {
            \"rewritten_content\": \"Improved content here\",
            \"changes_made\": [\"Improved sentence structure\", \"Added transition words\"]
        }";

        $userPrompt = sprintf(
            "Rewrite this content:\n%s\n\nTone: %s\nGoal: %s",
            $params['content'] ?? '',
            $params['tone'] ?? 'professional',
            $params['goal'] ?? 'improve clarity and engagement'
        );

        return $this->sendRequest($systemPrompt, $userPrompt, 'rewrite', $params['user_id'] ?? null);
    }

    /**
     * Expand content section
     */
    public function expandContent(array $params): array
    {
        $systemPrompt = "You are an expert content writer. Expand the provided content with more details, examples, and explanations.
        Return the response as a JSON object:
        {
            \"expanded_content\": \"Expanded content here\",
            \"added_word_count\": 200
        }";

        $userPrompt = sprintf(
            "Expand this content with more details:\n%s\n\nTarget additional words: %d",
            $params['content'] ?? '',
            $params['additional_words'] ?? 200
        );

        return $this->sendRequest($systemPrompt, $userPrompt, 'expand', $params['user_id'] ?? null);
    }

    /**
     * Send request to Groq API
     */
    protected function sendRequest(string $systemPrompt, string $userPrompt, string $action, ?string $userId = null): array
    {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'error' => 'AI API key not configured. Please set GROQ_API_KEY in your environment.',
                'data' => null
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($this->baseUrl, [
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt]
                ],
                'temperature' => 0.7,
                'max_tokens' => 4000,
                'response_format' => ['type' => 'json_object']
            ]);

            if ($response->failed()) {
                Log::error('Groq API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return [
                    'success' => false,
                    'error' => 'AI service request failed: ' . $response->body(),
                    'data' => null
                ];
            }

            $result = $response->json();
            $content = $result['choices'][0]['message']['content'] ?? null;
            $tokensUsed = $result['usage']['total_tokens'] ?? 0;

            // Log the AI usage
            if ($userId) {
                AiLog::create([
                    'user_id' => $userId,
                    'action' => $action,
                    'tokens_used' => $tokensUsed,
                    'request_data' => [
                        'system_prompt' => substr($systemPrompt, 0, 500),
                        'user_prompt' => substr($userPrompt, 0, 500)
                    ],
                    'response_data' => json_decode($content, true)
                ]);
            }

            return [
                'success' => true,
                'error' => null,
                'data' => json_decode($content, true),
                'tokens_used' => $tokensUsed
            ];

        } catch (\Exception $e) {
            Log::error('Groq AI Service Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'AI service error: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }
}
