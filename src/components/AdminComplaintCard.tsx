import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Complaint, type ComplaintStatus } from '@/types/complaint';
import { Calendar, User2, Tag, ArrowRight } from 'lucide-react';

interface AdminComplaintCardProps {
  complaint: Complaint;
  onStatusChange: (id: number, status: ComplaintStatus) => Promise<void>;
  onClick?: () => void;
}

export const AdminComplaintCard: React.FC<AdminComplaintCardProps> = ({
  complaint,
  onStatusChange,
  onClick
}) => {
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

  return (
    <div 
      className="group bg-card border border-border rounded-lg p-6 shadow-sm 
                 hover:shadow-md transition-all duration-200 cursor-pointer
                 hover:border-primary/20 relative overflow-hidden"
      onClick={onClick}
    >
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(complaint.status)}`} />
      
      <div className="flex justify-between items-start space-x-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate pr-4 group-hover:text-primary transition-colors">
            {complaint.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <User2 className="h-4 w-4" />
            <span>Submitted by: {complaint.userId}</span>
          </div>
        </div>

        <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
          <Select
            value={complaint.status}
            onValueChange={(value: ComplaintStatus) => onStatusChange(complaint.id, value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
          {complaint.status.replace('_', ' ')}
        </span>
      </div>

      <p className="mt-4 text-muted-foreground line-clamp-2">
        {complaint.description}
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4" />
          <span>{complaint.type}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};