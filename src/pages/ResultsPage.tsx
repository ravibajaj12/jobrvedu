import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { getResults } from '@/db/api';
import type { Result } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadResults();
  }, [searchParams]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const searchQuery = searchParams.get('search') || undefined;
      const data = await getResults(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
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
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Exam Results</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="Search results..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Results List */}
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
          ) : results.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-muted-foreground">No results found</p>
            </div>
          ) : (
            results.map((result) => (
              <Card key={result.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{result.exam_name}</CardTitle>
                  <CardDescription>{result.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Result Date: {formatDate(result.result_date)}
                  </p>
                  <Link to={`/results/${result.id}`}>
                    <Button size="sm" className="w-full">Check Result</Button>
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
