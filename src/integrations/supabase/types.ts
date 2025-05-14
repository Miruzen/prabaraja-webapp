export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bank_receive_transactions: {
        Row: {
          amount: number
          created_at: string
          date_received: string
          id: string
          notes: string | null
          number: number
          payer_name: string
          proof_url: string | null
          receiving_account: string
          reference: string | null
          target_balance_after: number
          target_balance_before: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date_received: string
          id?: string
          notes?: string | null
          number: number
          payer_name: string
          proof_url?: string | null
          receiving_account: string
          reference?: string | null
          target_balance_after: number
          target_balance_before: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date_received?: string
          id?: string
          notes?: string | null
          number?: number
          payer_name?: string
          proof_url?: string | null
          receiving_account?: string
          reference?: string | null
          target_balance_after?: number
          target_balance_before?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_receive_transactions_receiving_account_fkey"
            columns: ["receiving_account"]
            isOneToOne: false
            referencedRelation: "cashbank"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transfer_transactions: {
        Row: {
          amount: number
          created_at: string
          from_account: string
          id: string
          notes: string | null
          number: number
          source_balance_after: number
          source_balance_before: number
          target_balance_after: number
          target_balance_before: number
          to_account: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          from_account: string
          id?: string
          notes?: string | null
          number: number
          source_balance_after: number
          source_balance_before: number
          target_balance_after: number
          target_balance_before: number
          to_account: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          from_account?: string
          id?: string
          notes?: string | null
          number?: number
          source_balance_after?: number
          source_balance_before?: number
          target_balance_after?: number
          target_balance_before?: number
          to_account?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transfer_transactions_from_account_fkey"
            columns: ["from_account"]
            isOneToOne: false
            referencedRelation: "cashbank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transfer_transactions_to_account_fkey"
            columns: ["to_account"]
            isOneToOne: false
            referencedRelation: "cashbank"
            referencedColumns: ["id"]
          },
        ]
      }
      cashbank: {
        Row: {
          account_name: string
          account_type: string
          balance: number
          bank_name: string
          bank_number: string
          created_at: string
          id: string
          number: number
          status: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          balance?: number
          bank_name: string
          bank_number: string
          created_at?: string
          id?: string
          number: number
          status?: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          balance?: number
          bank_name?: string
          bank_number?: string
          created_at?: string
          id?: string
          number?: number
          status?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string
          category: string
          created_at: string
          email: string
          id: string
          name: string
          number: number
          phone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          category: string
          created_at?: string
          email: string
          id?: string
          name: string
          number: number
          phone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          category?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          number?: number
          phone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          beneficiary: string
          category: string
          created_at: string
          date: string
          grand_total: number
          id: string
          items: Json
          number: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          beneficiary: string
          category: string
          created_at?: string
          date: string
          grand_total: number
          id?: string
          items: Json
          number: number
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          beneficiary?: string
          category?: string
          created_at?: string
          date?: string
          grand_total?: number
          id?: string
          items?: Json
          number?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          approver: string
          created_at: string
          date: string
          dpp: number | null
          due_date: string
          grand_total: number
          id: string
          items: Json
          number: number
          pph: number | null
          pph_percentage: number | null
          pph_type: string | null
          ppn: number | null
          ppn_percentage: number | null
          status: string
          tags: string[] | null
          tax_calculation_method: boolean
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approver: string
          created_at?: string
          date: string
          dpp?: number | null
          due_date: string
          grand_total: number
          id?: string
          items: Json
          number: number
          pph?: number | null
          pph_percentage?: number | null
          pph_type?: string | null
          ppn?: number | null
          ppn_percentage?: number | null
          status: string
          tags?: string[] | null
          tax_calculation_method: boolean
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approver?: string
          created_at?: string
          date?: string
          dpp?: number | null
          due_date?: string
          grand_total?: number
          id?: string
          items?: Json
          number?: number
          pph?: number | null
          pph_percentage?: number | null
          pph_type?: string | null
          ppn?: number | null
          ppn_percentage?: number | null
          status?: string
          tags?: string[] | null
          tax_calculation_method?: boolean
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          date: string
          discount_terms: string | null
          due_date: string
          expiry_date: string | null
          grand_total: number
          id: string
          items: Json
          number: number
          status: string
          tags: string[] | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          discount_terms?: string | null
          due_date: string
          expiry_date?: string | null
          grand_total: number
          id?: string
          items: Json
          number: number
          status: string
          tags?: string[] | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          discount_terms?: string | null
          due_date?: string
          expiry_date?: string | null
          grand_total?: number
          id?: string
          items?: Json
          number?: number
          status?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          date: string
          due_date: string
          grand_total: number
          id: string
          items: Json
          number: number
          orders_date: string
          status: string
          tags: string[] | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          due_date: string
          grand_total: number
          id?: string
          items: Json
          number: number
          orders_date: string
          status: string
          tags?: string[] | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          due_date?: string
          grand_total?: number
          id?: string
          items?: Json
          number?: number
          orders_date?: string
          status?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          buy_price: number
          category: string
          created_at: string
          id: string
          min_stock: number
          name: string
          number: number
          sell_price: number | null
          status: string
          total_stock: number
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          buy_price: number
          category: string
          created_at?: string
          id?: string
          min_stock: number
          name: string
          number: number
          sell_price?: number | null
          status: string
          total_stock: number
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          buy_price?: number
          category?: string
          created_at?: string
          id?: string
          min_stock?: number
          name?: string
          number?: number
          sell_price?: number | null
          status?: string
          total_stock?: number
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          date: string | null
          due_date: string
          grand_total: number
          id: string
          items: Json
          number: number
          requested_by: string
          status: string
          tags: string[] | null
          type: string
          updated_at: string | null
          urgency: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          due_date: string
          grand_total: number
          id?: string
          items: Json
          number: number
          requested_by: string
          status: string
          tags?: string[] | null
          type: string
          updated_at?: string | null
          urgency: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          due_date?: string
          grand_total?: number
          id?: string
          items?: Json
          number?: number
          requested_by?: string
          status?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          urgency?: string
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string
          customer_name: string
          due_date: string
          grand_total: number
          id: string
          invoice_date: string
          items: Json
          number: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          due_date: string
          grand_total: number
          id?: string
          invoice_date: string
          items: Json
          number: number
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          due_date?: string
          grand_total?: number
          id?: string
          invoice_date?: string
          items?: Json
          number?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string
          created_at: string
          date: string
          due_date: string
          grand_total: number
          id: string
          items: Json
          number: number
          shipping_date: string
          status: string
          tags: string[] | null
          tracking_number: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          carrier: string
          created_at?: string
          date: string
          due_date: string
          grand_total: number
          id?: string
          items: Json
          number: number
          shipping_date: string
          status: string
          tags?: string[] | null
          tracking_number: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          carrier?: string
          created_at?: string
          date?: string
          due_date?: string
          grand_total?: number
          id?: string
          items?: Json
          number?: number
          shipping_date?: string
          status?: string
          tags?: string[] | null
          tracking_number?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          number: number
          total_stock: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          number: number
          total_stock: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          number?: number
          total_stock?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_offer: {
        Args: {
          p_id: string
          p_user_id: string
          p_type: string
          p_date: string
          p_discount_terms: string
          p_expiry_date: string
          p_due_date: string
          p_status: string
          p_tags: string[]
          p_items: Json
          p_grand_total: number
          p_updated_at: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
