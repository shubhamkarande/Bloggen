'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock blog data
const mockBlogData = {
  id: '1',
  title: 'The Future of AI in Healthcare: Transforming Patient Care',
  content: `
    <p>Artificial Intelligence is revolutionizing healthcare in ways we never imagined possible. From diagnosis to treatment, AI is becoming an integral part of modern medical practice.</p>
    
    <h2>Introduction</h2>
    <p>The healthcare industry is experiencing a technological revolution. Artificial Intelligence (AI) is at the forefront of this transformation, offering unprecedented opportunities to improve patient outcomes, reduce costs, and enhance the overall quality of care.</p>
    
    <h2>AI in Medical Diagnosis</h2>
    <p>One of the most promising applications of AI in healthcare is in medical diagnosis. Machine learning algorithms can analyze medical images, lab results, and patient histories to identify patterns that might be missed by human clinicians.</p>
    
    <blockquote>
      <p>"AI has the potential to democratize healthcare by making expert-level diagnosis available to everyone, regardless of their location or economic status."</p>
    </blockquote>
    
    <h3>Key Benefits:</h3>
    <ul>
      <li>Faster and more accurate diagnoses</li>
      <li>Early detection of diseases</li>
      <li>Reduced diagnostic errors</li>
      <li>Improved patient outcomes</li>
    </ul>
    
    <h2>Personalized Treatment Plans</h2>
    <p>AI enables healthcare providers to create personalized treatment plans based on individual patient characteristics, medical history, and genetic information. This approach leads to more effective treatments with fewer side effects.</p>
    
    <h2>Challenges and Considerations</h2>
    <p>While AI offers tremendous benefits, there are several challenges that need to be addressed:</p>
    
    <ol>
      <li><strong>Data Privacy:</strong> Protecting patient information is crucial</li>
      <li><strong>Regulatory Compliance:</strong> Ensuring AI systems meet healthcare regulations</li>
      <li><strong>Integration:</strong> Seamlessly incorporating AI into existing workflows</li>
      <li><strong>Training:</strong> Educating healthcare professionals on AI technologies</li>
    </ol>
    
    <h2>The Road Ahead</h2>
    <p>The future of AI in healthcare is bright. As technology continues to advance, we can expect to see even more innovative applications that will transform how we approach patient care.</p>
    
    <p>Healthcare organizations that embrace AI today will be better positioned to provide superior care tomorrow. The key is to start with pilot programs, gradually expanding AI implementation while ensuring patient safety and data security.</p>
    
    <h2>Conclusion</h2>
    <p>AI is not just a tool for the future—it's a reality that's already changing healthcare today. By embracing this technology responsibly, we can create a healthcare system that is more efficient, effective, and accessible to all.</p>
  `,
  author: 'Dr. Sarah Johnson',
  date: '2024-01-15',
  readTime: '8 min read',
  category: 'Healthcare',
  image: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
  tags: ['AI', 'Healthcare', 'Technology', 'Medicine'],
  authorImage: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlog(mockBlogData);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-muted rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Blog not found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Navigation */}
          <motion.div variants={itemVariants} className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Link>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{blog.category}</Badge>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {blog.readTime}
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={blog.authorImage} alt={blog.author} />
                  <AvatarFallback>{blog.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{blog.author}</p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div variants={itemVariants} className="mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="mb-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div variants={itemVariants} className="mb-8">
            <Separator className="mb-6" />
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Author Bio */}
          <motion.div variants={itemVariants} className="mb-8">
            <Separator className="mb-6" />
            <div className="flex items-start gap-4 p-6 bg-muted rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={blog.authorImage} alt={blog.author} />
                <AvatarFallback>{blog.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg mb-2">About {blog.author}</h3>
                <p className="text-muted-foreground">
                  {blog.author} is a leading expert in healthcare technology and AI applications. 
                  With over 15 years of experience in the medical field, she specializes in 
                  integrating artificial intelligence solutions into clinical practice.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Related Articles CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <Separator className="mb-6" />
            <h3 className="text-xl font-semibold mb-4">
              Discover More Articles
            </h3>
            <Button asChild size="lg">
              <Link href="/blogs">
                Browse All Blogs
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}