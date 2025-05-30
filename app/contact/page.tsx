import { Metadata } from 'next';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with our team',
};

export default function ContactPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg text-muted-foreground mb-6">
            Have a question or want to work with us? Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <div className="space-y-4 mt-8">
            <div>
              <h3 className="font-medium text-lg">Email</h3>
              <p className="text-muted-foreground">hello@example.com</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Address</h3>
              <p className="text-muted-foreground">
                123 Web Developer Lane<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}