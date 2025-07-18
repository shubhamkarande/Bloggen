'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Users, Target, Award, Heart, Zap } from 'lucide-react';

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

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    bio: 'Former tech executive with 15+ years in AI and content technology.',
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    bio: 'AI researcher and engineer specializing in natural language processing.',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Head of Product',
    image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    bio: 'Product strategist focused on user experience and content creation tools.',
  },
  {
    name: 'David Kumar',
    role: 'Lead Developer',
    image: 'https://images.pexels.com/photos/3777622/pexels-photo-3777622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    bio: 'Full-stack developer passionate about building scalable AI applications.',
  },
];

const values = [
  {
    icon: Target,
    title: 'Innovation',
    description: 'We push the boundaries of what\'s possible with AI technology.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in empowering creators and building together.',
  },
  {
    icon: Heart,
    title: 'Quality',
    description: 'Every piece of content generated meets the highest standards.',
  },
  {
    icon: Zap,
    title: 'Speed',
    description: 'We deliver results fast without compromising on quality.',
  },
];

const stats = [
  { label: 'Blog Posts Generated', value: '50,000+' },
  { label: 'Active Users', value: '10,000+' },
  { label: 'Countries Served', value: '120+' },
  { label: 'Average Rating', value: '4.9/5' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              About Bloggen
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to democratize content creation through the power of artificial intelligence.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Our Story</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                  <p>
                    Bloggen was born from a simple observation: creating high-quality content shouldn't be 
                    a barrier to sharing great ideas. In 2023, our team of AI researchers and content 
                    creators came together with a vision to make professional-grade content creation 
                    accessible to everyone.
                  </p>
                  <p>
                    We noticed that while AI technology was advancing rapidly, there was still a gap 
                    between powerful AI models and user-friendly content creation tools. Bloggen bridges 
                    that gap by providing an intuitive platform that harnesses the latest in natural 
                    language processing to generate engaging, SEO-optimized blog posts.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of content creators, marketers, and businesses 
                    worldwide, helping them tell their stories and share their expertise with the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Bloggen.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind Bloggen's success.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="secondary">{member.role}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <p className="text-lg leading-relaxed">
                      To empower every individual and organization to create compelling, 
                      professional-quality content that engages audiences and drives results. 
                      We believe that great ideas deserve great presentation, and AI should 
                      be a tool that amplifies human creativity, not replaces it.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Technology Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built on cutting-edge AI and designed for the future of content creation.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Advanced NLP',
                  description: 'Powered by state-of-the-art language models for natural, engaging content.',
                },
                {
                  title: 'SEO Optimization',
                  description: 'Every post is automatically optimized for search engines and readability.',
                },
                {
                  title: 'Scalable Infrastructure',
                  description: 'Built to handle millions of requests with consistent performance.',
                },
              ].map((tech, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{tech.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}