<?php

namespace App\Http\Controllers;

use App\Models\AiLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all users (admin only)
     */
    public function users(Request $request): JsonResponse
    {
        $users = User::withCount(['blogs', 'aiLogs'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($users);
    }

    /**
     * Get AI usage statistics
     */
    public function aiUsage(Request $request): JsonResponse
    {
        // Overall statistics
        $totalLogs = AiLog::count();
        $totalTokens = AiLog::sum('tokens_used');
        
        // Usage by action type
        $usageByAction = AiLog::select('action', DB::raw('COUNT(*) as count'), DB::raw('SUM(tokens_used) as total_tokens'))
            ->groupBy('action')
            ->get();

        // Daily usage for the last 30 days
        $dailyUsage = AiLog::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as requests'),
                DB::raw('SUM(tokens_used) as tokens')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->get();

        // Top users by token usage
        $topUsers = AiLog::select('user_id', DB::raw('SUM(tokens_used) as total_tokens'), DB::raw('COUNT(*) as request_count'))
            ->with('user:id,name,email')
            ->groupBy('user_id')
            ->orderBy('total_tokens', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'total_requests' => $totalLogs,
            'total_tokens' => $totalTokens,
            'usage_by_action' => $usageByAction,
            'daily_usage' => $dailyUsage,
            'top_users' => $topUsers,
        ]);
    }

    /**
     * Get user details (admin only)
     */
    public function userDetails(Request $request, string $id): JsonResponse
    {
        $user = User::with(['blogs' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }])->withCount(['blogs', 'aiLogs'])->findOrFail($id);

        $tokenUsage = AiLog::where('user_id', $id)->sum('tokens_used');

        return response()->json([
            'user' => $user,
            'total_tokens_used' => $tokenUsage,
        ]);
    }

    /**
     * Update user role
     */
    public function updateUserRole(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:writer,admin'],
        ]);

        $user = User::findOrFail($id);

        // Prevent removing last admin
        if ($user->role === 'admin' && $validated['role'] === 'writer') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot remove the last admin user',
                ], 400);
            }
        }

        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Delete user (admin only)
     */
    public function deleteUser(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Cannot delete your own account',
            ], 400);
        }

        // Prevent deleting last admin
        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot delete the last admin user',
                ], 400);
            }
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request): JsonResponse
    {
        $totalUsers = User::count();
        $totalBlogs = DB::table('blogs')->count();
        $publishedBlogs = DB::table('blogs')->where('status', 'published')->count();
        $totalTokens = AiLog::sum('tokens_used');
        
        // Recent activity
        $recentBlogs = DB::table('blogs')
            ->join('users', 'blogs.user_id', '=', 'users.id')
            ->select('blogs.id', 'blogs.title', 'blogs.status', 'blogs.created_at', 'users.name as author')
            ->orderBy('blogs.created_at', 'desc')
            ->limit(5)
            ->get();

        $recentUsers = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_blogs' => $totalBlogs,
                'published_blogs' => $publishedBlogs,
                'total_tokens_used' => $totalTokens,
            ],
            'recent_blogs' => $recentBlogs,
            'recent_users' => $recentUsers,
        ]);
    }
}
