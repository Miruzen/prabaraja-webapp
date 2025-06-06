
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const INDONESIAN_BANKS = [
  "Bank Central Asia (BCA)",
  "Bank Mandiri",
  "Bank Rakyat Indonesia (BRI)",
  "Bank Negara Indonesia (BNI)",
  "CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Panin Bank",
  "Bank OCBC NISP",
  "Bank UOB Indonesia",
  "Bank ABCD",
  "Bank EFGH"
];

const BANK_TYPES = ["Debit", "Credit"];

interface CreateAccountFormData {
  accountName: string;
  accountCode: string;
  bankType: string;
  bankName: string;
  accountNumber: string;
  startBalance: number;
}

interface CreateAccountDialogProps {
  onSubmit: (data: CreateAccountFormData) => void;
}

export function CreateAccountDialog({ onSubmit }: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateAccountFormData>({
    accountName: "",
    accountCode: "",
    bankType: "",
    bankName: "",
    accountNumber: "",
    startBalance: 0
  });

  const generateAccountCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `1-${timestamp}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.startBalance < 0) {
      alert("Start Balance must be a positive number.");
      return;
    }
    
    const finalFormData = {
      ...formData,
      accountCode: formData.accountCode || generateAccountCode()
    };
    
    onSubmit(finalFormData);
    setOpen(false);
    setFormData({
      accountName: "",
      accountCode: "",
      bankType: "",
      bankName: "",
      accountNumber: "",
      startBalance: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6366F1] text-white">
          Create Account
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-50">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="accountCode">Account Code (Optional)</Label>
            <Input
              id="accountCode"
              value={formData.accountCode}
              onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
              placeholder="Auto-generated if empty"
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="bankType">Bank Type</Label>
            <Select 
              value={formData.bankType} 
              onValueChange={(value) => setFormData({ ...formData, bankType: value })}>
              <SelectTrigger id="bankType" className="w-full">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {BANK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Select 
                value={formData?.bankName || ""} 
                onValueChange={(value) => setFormData({ ...formData!, bankName: value })}>
                <SelectTrigger id="bankName" className="w-full">
                  <SelectValue placeholder="Select bank..." />
                </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-scroll bg-white">
                      {INDONESIAN_BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                      {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="accountNumber">Bank Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="startBalance">Start Balance (IDR)</Label>
            <Input
              id="startBalance"
              type="number"
              value={formData.startBalance}
              onChange={(e) => setFormData({ ...formData, startBalance: Number(e.target.value) })}
              required
              min={0}
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#6366F1] text-white">
              Create Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
