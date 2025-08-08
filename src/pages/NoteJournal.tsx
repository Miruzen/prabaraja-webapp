import { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Paperclip } from "lucide-react";
import { useChartOfAccounts } from '@/hooks/useChartOfAccounts';
import { formatInputCurrency, parseInputCurrency, formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
}

const NoteJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', account: '', description: '', debit: 0, credit: 0 }
  ]);
  const [memo, setMemo] = useState('');
  
  const { data: chartOfAccounts } = useChartOfAccounts();
  const { toast } = useToast();

  const formatPriceDisplay = (price: number) => {
    return price === 0 ? '' : new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleDebitChange = (id: string, value: string) => {
    const numericValue = parseInputCurrency(value);
    setEntries(prev => {
      const newEntries = prev.map(entry => 
        entry.id === id ? { ...entry, debit: numericValue, credit: 0 } : entry
      );
      
      // Auto-balance logic: find next empty row and set credit
      const currentIndex = newEntries.findIndex(entry => entry.id === id);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < newEntries.length && numericValue > 0) {
        newEntries[nextIndex] = { ...newEntries[nextIndex], credit: numericValue, debit: 0 };
      } else if (numericValue > 0 && nextIndex >= newEntries.length) {
        // Add new row with credit
        const newId = (newEntries.length + 1).toString();
        newEntries.push({ id: newId, account: '', description: '', debit: 0, credit: numericValue });
      }
      
      return newEntries;
    });
  };

  const handleCreditChange = (id: string, value: string) => {
    const numericValue = parseInputCurrency(value);
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, credit: numericValue, debit: 0 } : entry
    ));
  };

  const handleAccountChange = (id: string, account: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, account } : entry
    ));
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, description } : entry
    ));
  };

  const addNewRow = () => {
    const newId = (entries.length + 1).toString();
    setEntries(prev => [...prev, { id: newId, account: '', description: '', debit: 0, credit: 0 }]);
  };

  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = () => {
    if (!isBalanced) {
      toast({
        title: "Validation Error",
        description: "Total Debit must equal Total Credit",
        variant: "destructive",
      });
      return;
    }

    // Check if all entries have account and description
    const hasEmptyFields = entries.some(entry => 
      (entry.debit > 0 || entry.credit > 0) && (!entry.account || !entry.description)
    );

    if (hasEmptyFields) {
      toast({
        title: "Validation Error", 
        description: "Please fill in all account and description fields for entries with amounts",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Journal entry created successfully",
    });
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Note Journal</h1>
          <p className="text-white/80">Create and manage journal entries</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Journal Entry Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[150px] text-right">Debit (IDR)</TableHead>
                  <TableHead className="w-[150px] text-right">Credit (IDR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Select 
                        value={entry.account} 
                        onValueChange={(value) => handleAccountChange(entry.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts?.map((account) => (
                            <SelectItem key={account.id} value={account.number.toString()}>
                              {account.number} - {account.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.description}
                        onChange={(e) => handleDescriptionChange(entry.id, e.target.value)}
                        placeholder="Enter description"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatPriceDisplay(entry.debit)}
                        onChange={(e) => handleDebitChange(entry.id, e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatPriceDisplay(entry.credit)}
                        onChange={(e) => handleCreditChange(entry.id, e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add Data Button */}
          <Button onClick={addNewRow} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Data
          </Button>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
            <div className="space-y-2">
              <Label>Total Debit</Label>
              <div className="text-right font-mono text-lg">
                {formatCurrency(totalDebit)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total Credit</Label>
              <div className="text-right font-mono text-lg">
                {formatCurrency(totalCredit)}
              </div>
            </div>
          </div>

          {/* Balance Status */}
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isBalanced 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo</Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Enter memo (optional)"
              rows={3}
            />
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label>Attachment</Label>
            <Button variant="outline" className="w-full">
              <Paperclip className="mr-2 h-4 w-4" />
              Attach File
            </Button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isBalanced}
            >
              Save Journal Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteJournal;