import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';
import { getAnswerKeyById } from '@/db/api';
import type { AnswerKey } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnswerKeyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [answerKey, setAnswerKey] = useState<AnswerKey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAnswerKey(id);
    }
  }, [id]);

  const loadAnswerKey = async (keyId: string) => {
    try {
      const data = await getAnswerKeyById(keyId);
      setAnswerKey(data);
    } catch (error) {
      console.error('Error loading answer key:', error);
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
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!answerKey) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-muted-foreground">Answer key not found</p>
          <Link to="/answer-keys">
            <Button className="mt-4">Back to Answer Keys</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link to="/answer-keys">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Answer Keys
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{answerKey.exam_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium">{formatDate(answerKey.release_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Objection Last Date</p>
                  <p className="font-medium">{formatDate(answerKey.objection_last_date)}</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">Important Information</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Download the answer key PDF to check your answers</li>
                <li>Compare your responses with the official answer key</li>
                <li>Submit objections before the last date if you find any discrepancies</li>
                <li>Keep the answer key for future reference</li>
              </ul>
            </div>

            {/* View Answer Key Button */}
            <div className="pt-4">
              <a href={answerKey.pdf_link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <FileText className="mr-2 h-4 w-4" />
                  View Answer Key PDF
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
