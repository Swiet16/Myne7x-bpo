import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTableData<T = any>(
  table: string,
  options: {
    select?: string;
    filter?: Record<string, unknown>;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    enabled?: boolean;
  } = {}
) {
  const { profile } = useAuth();
  const { select = '*', filter, orderBy = 'created_at', ascending = false, limit, enabled = true } = options;

  return useQuery({
    queryKey: [table, filter, profile?.id],
    queryFn: async () => {
      let query = supabase.from(table).select(select);
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query = query.eq(key, value as any);
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query = query.order(orderBy as any, { ascending });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as T[];
    },
    enabled: enabled && !!profile,
  });
}

export function useCount(table: string, filter?: Record<string, unknown>) {
  const { profile } = useAuth();
  return useQuery({
    queryKey: [table, 'count', filter, profile?.id],
    queryFn: async () => {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query = query.eq(key, value as any);
          }
        });
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    enabled: !!profile,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useInsert<T = any>(table: string) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (record: Record<string, unknown>) => {
      const { data, error: err } = await supabase.from(table).insert(record).select().single();
      if (err) throw err;
      return data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      success('Created successfully');
    },
    onError: (err) => {
      error('Failed to create', (err as Error).message);
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUpdate<T = any>(table: string) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, unknown>) => {
      const { data, error: err } = await supabase.from(table).update(updates).eq('id', id).select().single();
      if (err) throw err;
      return data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      success('Updated successfully');
    },
    onError: (err) => {
      error('Failed to update', (err as Error).message);
    },
  });
}

export function useDelete(table: string) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from(table).delete().eq('id', id);
      if (err) throw err;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      success('Deleted successfully');
    },
    onError: (err) => {
      error('Failed to delete', (err as Error).message);
    },
  });
}
