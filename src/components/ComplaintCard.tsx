import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, ComplaintStatus } from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
  userEmail?: string;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
  showUser?: boolean;
}

export const ComplaintCard = ({ complaint, onClick, showUser }: ComplaintCardProps) => {
  return (
    <Card 
      className="hover:shadow-card transition-all duration-200 cursor-pointer border-border"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{complaint.title}</CardTitle>
            <CardDescription className="mt-1.5 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDistanceToNow(complaint.createdAt, { addSuffix: true })}
              </span>
              {showUser && complaint.userEmail && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {complaint.userEmail}
                  </span>
                </>
              )}
            </CardDescription>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {complaint.description}
        </p>
        <Badge variant="secondary" className="text-xs">
          {complaint.category}
        </Badge>
      </CardContent>
    </Card>
  );
};
