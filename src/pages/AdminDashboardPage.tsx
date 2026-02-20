import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, CreditCard, Key } from 'lucide-react';
import { getStats } from '@/db/api';
import type { Stats } from '@/types/index';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-full bg-muted" />
                    <Skeleton className="mt-2 h-8 w-20 bg-muted" />
                    <Skeleton className="mt-1 h-4 w-24 bg-muted" />
                  </CardHeader>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">{stats?.jobs || 0}</CardTitle>
                      <CardDescription>Total Jobs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-accent/10 p-3">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">{stats?.results || 0}</CardTitle>
                      <CardDescription>Total Results</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">{stats?.admitCards || 0}</CardTitle>
                      <CardDescription>Total Admit Cards</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-accent/10 p-3">
                      <Key className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">{stats?.answerKeys || 0}</CardTitle>
                      <CardDescription>Total Answer Keys</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </>
          )}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to Admin Panel</CardTitle>
            <CardDescription>Manage all content from the sidebar navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar to navigate to different sections and manage jobs, results, admit cards, and answer keys.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
