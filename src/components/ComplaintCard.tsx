import { type Complaint } from '@/types/complaint';

interface ComplaintCardProps {
  complaint: Complaint;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  console.log('Rendering complaint:', complaint); // Debug log

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{complaint.title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
          complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {complaint.status}
        </span>
      </div>
      <p className="text-muted-foreground mt-2">{complaint.description}</p>
      <div className="mt-2 text-sm text-muted-foreground">
        Type: {complaint.type}
        <span className="ml-4">
          Filed on: {new Date(complaint.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
