import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Calendar, Building } from 'lucide-react';
import { getAdmitCardById } from '@/db/api';
import type { AdmitCard } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdmitCardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [admitCard, setAdmitCard] = useState<AdmitCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAdmitCard(id);
    }
  }, [id]);

  const loadAdmitCard = async (cardId: string) => {
    try {
      const data = await getAdmitCardById(cardId);
      setAdmitCard(data);
    } catch (error) {
      console.error('Error loading admit card:', error);
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

  if (!admitCard) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-muted-foreground">Admit card not found</p>
          <Link to="/admit-cards">
            <Button className="mt-4">Back to Admit Cards</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link to="/admit-cards">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admit Cards
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{admitCard.exam_name}</CardTitle>
            <CardDescription className="text-lg">{admitCard.organization}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{admitCard.organization}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium">{formatDate(admitCard.release_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Exam Date</p>
                  <p className="font-medium">{formatDate(admitCard.exam_date)}</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">Important Information</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Download your admit card before the exam date</li>
                <li>Carry a printed copy of the admit card to the examination center</li>
                <li>Bring a valid photo ID proof along with the admit card</li>
                <li>Check all details on the admit card carefully</li>
              </ul>
            </div>

            {/* Download Button */}
            <div className="pt-4">
              <a href={admitCard.download_link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download Admit Card
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
