# Bloggen - AI-Powered Blog Generator

A modern, responsive web application for generating AI-powered blog posts with a beautiful user interface built using Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **AI-Powered Blog Generation**: Generate high-quality blog posts with customizable tone, length, and keywords
- **Modern UI/UX**: Clean, responsive design with smooth animations and micro-interactions
- **Dark/Light Mode**: Toggle between dark and light themes with persistent storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimized**: Proper meta tags, OpenGraph support, and semantic HTML
- **Blog Management**: View all generated blogs with filtering and search functionality
- **Contact Forms**: Fully validated contact form with multiple categories
- **Skeleton Loading**: Elegant loading states for better user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **TypeScript**: Full type safety throughout the application

## 📱 Pages

- **Homepage (/)**: Hero section with features and call-to-action
- **Generate (/generate)**: Blog generation form with validation
- **Blogs (/blogs)**: Blog listing with search and filtering
- **Blog Detail (/blogs/[id])**: Individual blog post view
- **About (/about)**: Company information and team details
- **Contact (/contact)**: Contact form with validation

## 🎨 Design Features

- **Gradient Backgrounds**: Modern gradient designs throughout
- **Hover Effects**: Interactive elements with smooth hover states
- **Micro-interactions**: Subtle animations that enhance user experience
- **Consistent Spacing**: 8px spacing system for visual harmony
- **Typography**: Professional font hierarchy with Inter font family
- **Color System**: Comprehensive color palette with semantic naming

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bloggen
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (pages)/           # Page components
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── blog-card.tsx     # Blog card component
│   ├── blog-skeleton.tsx # Loading skeleton
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Site footer
│   └── theme-provider.tsx # Theme context
├── lib/                   # Utility functions
│   └── utils.ts          # Helper utilities
├── public/               # Static assets
└── README.md            # Project documentation
```

## 🎯 Key Components

### Header Navigation
- Responsive navigation with mobile hamburger menu
- Active link highlighting
- Dark/light mode toggle
- Smooth animations

### Blog Cards
- Hover effects and transitions
- Author information and read time
- Category badges and tags
- Responsive grid layout

### Form Validation
- Client-side validation with error messages
- Loading states and success feedback
- Accessibility features

### Theme System
- Dark/light mode with system preference detection
- Persistent theme storage
- Smooth theme transitions

## 🔧 Customization

### Adding New Pages
1. Create a new file in the `app/` directory
2. Follow the existing page structure
3. Add navigation links to `components/header.tsx`
4. Update the footer links if needed

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update `app/globals.css` for global styles
- Use the existing color system for consistency

### Components
- All UI components are in `components/ui/`
- Custom components are in `components/`
- Follow the existing naming conventions

## 🌐 SEO Features

- Dynamic meta tags for each page
- OpenGraph and Twitter Card support
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Structured data ready

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interactions
- Optimized typography scaling

## 🎭 Animation System

- Page transitions with Framer Motion
- Staggered animations for lists
- Hover and focus states
- Loading animations
- Smooth theme transitions

## 📊 Performance

- Optimized images with Next.js Image component
- Lazy loading for components
- Efficient bundle splitting
- Minimal JavaScript footprint
- CSS optimizations

## 🔮 Future Enhancements

- [ ] Real backend integration
- [ ] User authentication
- [ ] Blog editing capabilities
- [ ] Social sharing features
- [ ] Advanced search functionality
- [ ] Analytics integration
- [ ] Payment integration
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📞 Support

For support, email hello@bloggen.com or create an issue on GitHub.