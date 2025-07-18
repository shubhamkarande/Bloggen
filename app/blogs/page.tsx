'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/blog-card';
import { BlogSkeleton } from '@/components/blog-skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen } from 'lucide-react';

// Mock blog data
const mockBlogs = [
  {
    id: '1',
    title: 'The Future of AI in Healthcare',
    excerpt: 'Exploring how artificial intelligence is revolutionizing medical diagnosis, treatment, and patient care.',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Healthcare',
    image: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    tags: ['AI', 'Healthcare', 'Technology'],
  },
  {
    id: '2',
    title: 'Web Development Trends for 2024',
    excerpt: 'Discover the latest trends and technologies shaping the web development landscape this year.',
    author: 'Alex Martinez',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    tags: ['Web Development', 'Frontend', 'React'],
  },
  {
    id: '3',
    title: 'Sustainable Living: Small Changes, Big Impact',
    excerpt: 'Learn how simple lifestyle changes can contribute to a more sustainable and eco-friendly future.',
    author: 'Emma Green',
    date: '2024-01-08',
    readTime: '5 min read',
    category: 'Lifestyle',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    tags: ['Sustainability', 'Environment', 'Lifestyle'],
  },
  {
    id: '4',
    title: 'The Psychology of Digital Marketing',
    excerpt: 'Understanding consumer behavior in the digital age and how to create effective marketing strategies.',
    author: 'Michael Chen',
    date: '2024-01-05',
    readTime: '7 min read',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    tags: ['Marketing', 'Psychology', 'Digital'],
  },
  {
    id: '5',
    title: 'Remote Work: Building Effective Teams',
    excerpt: 'Strategies for creating productive and connected remote teams in the modern workplace.',
    author: 'Rachel Adams',
    date: '2024-01-03',
    readTime: '6 min read',
    category: 'Business',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    tags: ['Remote Work', 'Team Building', 'Productivity'],
  },
  {
    id: '6',
    title: 'Data Science for Beginners',
    excerpt: 'A comprehensive guide to getting started with data science and machine learning fundamentals.',
    author: 'David Kumar',
    date: '2024-01-01',
    readTime: '10 min read',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/590011/pexels-photo-590011.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    tags: ['Data Science', 'Machine Learning', 'Python'],
  },
];

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const categories = Array.from(new Set(blogs.map(blog => blog.category)));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Blog Posts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover insightful articles and stories generated by AI to inspire and inform.
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Blog Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading ? (
              // Show skeleton loaders
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <BlogSkeleton />
                </motion.div>
              ))
            ) : (
              // Show actual blogs
              filteredBlogs.map((blog) => (
                <motion.div key={blog.id} variants={itemVariants}>
                  <BlogCard blog={blog} />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Empty State */}
          {!loading && filteredBlogs.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}