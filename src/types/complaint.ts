export type ComplaintStatus = "pending" | "in_progress" | "resolved" | "rejected";

export interface Complaint {
  id: number;
  userId: string;
  userEmail?: string;
  title: string;
  description: string;
  category?: string;
  type: string;
  status: ComplaintStatus;
  createdAt: string;
}