import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { parseInputCurrency } from '@/lib/utils';
import { COAAccount, EditCOAAccountPayload, useEditCOAAccount } from '@/hooks/useMasterDataAPI';

interface EditCOADialogProps {
  account: COAAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface EditFormData {
  account_code: string;
  name: string;
  category: string;
  level: number;
  parent_code: string | null;
  parent_id: string | null;
  detail_type: string;
  detail_desc: string;
  tax: string;
  bank_name: string | null;
  entry_balance: number;
  description: string;
  user_access: string;
  lock_option: boolean;
}

export const EditCOADialog = ({ account, open, onOpenChange, onSuccess }: EditCOADialogProps) => {
  const [formData, setFormData] = useState<EditFormData>({
    account_code: '',
    name: '',
    category: '',
    level: 1,
    parent_code: null,
    parent_id: null,
    detail_type: 'Parent Account',
    detail_desc: '',
    tax: 'Non-Taxable',
    bank_name: null,
    entry_balance: 0,
    description: '',
    user_access: 'All Users',
    lock_option: false
  });
  
  const { editCOAAccount, loading: isUpdating } = useEditCOAAccount();

  // Initialize form data when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        account_code: account.account_code,
        name: account.name,
        category: account.category,
        level: account.level,
        parent_code: account.parent_code,
        parent_id: account.parent_id,
        detail_type: account.detail_type,
        detail_desc: account.detail_desc || '',
        tax: account.tax || 'Non-Taxable',
        bank_name: account.bank_name,
        entry_balance: account.entry_balance || 0,
        description: account.description || '',
        user_access: account.user_access,
        lock_option: account.lock_option
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

  const handlePriceChange = (field: 'entry_balance') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInputCurrency(e.target.value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.account_code || !formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload: EditCOAAccountPayload = {
        action: "editAccountCOA",
        id: account.id,
        name: formData.name,
        account_code: formData.account_code,
        category: formData.category,
        level: formData.level,
        parent_code: formData.parent_code,
        parent_id: formData.parent_id,
        detail_type: formData.detail_type,
        detail_desc: formData.detail_desc,
        tax: formData.tax,
        bank_name: formData.bank_name,
        entry_balance: formData.entry_balance,
        description: formData.description,
        user_access: formData.user_access,
        lock_option: formData.lock_option
      };
      
      await editCOAAccount(payload);
      
      toast.success('Chart of Account updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to update account');
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
            <Label htmlFor="account_code">Account Code <span className="text-red-500">*</span></Label>
            <Input
              id="account_code"
              value={formData.account_code}
              onChange={(e) => setFormData(prev => ({ ...prev, account_code: e.target.value }))}
              placeholder="Enter account code"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Account Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter account name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
            <Label htmlFor="entry_balance">Balance</Label>
            <Input
              id="entry_balance"
              value={formatPriceDisplay(formData.entry_balance)}
              onChange={handlePriceChange('entry_balance')}
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