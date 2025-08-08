import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChartOfAccount {
  id: number;
  number: number;
  account_type: string;
  description: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export const useChartOfAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('number', { ascending: true });

      if (error) {
        console.error('Error fetching chart of accounts:', error);
        throw error;
      }

      return data as ChartOfAccount[];
    },
    enabled: !!user,
  });
};

export const useCreateChartOfAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAccount: Omit<ChartOfAccount, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .insert([newAccount])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chart-of-accounts'] });
    },
  });
};