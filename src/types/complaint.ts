export type ComplaintStatus = "open" | "pending" | "in_progress" | "resolved";

export interface Complaint {
  id: number;
  userId: string;
  title: string;
  description: string;
  type: string;
  status: ComplaintStatus;
  createdAt: string;
}