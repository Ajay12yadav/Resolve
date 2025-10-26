import { type ComplaintStatus } from '@/types/complaint';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
