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

  // Filter complaints for the logged-in user
  const userComplaints = React.useMemo(() => {
    if (!user?.id) {
      console.log('No user ID found yet');
      return [];
    }

    const currentUserId = String(user.id);

    const filtered = (complaints || []).filter(complaint => {
      const complaintUserId = String(complaint.userId);
      const matches = complaintUserId === currentUserId;

      console.log('Filtering complaint:', {
        complaintId: complaint.id,
        complaintUserId,
        currentUserId,
        matches
      });

      return matches;
    });

    console.log('Filtered complaints for user:', filtered);
    return filtered;
  }, [complaints, user?.id]);

  // Filter complaints by status
  const filterByStatus = (status?: ComplaintStatus) => {
    if (!status) return userComplaints;
    return userComplaints.filter(c => c.status === status);
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
              <div className="text-2xl font-bold">{userComplaints.length}</div>
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
              {userComplaints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No complaints found. Click "Submit Complaint" to create one.
                </div>
              ) : (
                userComplaints.map(complaint => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))
              )}
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
