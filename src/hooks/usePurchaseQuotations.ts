import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Mock interface for Purchase Quotation
export interface PurchaseQuotation {
  id: string;
  user_id: string;
  number: number;
  vendor_name: string;
  quotation_date: string;
  valid_until: string;
  status: string;
  items: any[];
  total: number;
  terms?: string;
  created_at: string;
  updated_at?: string;
}

// Mock data for demonstration
const mockQuotations: PurchaseQuotation[] = [
  {
    id: "pq-1",
    user_id: "user-1",
    number: 1001,
    vendor_name: "PT Supplier Indonesia",
    quotation_date: "2024-01-15",
    valid_until: "2024-02-15",
    status: "pending",
    items: [
      { id: "1", name: "Office Supplies", quantity: 10, price: 50000 },
      { id: "2", name: "Printer Paper", quantity: 5, price: 75000 }
    ],
    total: 875000,
    terms: "Payment within 30 days",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "pq-2", 
    user_id: "user-1",
    number: 1002,
    vendor_name: "CV Tech Solutions",
    quotation_date: "2024-01-20",
    valid_until: "2024-02-20",
    status: "pending",
    items: [
      { id: "1", name: "Laptop", quantity: 2, price: 8000000 },
      { id: "2", name: "Mouse", quantity: 2, price: 150000 }
    ],
    total: 16300000,
    terms: "Free installation and 1 year warranty",
    created_at: "2024-01-20T14:30:00Z"
  }
];

// Hook for fetching purchase quotations
export const usePurchaseQuotations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchase-quotations'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data for now (will be replaced with real Supabase query later)
      return mockQuotations.filter(q => q.user_id === user?.id);
    },
    enabled: !!user,
  });
};

// Hook for creating purchase quotation
export const useCreatePurchaseQuotation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newQuotation: Omit<PurchaseQuotation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new quotation object
      const quotation: PurchaseQuotation = {
        ...newQuotation,
        id: `pq-${Date.now()}`,
        user_id: user?.id || '',
        created_at: new Date().toISOString(),
      };

      // Add to mock data (in real implementation, this would be a Supabase insert)
      mockQuotations.push(quotation);
      
      return quotation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-quotations'] });
    },
  });
};

// Hook for updating purchase quotation
export const useUpdatePurchaseQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PurchaseQuotation> }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find and update quotation in mock data
      const index = mockQuotations.findIndex(q => q.id === id);
      if (index !== -1) {
        mockQuotations[index] = {
          ...mockQuotations[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return mockQuotations[index];
      }
      
      throw new Error('Quotation not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-quotations'] });
    },
  });
};

// Hook for deleting purchase quotation
export const useDeletePurchaseQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from mock data
      const index = mockQuotations.findIndex(q => q.id === id);
      if (index !== -1) {
        mockQuotations.splice(index, 1);
        return id;
      }
      
      throw new Error('Quotation not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-quotations'] });
    },
  });
};