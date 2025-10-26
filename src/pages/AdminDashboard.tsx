import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Complaint, type ComplaintStatus } from '@/types/complaint';
import { AdminComplaintCard } from '../components/AdminComplaintCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Calendar,
  User2,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { complaints, isLoading, updateComplaintStatus } = useComplaints();
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStatusUpdate = async (id: number, status: ComplaintStatus) => {
    try {
      await updateComplaintStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filterByStatus = (status?: ComplaintStatus) => {
    if (!status) return complaints;
    return complaints.filter(c => c.status === status);
  };

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ComplaintStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  if (isLoading) {
    return <div>Loading complaints...</div>;
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
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onStatusChange={handleStatusUpdate}
                  onClick={() => handleComplaintClick(complaint)}
                />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterByStatus('pending').map(complaint => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onStatusChange={handleStatusUpdate}
                  onClick={() => handleComplaintClick(complaint)}
                />
              ))}
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4">
              {filterByStatus('in_progress').map(complaint => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onStatusChange={handleStatusUpdate}
                  onClick={() => handleComplaintClick(complaint)}
                />
              ))}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {filterByStatus('resolved').map(complaint => (
                <AdminComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onStatusChange={handleStatusUpdate}
                  onClick={() => handleComplaintClick(complaint)}
                />
              ))}
            </TabsContent>
          </Tabs>

          <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Complaint Details
                </DialogTitle>
                <DialogDescription>
                  View and manage complaint information
                </DialogDescription>
              </DialogHeader>

              {selectedComplaint && (
                <div className="space-y-6 pt-4">
                  {/* Status Section */}
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(selectedComplaint.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <Select
                      value={selectedComplaint.status}
                      onValueChange={(value: ComplaintStatus) => 
                        handleStatusUpdate(selectedComplaint.id, value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{selectedComplaint.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {selectedComplaint.description}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User2 className="h-4 w-4" />
                        <span>Submitted by</span>
                      </div>
                      <p className="font-medium">{selectedComplaint.userId}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span>Type</span>
                      </div>
                      <p className="font-medium">{selectedComplaint.type}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Submission Date</span>
                      </div>
                      <p className="font-medium">
                        {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Submission Time</span>
                      </div>
                      <p className="font-medium">
                        {new Date(selectedComplaint.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
