import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAdmitCards, createAdmitCard, updateAdmitCard, deleteAdmitCard } from '@/db/api';
import type { AdmitCard } from '@/types/index';
import AdminLayout from '@/components/layouts/AdminLayout';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAdmitCardsPage() {
  const [admitCards, setAdmitCards] = useState<AdmitCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<AdmitCard | null>(null);
  const [formData, setFormData] = useState({
    exam_name: '',
    organization: '',
    release_date: '',
    exam_date: '',
    download_link: '',
  });

  useEffect(() => {
    loadAdmitCards();
  }, []);

  const loadAdmitCards = async () => {
    try {
      const data = await getAdmitCards();
      setAdmitCards(data);
    } catch (error) {
      console.error('Error loading admit cards:', error);
      toast.error('Failed to load admit cards');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCard) {
        await updateAdmitCard(editingCard.id, formData);
        toast.success('Admit card updated successfully');
      } else {
        await createAdmitCard(formData);
        toast.success('Admit card created successfully');
      }
      setDialogOpen(false);
      resetForm();
      loadAdmitCards();
    } catch (error) {
      console.error('Error saving admit card:', error);
      toast.error('Failed to save admit card');
    }
  };

  const handleEdit = (card: AdmitCard) => {
    setEditingCard(card);
    setFormData({
      exam_name: card.exam_name,
      organization: card.organization,
      release_date: card.release_date,
      exam_date: card.exam_date,
      download_link: card.download_link,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmitCard(id);
      toast.success('Admit card deleted successfully');
      loadAdmitCards();
    } catch (error) {
      console.error('Error deleting admit card:', error);
      toast.error('Failed to delete admit card');
    }
  };

  const resetForm = () => {
    setEditingCard(null);
    setFormData({
      exam_name: '',
      organization: '',
      release_date: '',
      exam_date: '',
      download_link: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Admit Cards</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admit Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCard ? 'Edit Admit Card' : 'Add New Admit Card'}</DialogTitle>
                <DialogDescription>
                  {editingCard ? 'Update admit card details' : 'Fill in the details to create a new admit card'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_name">Exam Name</Label>
                  <Input
                    id="exam_name"
                    value={formData.exam_name}
                    onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="release_date">Release Date</Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam_date">Exam Date</Label>
                  <Input
                    id="exam_date"
                    type="date"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="download_link">Download Link</Label>
                  <Input
                    id="download_link"
                    type="url"
                    value={formData.download_link}
                    onChange={(e) => setFormData({ ...formData, download_link: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingCard ? 'Update Admit Card' : 'Create Admit Card'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Admit Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Exam Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admitCards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No admit cards found
                        </TableCell>
                      </TableRow>
                    ) : (
                      admitCards.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell className="font-medium">{card.exam_name}</TableCell>
                          <TableCell>{card.organization}</TableCell>
                          <TableCell>{formatDate(card.exam_date)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(card)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Admit Card</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this admit card? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(card.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
