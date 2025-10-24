import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type ComplaintStatus = "open" | "in_progress" | "resolved";
export type Complaint = {
  id: number;
  userId: string;
  title: string;
  description: string;  // Fixed: removed malformed type
  type: string;
  status: ComplaintStatus;
  createdAt: string;
};

type ComplaintsContextType = {
  complaints?: Complaint[];
  isLoading: boolean;
  addComplaint: (c: { userId: string; title: string; description: string; type: string }) => Promise<void>;
  updateComplaintStatus: (id: number, status: ComplaintStatus) => Promise<void>;
  getComplaintsByUser: (userId: string) => Complaint[] | undefined;
};

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

// Replace process.env with import.meta.env
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const ComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = useQueryClient();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/complaints`);
      if (!res.ok) throw new Error("Failed to fetch complaints");
      return res.json() as Promise<Complaint[]>;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { userId: string; title: string; description: string; type: string }) => {
      const res = await fetch(`${API}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create complaint");
      return res.json() as Promise<Complaint>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ComplaintStatus }) => {
      const res = await fetch(`${API}/api/complaints/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      return data as Complaint;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
    }
  });

  const addComplaint = async (c: { userId: string; title: string; description: string; type: string }) => {
    await createMutation.mutateAsync(c);
  };

  const updateComplaintStatus = async (id: number, status: ComplaintStatus) => {
    await statusMutation.mutateAsync({ id, status });
  };

  const getComplaintsByUser = (userId: string) => 
    complaints?.filter((c): c is Complaint => Boolean(c && c.userId === userId));

  return (
    <ComplaintsContext.Provider value={{ complaints, isLoading, addComplaint, updateComplaintStatus, getComplaintsByUser }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = (): ComplaintsContextType => {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error("useComplaints must be used within ComplaintsProvider");
  return ctx;
};