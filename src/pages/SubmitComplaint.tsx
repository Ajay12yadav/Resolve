import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MessageSquare, ArrowLeft } from 'lucide-react';

const SubmitComplaint = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert userId to string
      await addComplaint({
        userId: String(user?.id || ''), // Convert to string
        title: formData.title,
        description: formData.description,
        type: formData.category,
      });

      toast.success('Complaint submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ComplaintHub</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Submit a Complaint</h1>
            <p className="text-muted-foreground mt-1">
              Fill out the form below to submit your complaint. We'll review it and get back to you soon.
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible to help us resolve your issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of your complaint"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Keep it concise and descriptive
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="service">Customer Service</SelectItem>
                      <SelectItem value="product">Product Quality</SelectItem>
                      <SelectItem value="delivery">Delivery & Shipping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your complaint in detail. Include any relevant information such as order numbers, dates, or error messages."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 20 characters
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Submitted by</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{user?.fullName}</p>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.category || !formData.description}
                    className="flex-1 gradient-primary"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. Your complaint will be reviewed by our team within 24 hours</p>
              <p>2. We'll update the status as we investigate and work on a solution</p>
              <p>3. You can track progress anytime from your dashboard</p>
              <p>4. You'll receive a notification once it's resolved</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SubmitComplaint;
