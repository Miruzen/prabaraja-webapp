
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SalesInvoice {
  id: string;
  user_id: string;
  number: number;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  status: 'Paid' | 'Unpaid' | 'Late Payment' | 'Awaiting Payment';
  items: any[];
  grand_total: number;
  created_at: string;
  updated_at?: string;
}

export interface OrderDelivery {
  id: string;
  user_id: string;
  number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_date: string;
  delivery_date: string;
  status: string;
  tracking_number: string;
  shipping_address: string;
  shipping_method: string;
  payment_method: string;
  items: any[];
  grand_total: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Quotation {
  id: string;
  user_id: string;
  number: number;
  customer_name: string;
  quotation_date: string;
  valid_until: string;
  status: string;
  items: any[];
  total: number;
  terms?: string;
  created_at: string;
  updated_at?: string;
}

// Hook for Sales Invoices
export const useSalesInvoices = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sales-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales invoices:', error);
        throw error;
      }

      return data as SalesInvoice[];
    },
    enabled: !!user,
  });
};

// Hook for Order & Delivery
export const useOrderDeliveries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['order-deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_deliveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching order deliveries:', error);
        throw error;
      }

      return data as OrderDelivery[];
    },
    enabled: !!user,
  });
};

// Hook for Quotations
export const useQuotations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotations:', error);
        throw error;
      }

      return data as Quotation[];
    },
    enabled: !!user,
  });
};
