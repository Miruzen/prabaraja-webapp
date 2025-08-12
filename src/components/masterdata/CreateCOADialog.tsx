import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCOAAccount } from '@/hooks/useMasterDataAPI';
import { toast } from 'sonner';
import { parseInputCurrency } from '@/lib/utils';

interface CreateCOADialogProps {
  children: React.ReactNode;
}

export const CreateCOADialog = ({ children }: CreateCOADialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    description: '',
    account_type: '',
    balance: 0
  });

  const { createCOAAccount, loading: isCreating } = useCreateCOAAccount();

  const formatPriceDisplay = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleBalanceChange = (value: string) => {
    const numericValue = parseInputCurrency(value);
    setFormData(prev => ({ ...prev, balance: numericValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.description || !formData.account_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createCOAAccount({
        number: parseInt(formData.number),
        description: formData.description,
        account_type: formData.account_type,
        balance: formData.balance
      });
      
      toast.success('Chart of Account created successfully');
      
      setOpen(false);
      setFormData({ number: '', description: '', account_type: '', balance: 0 });
      
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to create Chart of Account');
      console.error('Error creating COA:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chart of Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Account Code</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="Enter account code"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Account Name</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter account name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_type">Category</Label>
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
            <Label htmlFor="balance">Initial Balance (IDR)</Label>
            <Input
              id="balance"
              type="text"
              inputMode="numeric"
              value={formatPriceDisplay(formData.balance)}
              onChange={(e) => handleBalanceChange(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};