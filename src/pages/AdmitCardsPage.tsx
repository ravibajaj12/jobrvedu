import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { getAdmitCards } from '@/db/api';
import type { AdmitCard } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdmitCardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [admitCards, setAdmitCards] = useState<AdmitCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadAdmitCards();
  }, [searchParams]);

  const loadAdmitCards = async () => {
    setLoading(true);
    try {
      const searchQuery = searchParams.get('search') || undefined;
      const data = await getAdmitCards(searchQuery);
      setAdmitCards(data);
    } catch (error) {
      console.error('Error loading admit cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Admit Cards</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="Search admit cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Admit Cards List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="mt-2 h-4 w-1/2 bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : admitCards.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-muted-foreground">No admit cards found</p>
            </div>
          ) : (
            admitCards.map((card) => (
              <Card key={card.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{card.exam_name}</CardTitle>
                  <CardDescription>{card.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Release Date: {formatDate(card.release_date)}
                    </p>
                    <p className="text-muted-foreground">
                      Exam Date: {formatDate(card.exam_date)}
                    </p>
                  </div>
                  <Link to={`/admit-cards/${card.id}`}>
                    <Button size="sm" className="w-full">Download</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
