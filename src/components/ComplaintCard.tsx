import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type Complaint } from '@/types/complaint';
import { useComplaints } from '@/contexts/ComplaintsContext';

interface ComplaintCardProps {
  complaint: Complaint;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const { updateComplaint, deleteComplaint } = useComplaints();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: complaint.title,
    description: complaint.description,
    type: complaint.type
  });

  const handleEdit = async () => {
    try {
      await updateComplaint(complaint.id, editForm);
      setIsEditing(false);
      toast.success('Complaint updated successfully!');
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteComplaint(complaint.id);
        toast.success('Complaint deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete complaint');
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{complaint.title}</h3>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Complaint</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Category</Label>
                  <Select value={editForm.type} onValueChange={value => setEditForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger id="edit-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="service">Customer Service</SelectItem>
                      <SelectItem value="product">Product Quality</SelectItem>
                      <SelectItem value="delivery">Delivery & Shipping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleEdit}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <span className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
        complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {complaint.status}
      </span>
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
