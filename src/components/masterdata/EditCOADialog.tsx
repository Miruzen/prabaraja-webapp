import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { parseInputCurrency } from '@/lib/utils';
import { COAAccount } from '@/hooks/useMasterDataAPI';

interface EditCOADialogProps {
  account: COAAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface EditFormData {
  number: string;
  description: string;
  account_type: string;
  balance: number;
  detail_description: string;
}

export const EditCOADialog = ({ account, open, onOpenChange, onSuccess }: EditCOADialogProps) => {
  const [formData, setFormData] = useState<EditFormData>({
    number: '',
    description: '',
    account_type: '',
    balance: 0,
    detail_description: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form data when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        number: account.account_code,
        description: account.name,
        account_type: account.category,
        balance: account.entry_balance || 0,
        detail_description: account.description || ''
      });
    }
  }, [account]);

  const formatPriceDisplay = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePriceChange = (field: 'balance') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInputCurrency(e.target.value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCOAAccount = async (payload: any) => {
    try {
      const authDataRaw = localStorage.getItem("sb-xwfkrjtqcqmmpclioakd-auth-token");
      if (!authDataRaw) {
        throw new Error("No access token found");
      }
      const authData = JSON.parse(authDataRaw);
      const token = authData.access_token;

      const response = await fetch("https://pbw-backend-api.vercel.app/api/dashboard?action=editAccountCOA", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, id: account.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error("API returned unsuccessful response");
      }

      return result.data;
    } catch (error) {
      console.error("Error updating COA account:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.description || !formData.account_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsUpdating(true);
      
      await updateCOAAccount({
        number: parseInt(formData.number),
        account_type: formData.account_type,
        description: formData.description,
        balance: formData.balance,
        detail_description: formData.detail_description
      });
      
      toast.success('Chart of Account updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to update account');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Chart of Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Account Code <span className="text-red-500">*</span></Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="Enter account code"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Account Name <span className="text-red-500">*</span></Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter account name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail_description">Description</Label>
            <Textarea
              id="detail_description"
              value={formData.detail_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detail_description: e.target.value }))}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_type">Category <span className="text-red-500">*</span></Label>
            <Select value={formData.account_type} onValueChange={(value) => setFormData(prev => ({ ...prev, account_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kas & Bank">Kas & Bank</SelectItem>
                <SelectItem value="Akun Piutang">Akun Piutang</SelectItem>
                <SelectItem value="Persediaan">Persediaan</SelectItem>
                <SelectItem value="Aktiva Lancar Lainnya">Aktiva Lancar Lainnya</SelectItem>
                <SelectItem value="Aktiva Tetap">Aktiva Tetap</SelectItem>
                <SelectItem value="Hutang">Hutang</SelectItem>
                <SelectItem value="Modal">Modal</SelectItem>
                <SelectItem value="Pendapatan">Pendapatan</SelectItem>
                <SelectItem value="Beban">Beban</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              value={formatPriceDisplay(formData.balance)}
              onChange={handlePriceChange('balance')}
              placeholder="Enter balance"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};