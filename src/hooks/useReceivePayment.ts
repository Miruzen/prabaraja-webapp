import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ReceivePaymentTransaction {
  id: string;
  transaction_date: string;
  description: string;
  coa_code: string;
  debit: number;
  credit: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useReceivePaymentTransactions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["receive-payment-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receive_payment_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ReceivePaymentTransaction[];
    },
    enabled: !!user,
  });
}

export function useCreateReceivePaymentTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      transaction_date: string;
      description: string;
      coa_code: string;
      debit?: number;
      credit?: number;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data: result, error } = await supabase
        .from("receive_payment_transactions")
        .insert({
          ...data,
          user_id: user.id,
          debit: data.debit || 0,
          credit: data.credit || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receive-payment-transactions"] });
    },
  });
}