import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, FileText, CreditCard, Key } from 'lucide-react';
import { getJobs, getResults, getAdmitCards, getAnswerKeys, getStats } from '@/db/api';
import type { Job, Result, AdmitCard, AnswerKey, Stats } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [latestResults, setLatestResults] = useState<Result[]>([]);
  const [latestAdmitCards, setLatestAdmitCards] = useState<AdmitCard[]>([]);
  const [latestAnswerKeys, setLatestAnswerKeys] = useState<AnswerKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, jobs, results, admitCards, answerKeys] = await Promise.all([
        getStats(),
        getJobs(undefined, undefined, 5),
        getResults(undefined, 5),
        getAdmitCards(undefined, 5),
        getAnswerKeys(undefined, 5),
      ]);
      setStats(statsData);
      setLatestJobs(jobs);
      setLatestResults(results);
      setLatestAdmitCards(admitCards);
      setLatestAnswerKeys(answerKeys);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(search)}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">Your Gateway to Government Jobs</h1>
          <p className="mb-8 text-lg md:text-xl">Find the latest job notifications, results, admit cards, and answer keys</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mb-8 flex max-w-2xl gap-2">
            <Input
              type="text"
              placeholder="Search for jobs, exams, organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background text-foreground"
            />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          {/* Quick Access Buttons */}
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            <Link to="/jobs">
              <Button variant="secondary" className="h-auto w-full flex-col gap-2 py-4">
                <Briefcase className="h-6 w-6" />
                <span className="text-sm font-medium">Jobs</span>
              </Button>
            </Link>
            <Link to="/results">
              <Button variant="secondary" className="h-auto w-full flex-col gap-2 py-4">
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">Results</span>
              </Button>
            </Link>
            <Link to="/admit-cards">
              <Button variant="secondary" className="h-auto w-full flex-col gap-2 py-4">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm font-medium">Admit Cards</span>
              </Button>
            </Link>
            <Link to="/answer-keys">
              <Button variant="secondary" className="h-auto w-full flex-col gap-2 py-4">
                <Key className="h-6 w-6" />
                <span className="text-sm font-medium">Answer Keys</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
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
                      <CardDescription>Active Jobs</CardDescription>
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
                      <CardDescription>Results</CardDescription>
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
                      <CardDescription>Admit Cards</CardDescription>
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
                      <CardDescription>Answer Keys</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Latest Jobs</h2>
          <Link to="/jobs">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
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
          ) : (
            latestJobs.map((job) => (
              <Card key={job.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    {job.important && <Badge className="bg-accent text-accent-foreground">Important</Badge>}
                  </div>
                  <CardDescription>{job.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{job.category}</Badge>
                    <Link to={`/jobs/${job.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Latest Results */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Latest Results</h2>
            <Link to="/results">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="mt-2 h-4 w-1/2 bg-muted" />
                    </CardHeader>
                  </Card>
                ))}
              </>
            ) : (
              latestResults.map((result) => (
                <Card key={result.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{result.exam_name}</CardTitle>
                    <CardDescription>{result.organization}</CardDescription>
                  </CardHeader>
                  <CardContent>
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
      </section>

      {/* Latest Admit Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Latest Admit Cards</h2>
          <Link to="/admit-cards">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="mt-2 h-4 w-1/2 bg-muted" />
                  </CardHeader>
                </Card>
              ))}
            </>
          ) : (
            latestAdmitCards.map((card) => (
              <Card key={card.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{card.exam_name}</CardTitle>
                  <CardDescription>{card.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Exam Date: {formatDate(card.exam_date)}
                  </p>
                  <Link to={`/admit-cards/${card.id}`}>
                    <Button size="sm" className="w-full">Download</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Latest Answer Keys */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Latest Answer Keys</h2>
            <Link to="/answer-keys">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="mt-2 h-4 w-1/2 bg-muted" />
                    </CardHeader>
                  </Card>
                ))}
              </>
            ) : (
              latestAnswerKeys.map((key) => (
                <Card key={key.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{key.exam_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Release Date: {formatDate(key.release_date)}
                    </p>
                    <Link to={`/answer-keys/${key.id}`}>
                      <Button size="sm" className="w-full">View Answer Key</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
