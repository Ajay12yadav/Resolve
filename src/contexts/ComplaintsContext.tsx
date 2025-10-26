import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Complaint, type ComplaintStatus } from '@/types/complaint';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; // Updated import path

type ComplaintsContextType = {
  complaints: Complaint[];
  isLoading: boolean;
  addComplaint: (c: { userId: string; title: string; description: string; type: string }) => Promise<void>;
  updateComplaintStatus: (id: number, status: ComplaintStatus) => Promise<void>;
  getComplaintsByUser: (userId: string) => Complaint[];
  updateComplaint: (id: number, data: { title: string; description: string; type: string }) => Promise<void>;
  deleteComplaint: (id: number) => Promise<void>;
};

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const ComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const qc = useQueryClient();

  const fetchComplaints = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch(`${API_URL}/api/complaints?userId=${user.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await res.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchComplaints();
    }
  }, [user?.id]);

  const createMutation = useMutation<
    Complaint,
    Error,
    { userId: string; title: string; description: string; type: string }
  >({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create complaint');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] });
    }
  });

  const statusMutation = useMutation<
    Complaint,
    Error,
    { id: number; status: ComplaintStatus }
  >({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`${API_URL}/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; description: string; type: string } }) => {
      const res = await fetch(`${API_URL}/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update complaint');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/api/complaints/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete complaint');
      }
      return id; // Return the deleted ID
    },
    onSuccess: (deletedId) => {
      // Immediately update the cache to remove the deleted complaint
      qc.setQueryData(['complaints'], (old: Complaint[] | undefined) => {
        if (!old) return [];
        return old.filter(complaint => complaint.id !== deletedId);
      });
      // Also invalidate the query to refetch from server
      qc.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast.error('Failed to delete complaint');
    }
  });

  const addComplaint = async (c: { userId: string; title: string; description: string; type: string }) => {
    await createMutation.mutateAsync(c);
  };

  const updateComplaintStatus = async (id: number, status: ComplaintStatus) => {
    await statusMutation.mutateAsync({ id, status });
  };

  const updateComplaint = async (id: number, data: { title: string; description: string; type: string }) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteComplaint = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const getComplaintsByUser = (userId: string) => {
    return complaints.filter(c => String(c.userId) === String(userId));
  };

  return (
    <ComplaintsContext.Provider value={{
      complaints,
      isLoading,
      deleteComplaint,
      addComplaint, 
      updateComplaintStatus, 
      getComplaintsByUser,
      updateComplaint
    }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintsProvider');
  }
  return context;
};
