import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Complaint, type ComplaintStatus } from '@/types/complaint';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const qc = useQueryClient();

  // ✅ Fetch complaints using React Query
  const { data: complaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ['complaints', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`${API_URL}/api/complaints?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch complaints');
      return res.json();
    },
    enabled: !!user?.id, // Only run when user is logged in
  });

  // ✅ Create Complaint
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
    onSuccess: (newComplaint) => {
      // Instantly update cache for instant UI update
      qc.setQueryData<Complaint[]>(['complaints', user?.id], (old = []) => [newComplaint, ...old]);
      toast.success('Complaint submitted successfully');
    },
    onError: () => toast.error('Failed to submit complaint'),
  });

  // ✅ Update Complaint Status
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
    onSuccess: (updatedComplaint) => {
      qc.setQueryData<Complaint[]>(['complaints', user?.id], (old = []) =>
        old.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
      );
      toast.success('Complaint status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  // ✅ Update Complaint
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
    onSuccess: (updatedComplaint) => {
      qc.setQueryData<Complaint[]>(['complaints', user?.id], (old = []) =>
        old.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
      );
      toast.success('Complaint updated successfully');
    },
    onError: () => toast.error('Failed to update complaint'),
  });

  // ✅ Delete Complaint
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/api/complaints/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete complaint');
      }
      return id;
    },
    onSuccess: (deletedId) => {
      qc.setQueryData<Complaint[]>(['complaints', user?.id], (old = []) =>
        old.filter((c) => c.id !== deletedId)
      );
      toast.success('Complaint deleted');
    },
    onError: () => toast.error('Failed to delete complaint'),
  });

  // ✅ Helper functions
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
    return complaints.filter((c) => String(c.userId) === String(userId));
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        isLoading,
        addComplaint,
        updateComplaintStatus,
        getComplaintsByUser,
        updateComplaint,
        deleteComplaint,
      }}
    >
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
