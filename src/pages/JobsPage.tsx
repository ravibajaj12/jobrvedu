import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { getJobs } from '@/db/api';
import type { Job } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All', 'Central Government', 'Railway', 'Banking', 'Police', 'Medical', 'Teaching', 'Defence'];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    loadJobs();
  }, [searchParams]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const searchQuery = searchParams.get('search') || undefined;
      const categoryQuery = searchParams.get('category') === 'All' ? undefined : searchParams.get('category') || undefined;
      const data = await getJobs(searchQuery, categoryQuery);
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (value !== 'All') params.set('category', value);
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
        <h1 className="mb-8 text-3xl font-bold md:text-4xl">Government Jobs</h1>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <Input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jobs List */}
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
                    <Skeleton className="h-16 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : jobs.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-muted-foreground">No jobs found</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    {job.important && <Badge className="bg-accent text-accent-foreground">Important</Badge>}
                  </div>
                  <CardDescription>{job.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{job.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{job.category}</Badge>
                    <Badge variant="secondary">{job.total_posts} Posts</Badge>
                  </div>
                  <div className="mb-4 text-sm">
                    <p className="text-muted-foreground">Last Date: {formatDate(job.last_date)}</p>
                  </div>
                  <Link to={`/jobs/${job.id}`}>
                    <Button size="sm" className="w-full">View Details</Button>
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
