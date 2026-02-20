import type { ReactNode } from 'react';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ResultsPage from './pages/ResultsPage';
import ResultDetailPage from './pages/ResultDetailPage';
import AdmitCardsPage from './pages/AdmitCardsPage';
import AdmitCardDetailPage from './pages/AdmitCardDetailPage';
import AnswerKeysPage from './pages/AnswerKeysPage';
import AnswerKeyDetailPage from './pages/AnswerKeyDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminJobsPage from './pages/AdminJobsPage';
import AdminResultsPage from './pages/AdminResultsPage';
import AdminAdmitCardsPage from './pages/AdminAdmitCardsPage';
import AdminAnswerKeysPage from './pages/AdminAnswerKeysPage';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Jobs',
    path: '/jobs',
    element: <JobsPage />
  },
  {
    name: 'Job Detail',
    path: '/jobs/:id',
    element: <JobDetailPage />
  },
  {
    name: 'Results',
    path: '/results',
    element: <ResultsPage />
  },
  {
    name: 'Result Detail',
    path: '/results/:id',
    element: <ResultDetailPage />
  },
  {
    name: 'Admit Cards',
    path: '/admit-cards',
    element: <AdmitCardsPage />
  },
  {
    name: 'Admit Card Detail',
    path: '/admit-cards/:id',
    element: <AdmitCardDetailPage />
  },
  {
    name: 'Answer Keys',
    path: '/answer-keys',
    element: <AnswerKeysPage />
  },
  {
    name: 'Answer Key Detail',
    path: '/answer-keys/:id',
    element: <AnswerKeyDetailPage />
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLoginPage />
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboardPage />
  },
  {
    name: 'Admin Jobs',
    path: '/admin/jobs',
    element: <AdminJobsPage />
  },
  {
    name: 'Admin Results',
    path: '/admin/results',
    element: <AdminResultsPage />
  },
  {
    name: 'Admin Admit Cards',
    path: '/admin/admit-cards',
    element: <AdminAdmitCardsPage />
  },
  {
    name: 'Admin Answer Keys',
    path: '/admin/answer-keys',
    element: <AdminAnswerKeysPage />
  }
];

export default routes;
