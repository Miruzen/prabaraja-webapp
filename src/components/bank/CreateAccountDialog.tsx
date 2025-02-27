
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

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
] as const

interface CreateAccountFormData {
  accountName: string
  accountCode: string
  bankName: string
  accountNumber: string
  startBalance: number
}

interface CreateAccountDialogProps {
  onSubmit: (data: CreateAccountFormData) => void
}

export function CreateAccountDialog({ onSubmit }: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [formData, setFormData] = useState<CreateAccountFormData>({
    accountName: "",
    accountCode: "",
    bankName: "",
    accountNumber: "",
    startBalance: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setOpen(false)
    setFormData({
      accountName: "",
      accountCode: "",
      bankName: "",
      accountNumber: "",
      startBalance: 0
    })
  }

  const filteredBanks = INDONESIAN_BANKS.filter(bank =>
    bank.toLowerCase().includes(searchValue.toLowerCase())
  ).slice(0, 6)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6366F1] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <Label htmlFor="accountCode">Account Code</Label>
            <Input
              id="accountCode"
              value={formData.accountCode}
              onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {formData.bankName || "Select bank..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search bank..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>No bank found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {filteredBanks.map((bank) => (
                      <CommandItem
                        key={bank}
                        value={bank}
                        onSelect={() => {
                          setFormData({ ...formData, bankName: bank });
                          setOpenCombobox(false);
                          setSearchValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.bankName === bank ? "opacity-100" : "opacity-0"
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
  )
}
