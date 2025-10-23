import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ComplaintCard, Complaint } from '@/components/ComplaintCard';
import { MessageSquare, LogOut, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { StatusBadge, ComplaintStatus } from '@/components/StatusBadge';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');

  // Mock data - would come from backend in production
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Website Loading Speed Issue',
      description: 'The website takes too long to load on mobile devices. Pages take over 5 seconds to display content.',
      category: 'Technical',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      userEmail: 'user@example.com',
    },
    {
      id: '2',
      title: 'Payment Gateway Not Working',
      description: 'Unable to complete payment. Transaction fails at the final step with error code 500.',
      category: 'Billing',
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      userEmail: 'john@example.com',
    },
    {
      id: '3',
      title: 'Customer Support Response Time',
      description: 'Submitted a support ticket 3 days ago but haven\'t received any response yet.',
      category: 'Service',
      status: 'resolved',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      userEmail: 'alice@example.com',
    },
    {
      id: '4',
      title: 'Product Quality Issue',
      description: 'Received damaged product. Packaging was torn and item has visible defects.',
      category: 'Product',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      userEmail: 'bob@example.com',
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

  const handleUpdateStatus = () => {
    if (!selectedComplaint) return;

    setComplaints(prev =>
      prev.map(c =>
        c.id === selectedComplaint.id
          ? { ...c, status: newStatus, updatedAt: new Date() }
          : c
      )
    );

    toast.success(`Complaint status updated to ${newStatus.replace('_', ' ')}`);
    setSelectedComplaint(null);
    setAdminNotes('');
  };

  const openComplaintDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ComplaintHub Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Admin: <span className="font-medium text-foreground">{user?.fullName}</span>
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
              <h1 className="text-3xl font-bold">Complaint Management</h1>
              <p className="text-muted-foreground mt-1">
                Review and manage all user complaints
              </p>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
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
              <div className="text-sm text-muted-foreground">Pending Review</div>
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
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {complaints.map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => openComplaintDialog(complaint)}
                  showUser
                />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterByStatus('pending').map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => openComplaintDialog(complaint)}
                  showUser
                />
              ))}
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4">
              {filterByStatus('in_progress').map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => openComplaintDialog(complaint)}
                  showUser
                />
              ))}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {filterByStatus('resolved').map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => openComplaintDialog(complaint)}
                  showUser
                />
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {filterByStatus('rejected').map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => openComplaintDialog(complaint)}
                  showUser
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>
              Review and update the status of this complaint
            </DialogDescription>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Complaint Details</Label>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold">{selectedComplaint.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs">Category: {selectedComplaint.category}</span>
                    <span>•</span>
                    <span className="text-xs">User: {selectedComplaint.userEmail}</span>
                  </div>
                  <div className="pt-2">
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Update Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ComplaintStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or comments about this complaint..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus} className="gradient-primary">
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
