
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
}

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onSave: (updatedAccount: Account) => void;
}

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
  "Bank UOB Indonesia"
];

export function EditAccountDialog({ open, onOpenChange, account, onSave }: EditAccountDialogProps) {
  const [formData, setFormData] = useState<Account | null>(account);
  const [openCombobox, setOpenCombobox] = useState(false);

  useEffect(() => {
    setFormData(account);
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && account) {
      onSave({
        ...account,
        ...formData
      });
      onOpenChange(false);
    }
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account details here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData?.name || ""}
              onChange={(e) => setFormData({ ...formData!, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                  type="button"
                >
                  {formData?.bankName || "Select bank..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search bank..." />
                  <CommandEmpty>No bank found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {INDONESIAN_BANKS.map((bank) => (
                      <CommandItem
                        key={bank}
                        value={bank}
                        onSelect={() => {
                          setFormData({ ...formData!, bankName: bank });
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData?.bankName === bank ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {bank}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData?.accountNumber || ""}
              onChange={(e) => setFormData({ ...formData!, accountNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startBalance">Start Balance</Label>
            <Input
              id="startBalance"
              type="number"
              value={formData?.balance?.replace(/[^\d-]/g, '') || ""}
              onChange={(e) => setFormData({ ...formData!, balance: `Rp ${parseInt(e.target.value || "0").toLocaleString('id-ID')}` })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
