import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { checkAdminExists } from '@/db/api';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const exists = await checkAdminExists();
      setAdminExists(exists);
    } catch (error) {
      console.error('Error checking admin:', error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (adminExists) {
        // Only allow login if admin exists
        const { error } = await signInWithUsername(username, password);
        if (error) {
          toast.error(error.message || 'Login failed');
        } else {
          toast.success('Login successful');
          const from = (location.state as any)?.from?.pathname || '/admin';
          navigate(from, { replace: true });
        }
      } else {
        // Allow first-time signup
        const { error } = await signUpWithUsername(username, password);
        if (error) {
          toast.error(error.message || 'Signup failed');
        } else {
          toast.success('Admin account created successfully. You are now the only admin.');
          const from = (location.state as any)?.from?.pathname || '/admin';
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {adminExists ? 'Admin Login' : 'Create Admin Account'}
          </CardTitle>
          <CardDescription>
            {adminExists 
              ? 'Enter your credentials to access the admin panel' 
              : 'Create the first and only admin account for this portal'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : adminExists ? 'Login' : 'Create Admin Account'}
            </Button>
          </form>
          {!adminExists && (
            <div className="mt-4 rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
              ⚠️ This will be the only admin account. No additional signups will be allowed.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
