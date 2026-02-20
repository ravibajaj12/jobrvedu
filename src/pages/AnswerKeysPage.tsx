import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { getAnswerKeys } from '@/db/api';
import type { AnswerKey } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnswerKeysPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadAnswerKeys();
  }, [searchParams]);

  const loadAnswerKeys = async () => {
    setLoading(true);
    try {
      const searchQuery = searchParams.get('search') || undefined;
      const data = await getAnswerKeys(searchQuery);
      setAnswerKeys(data);
    } catch (error) {
      console.error('Error loading answer keys:', error);
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
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Answer Keys</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="Search answer keys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Answer Keys List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : answerKeys.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-muted-foreground">No answer keys found</p>
            </div>
          ) : (
            answerKeys.map((key) => (
              <Card key={key.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{key.exam_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Release Date: {formatDate(key.release_date)}
                    </p>
                    <p className="text-muted-foreground">
                      Objection Last Date: {formatDate(key.objection_last_date)}
                    </p>
                  </div>
                  <Link to={`/answer-keys/${key.id}`}>
                    <Button size="sm" className="w-full">View Answer Key</Button>
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
