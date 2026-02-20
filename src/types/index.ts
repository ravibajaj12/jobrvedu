export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at?: string;
}

export interface Job {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  total_posts: number;
  publish_date: string;
  last_date: string;
  important: boolean;
  apply_link: string;
  created_at?: string;
}

export interface Result {
  id: string;
  exam_name: string;
  organization: string;
  result_date: string;
  description: string;
  result_link: string;
  created_at?: string;
}

export interface AdmitCard {
  id: string;
  exam_name: string;
  organization: string;
  release_date: string;
  exam_date: string;
  download_link: string;
  created_at?: string;
}

export interface AnswerKey {
  id: string;
  exam_name: string;
  release_date: string;
  objection_last_date: string;
  pdf_link: string;
  created_at?: string;
}

export interface Stats {
  jobs: number;
  results: number;
  admitCards: number;
  answerKeys: number;
}
