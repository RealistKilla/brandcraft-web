import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about our company and mission',
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold tracking-tight mb-6">About Us</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-lg text-muted-foreground mb-6">
          We're a team of passionate developers and designers building the next generation of web applications.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-6">
          Our mission is to create beautiful, accessible, and performant web applications
          that provide incredible user experiences. We believe in the power of the web
          as a platform and strive to push its boundaries.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
        <p className="mb-6">
          Our diverse team brings together expertise from various disciplines including
          design, engineering, and product management. We collaborate closely to ensure
          that every aspect of our products meets the highest standards.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Technology</h2>
        <p className="mb-6">
          We leverage cutting-edge technologies like Next.js, React, and TypeScript
          to build fast, reliable, and maintainable applications. Our approach prioritizes
          performance, accessibility, and user experience.
        </p>
      </div>
    </div>
  );
}