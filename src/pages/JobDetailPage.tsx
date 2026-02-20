import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Calendar, Users, Building } from 'lucide-react';
import { getJobById } from '@/db/api';
import type { Job } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);

  const loadJob = async (jobId: string) => {
    try {
      const data = await getJobById(jobId);
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-4 h-10 w-32 bg-muted" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 bg-muted" />
              <Skeleton className="mt-2 h-6 w-1/2 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-muted-foreground">Job not found</p>
          <Link to="/jobs">
            <Button className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link to="/jobs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">{job.title}</CardTitle>
                <CardDescription className="mt-2 text-lg">{job.organization}</CardDescription>
              </div>
              {job.important && (
                <Badge className="bg-accent text-accent-foreground">Important</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{job.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="font-medium">{job.total_posts}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Date</p>
                  <p className="font-medium">{formatDate(job.last_date)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">Description</h3>
              <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
            </div>

            {/* Important Dates */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">Important Dates</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Publish Date</span>
                  <span className="font-medium">{formatDate(job.publish_date)}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Last Date to Apply</span>
                  <span className="font-medium text-accent">{formatDate(job.last_date)}</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-4">
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
