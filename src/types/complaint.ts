export type ComplaintStatus = "pending" | "in_progress" | "resolved";

export interface Complaint {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: string;
  status: ComplaintStatus;
  createdAt: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}