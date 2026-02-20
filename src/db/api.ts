import { supabase } from './supabase';
import type { Job, Result, AdmitCard, AnswerKey, Stats } from '@/types/index';

// Jobs API
export async function getJobs(search?: string, category?: string, limit?: number) {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,organization.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createJob(job: Omit<Job, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateJob(id: string, job: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update(job)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteJob(id: string) {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Results API
export async function getResults(search?: string, limit?: number) {
  let query = supabase
    .from('results')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`exam_name.ilike.%${search}%,organization.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getResultById(id: string) {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createResult(result: Omit<Result, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('results')
    .insert(result)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateResult(id: string, result: Partial<Result>) {
  const { data, error } = await supabase
    .from('results')
    .update(result)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteResult(id: string) {
  const { error } = await supabase
    .from('results')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Admit Cards API
export async function getAdmitCards(search?: string, limit?: number) {
  let query = supabase
    .from('admit_cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`exam_name.ilike.%${search}%,organization.ilike.%${search}%`);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAdmitCardById(id: string) {
  const { data, error } = await supabase
    .from('admit_cards')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createAdmitCard(admitCard: Omit<AdmitCard, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('admit_cards')
    .insert(admitCard)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateAdmitCard(id: string, admitCard: Partial<AdmitCard>) {
  const { data, error } = await supabase
    .from('admit_cards')
    .update(admitCard)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteAdmitCard(id: string) {
  const { error } = await supabase
    .from('admit_cards')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Answer Keys API
export async function getAnswerKeys(search?: string, limit?: number) {
  let query = supabase
    .from('answer_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`exam_name.ilike.%${search}%`);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAnswerKeyById(id: string) {
  const { data, error } = await supabase
    .from('answer_keys')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createAnswerKey(answerKey: Omit<AnswerKey, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('answer_keys')
    .insert(answerKey)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateAnswerKey(id: string, answerKey: Partial<AnswerKey>) {
  const { data, error } = await supabase
    .from('answer_keys')
    .update(answerKey)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteAnswerKey(id: string) {
  const { error } = await supabase
    .from('answer_keys')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Stats API
export async function getStats(): Promise<Stats> {
  const [jobsResult, resultsResult, admitCardsResult, answerKeysResult] = await Promise.all([
    supabase.from('jobs').select('id', { count: 'exact', head: true }),
    supabase.from('results').select('id', { count: 'exact', head: true }),
    supabase.from('admit_cards').select('id', { count: 'exact', head: true }),
    supabase.from('answer_keys').select('id', { count: 'exact', head: true }),
  ]);

  return {
    jobs: jobsResult.count || 0,
    results: resultsResult.count || 0,
    admitCards: admitCardsResult.count || 0,
    answerKeys: answerKeysResult.count || 0,
  };
}

// Check if any admin user exists
export async function checkAdminExists(): Promise<boolean> {
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }

  return (count || 0) > 0;
}
