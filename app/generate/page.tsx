'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function GeneratePage() {
  const [formData, setFormData] = useState({
    topic: '',
    tone: '',
    keywords: '',
    length: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to generated blog (mock ID)
    const mockId = Date.now().toString();
    router.push(`/blogs/${mockId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-2xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Generate Your Blog Post
            </h1>
            <p className="text-xl text-muted-foreground">
              Fill in the details below and let AI create an amazing blog post for you.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Blog Generation Form</CardTitle>
                <CardDescription>
                  Provide details about your desired blog post to get the best results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-base font-medium">
                      Blog Topic *
                    </Label>
                    <Input
                      id="topic"
                      type="text"
                      placeholder="e.g., The Future of AI in Healthcare"
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-base font-medium">
                      Writing Tone *
                    </Label>
                    <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select writing tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-base font-medium">
                      Article Length *
                    </Label>
                    <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select article length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (500-800 words)</SelectItem>
                        <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                        <SelectItem value="long">Long (1200-2000 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-base font-medium">
                      Keywords (Optional)
                    </Label>
                    <Input
                      id="keywords"
                      type="text"
                      placeholder="e.g., AI, machine learning, healthcare, technology"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      className="text-base"
                    />
                    <p className="text-sm text-muted-foreground">
                      Separate keywords with commas for better SEO optimization.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Additional Details (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Any specific points you want to cover, target audience, or additional context..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="text-base"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg py-6"
                    disabled={isLoading || !formData.topic || !formData.tone || !formData.length}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Your Blog Post...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Generate Blog Post
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}