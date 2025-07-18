'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    tags: string[];
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
        <Link href={`/blogs/${blog.id}`}>
          <div className="aspect-video relative overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-background/80 text-foreground">
                {blog.category}
              </Badge>
            </div>
          </div>
        </Link>
        
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            {new Date(blog.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            <span>•</span>
            <Clock className="h-4 w-4" />
            {blog.readTime}
          </div>
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
            <Link href={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-3 mb-4 text-base">
            {blog.excerpt}
          </CardDescription>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`} alt={blog.author} />
                <AvatarFallback>{blog.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{blog.author}</span>
            </div>
            
            <Link href={`/blogs/${blog.id}`} className="flex items-center gap-1 text-primary hover:gap-2 transition-all text-sm font-medium">
              Read more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}