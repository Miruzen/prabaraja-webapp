import { useState, useEffect } from "react";

export interface COAAccount {
  id: string;
  category: string;
  account_code: string;
  name: string;
  detail_type: string;
  detail_desc: string;
  tax: string | null;
  bank_name: string | null;
  entry_balance: number;
  description: string | null;
  user_access: string;
  lock_option: boolean;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  level: number;
  parent_code: string | null;
  parent_id: string | null;
}

export interface JournalTransaction {
  id: string;
  coa_code: string;
  description: string;
  transaction_date: string;
  credit: number;
  debit: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface COAApiResponse {
  error: boolean;
  data: COAAccount[];
}

export interface JournalApiResponse {
  error: boolean;
  data: JournalTransaction[];
}

export interface CreateCOAPayload {
  number: number;
  account_type: string;
  description: string;
  balance: number;
}

export interface CreateJournalPayload {
  coa_code: string;
  description: string;
  transaction_date: string;
  credit: number;
  debit: number;
}

const getAuthToken = () => {
  const authDataRaw = localStorage.getItem("sb-xwfkrjtqcqmmpclioakd-auth-token");
  if (!authDataRaw) {
    throw new Error("No access token found in localStorage");
  }
  const authData = JSON.parse(authDataRaw);
  const token = authData.access_token;
  if (!token) {
    throw new Error("Access token missing in parsed auth data");
  }
  return token;
};

export const useCOAAccounts = () => {
  const [data, setData] = useState<COAAccount[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCOAAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      const response = await fetch("https://pbw-backend-api.vercel.app/api/dashboard?action=getAccountCOA", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: COAApiResponse = await response.json();

      if (!result.error && result.data) {
        setData(result.data);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      console.error("Error fetching COA accounts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch COA accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCOAAccounts();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchCOAAccounts,
  };
};

export const useJournalTransactionsAPI = (coaCode?: string) => {
  const [data, setData] = useState<JournalTransaction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJournalTransactions = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      const url = new URL("https://pbw-backend-api.vercel.app/api/dashboard");
      url.searchParams.append("action", "getJournalCOA");
      if (code) {
        url.searchParams.append("coa_code", code);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: JournalApiResponse = await response.json();

      if (!result.error && result.data) {
        setData(result.data);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      console.error("Error fetching journal transactions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch journal transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coaCode) {
      fetchJournalTransactions(coaCode);
    } else {
      setData(null);
      setLoading(false);
    }
  }, [coaCode]);

  return {
    data,
    loading,
    error,
    refetch: () => coaCode && fetchJournalTransactions(coaCode),
  };
};

export const useCreateCOAAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCOAAccount = async (payload: CreateCOAPayload) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      const response = await fetch("https://pbw-backend-api.vercel.app/api/dashboard?action=addNewAccountCOA", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error("API returned unsuccessful response");
      }

      return result.data;
    } catch (err) {
      console.error("Error creating COA account:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create COA account";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCOAAccount,
    loading,
    error,
  };
};

export const useCreateJournal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJournal = async (payload: CreateJournalPayload) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      const response = await fetch("https://pbw-backend-api.vercel.app/api/dashboard?action=addJournalCOA", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error("API returned unsuccessful response");
      }

      return result.data;
    } catch (err) {
      console.error("Error creating journal:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create journal";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createJournal,
    loading,
    error,
  };
};