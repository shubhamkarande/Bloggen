'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function BlogSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
        <div className="h-6 w-1/2 bg-muted rounded animate-pulse"></div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="flex gap-1 mt-4">
          <div className="h-6 w-12 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-14 bg-muted rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}