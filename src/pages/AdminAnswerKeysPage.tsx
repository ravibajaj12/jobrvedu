import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAnswerKeys, createAnswerKey, updateAnswerKey, deleteAnswerKey } from '@/db/api';
import type { AnswerKey } from '@/types/index';
import AdminLayout from '@/components/layouts/AdminLayout';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAnswerKeysPage() {
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<AnswerKey | null>(null);
  const [formData, setFormData] = useState({
    exam_name: '',
    release_date: '',
    objection_last_date: '',
    pdf_link: '',
  });

  useEffect(() => {
    loadAnswerKeys();
  }, []);

  const loadAnswerKeys = async () => {
    try {
      const data = await getAnswerKeys();
      setAnswerKeys(data);
    } catch (error) {
      console.error('Error loading answer keys:', error);
      toast.error('Failed to load answer keys');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingKey) {
        await updateAnswerKey(editingKey.id, formData);
        toast.success('Answer key updated successfully');
      } else {
        await createAnswerKey(formData);
        toast.success('Answer key created successfully');
      }
      setDialogOpen(false);
      resetForm();
      loadAnswerKeys();
    } catch (error) {
      console.error('Error saving answer key:', error);
      toast.error('Failed to save answer key');
    }
  };

  const handleEdit = (key: AnswerKey) => {
    setEditingKey(key);
    setFormData({
      exam_name: key.exam_name,
      release_date: key.release_date,
      objection_last_date: key.objection_last_date,
      pdf_link: key.pdf_link,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnswerKey(id);
      toast.success('Answer key deleted successfully');
      loadAnswerKeys();
    } catch (error) {
      console.error('Error deleting answer key:', error);
      toast.error('Failed to delete answer key');
    }
  };

  const resetForm = () => {
    setEditingKey(null);
    setFormData({
      exam_name: '',
      release_date: '',
      objection_last_date: '',
      pdf_link: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <AdminLayout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Answer Keys</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Answer Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingKey ? 'Edit Answer Key' : 'Add New Answer Key'}</DialogTitle>
                <DialogDescription>
                  {editingKey ? 'Update answer key details' : 'Fill in the details to create a new answer key'}
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
                  <Label htmlFor="objection_last_date">Objection Last Date</Label>
                  <Input
                    id="objection_last_date"
                    type="date"
                    value={formData.objection_last_date}
                    onChange={(e) => setFormData({ ...formData, objection_last_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf_link">PDF Link</Label>
                  <Input
                    id="pdf_link"
                    type="url"
                    value={formData.pdf_link}
                    onChange={(e) => setFormData({ ...formData, pdf_link: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingKey ? 'Update Answer Key' : 'Create Answer Key'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Answer Keys</CardTitle>
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
                      <TableHead>Release Date</TableHead>
                      <TableHead>Objection Last Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answerKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No answer keys found
                        </TableCell>
                      </TableRow>
                    ) : (
                      answerKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.exam_name}</TableCell>
                          <TableCell>{formatDate(key.release_date)}</TableCell>
                          <TableCell>{formatDate(key.objection_last_date)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(key)}>
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
                                    <AlertDialogTitle>Delete Answer Key</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this answer key? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(key.id)}>
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
