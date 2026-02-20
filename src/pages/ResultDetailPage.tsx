import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Calendar, Building } from 'lucide-react';
import { getResultById } from '@/db/api';
import type { Result } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadResult(id);
    }
  }, [id]);

  const loadResult = async (resultId: string) => {
    try {
      const data = await getResultById(resultId);
      setResult(data);
    } catch (error) {
      console.error('Error loading result:', error);
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

  if (!result) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-muted-foreground">Result not found</p>
          <Link to="/results">
            <Button className="mt-4">Back to Results</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link to="/results">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{result.exam_name}</CardTitle>
            <CardDescription className="text-lg">{result.organization}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{result.organization}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Result Date</p>
                  <p className="font-medium">{formatDate(result.result_date)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">Description</h3>
              <p className="whitespace-pre-line text-muted-foreground">{result.description}</p>
            </div>

            {/* Check Result Button */}
            <div className="pt-4">
              <a href={result.result_link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Check Result
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
