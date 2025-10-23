import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ComplaintCard, Complaint } from '@/components/ComplaintCard';
import { MessageSquare, Plus, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock data - would come from backend in production
  const [complaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Website Loading Speed Issue',
      description: 'The website takes too long to load on mobile devices. Pages take over 5 seconds to display content.',
      category: 'Technical',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Payment Gateway Not Working',
      description: 'Unable to complete payment. Transaction fails at the final step with error code 500.',
      category: 'Billing',
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Customer Support Response Time',
      description: 'Submitted a support ticket 3 days ago but haven\'t received any response yet.',
      category: 'Service',
      status: 'resolved',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filterByStatus = (status?: string) => {
    if (!status) return complaints;
    return complaints.filter(c => c.status === status);
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.fullName}</span>
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Complaints</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage your submitted complaints
              </p>
            </div>
            <Button onClick={() => navigate('/submit-complaint')} className="gradient-primary shadow-elegant">
              <Plus className="mr-2 h-5 w-5" />
              Submit Complaint
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 shadow-card">
              <div className="text-2xl font-bold">{complaints.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow-card">
              <div className="text-2xl font-bold text-yellow-600">
                {filterByStatus('pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow-card">
              <div className="text-2xl font-bold text-blue-600">
                {filterByStatus('in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow-card">
              <div className="text-2xl font-bold text-green-600">
                {filterByStatus('resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>

          {/* Complaints List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {complaints.map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterByStatus('pending').map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4">
              {filterByStatus('in_progress').map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {filterByStatus('resolved').map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
