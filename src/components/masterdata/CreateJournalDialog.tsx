import { useState } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateJournal, type COAAccount } from '@/hooks/useMasterDataAPI';

interface CreateJournalDialogProps {
  children: React.ReactNode;
  coaAccounts: COAAccount[];
}

export function CreateJournalDialog({ children, coaAccounts }: CreateJournalDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    coa_code: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    debit: '0',
    credit: '0',
  });

  const { createJournal, loading: isCreating } = useCreateJournal();

  const parseInputCurrency = (value: string): number => {
    const cleanString = value.replace(/[^\d]/g, '');
    return parseInt(cleanString) || 0;
  };

  const formatCurrency = (value: string): string => {
    const numericValue = parseInputCurrency(value);
    return new Intl.NumberFormat('id-ID').format(numericValue);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === 'debit' || field === 'credit') {
      setFormData(prev => ({ ...prev, [field]: formatCurrency(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.coa_code || !formData.description || !formData.transaction_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const debitAmount = parseInputCurrency(formData.debit);
    const creditAmount = parseInputCurrency(formData.credit);

    if (debitAmount === 0 && creditAmount === 0) {
      toast.error('Either debit or credit amount must be greater than 0');
      return;
    }

    if (debitAmount > 0 && creditAmount > 0) {
      toast.error('Please enter either debit or credit amount, not both');
      return;
    }

    try {
      await createJournal({
        coa_code: formData.coa_code,
        description: formData.description,
        transaction_date: formData.transaction_date,
        debit: debitAmount,
        credit: creditAmount,
      });
      
      toast.success('Journal entry created successfully');
      setOpen(false);
      setFormData({
        coa_code: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        debit: '0',
        credit: '0',
      });
      
      // Refresh the page or trigger refetch
      window.location.reload();
    } catch (error) {
      toast.error('Failed to create journal entry');
      console.error('Error creating journal:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Journal Entry</DialogTitle>
          <DialogDescription>
            Add a new journal entry to the system. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="coa_code">COA Account</Label>
            <Select value={formData.coa_code} onValueChange={(value) => handleInputChange('coa_code', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select COA Account" />
              </SelectTrigger>
              <SelectContent>
                {coaAccounts?.map((account) => (
                  <SelectItem key={account.id} value={account.number.toString()}>
                    {account.number} - {account.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="transaction_date">Transaction Date</Label>
            <Input
              id="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => handleInputChange('transaction_date', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="debit">Debit Amount</Label>
              <Input
                id="debit"
                value={formData.debit}
                onChange={(e) => handleInputChange('debit', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="credit">Credit Amount</Label>
              <Input
                id="credit"
                value={formData.credit}
                onChange={(e) => handleInputChange('credit', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Journal Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}