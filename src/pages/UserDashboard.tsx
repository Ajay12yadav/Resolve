import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ComplaintCard } from '@/components/ComplaintCard';
import { MessageSquare, Plus, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Complaint, type ComplaintStatus } from '@/types/complaint';
import React from 'react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { complaints, isLoading } = useComplaints();
  const navigate = useNavigate();

  const filterByStatus = (status: ComplaintStatus) => {
    return complaints.filter(complaint => complaint.status === status);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">Loading complaints...</div>
      </div>
    );
  }

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
              <div className="text-sm text-muted-foreground">Total Complaints</div>
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
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No complaints filed yet. Click "Submit Complaint" to get started.
              </div>
            ) : (
              complaints.map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
