import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ComplaintHub</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth?mode=signup')} className="gradient-primary">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Manage Complaints
            <span className="block gradient-primary bg-clip-text text-transparent">
              Efficiently & Transparently
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete 3-tier complaint management system that streamlines the process 
            of submitting, tracking, and resolving complaints.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth?mode=signup')} className="gradient-primary shadow-elegant">
              Start Filing Complaints
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Admin Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Submission</h3>
            <p className="text-muted-foreground">
              Submit complaints quickly with our intuitive form. Track status in real-time.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your data is protected with JWT authentication and role-based access control.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Fast Resolution</h3>
            <p className="text-muted-foreground">
              Admin dashboard for efficient complaint management and resolution tracking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 p-12 rounded-2xl gradient-primary shadow-elegant">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to get started?
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Join thousands of users managing their complaints efficiently
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth?mode=signup')}>
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 ComplaintHub. Built with React, Express & PostgreSQL.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
