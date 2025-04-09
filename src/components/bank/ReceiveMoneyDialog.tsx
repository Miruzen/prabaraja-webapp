
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn, formatInputCurrency, parseInputCurrency } from "@/lib/utils";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
  archived?: boolean;
}

interface ReceiveMoneyDialogProps {
  account?: Account;
  accounts?: Account[];
  onReceive: (accountCode: string, amount: number, payer: string, reference: string, date: Date, notes: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const receiveMoneySchema = z.object({
  accountCode: z.string().min(1, "Please select an account"),
  amount: z.string().min(1, "Amount is required"),
  payer: z.string().min(1, "Payer name is required"),
  reference: z.string().optional(),
  date: z.date(),
  notes: z.string().optional(),
});

export function ReceiveMoneyDialog({ 
  account, 
  accounts = [], 
  onReceive,
  open: controlledOpen,
  onOpenChange: setControlledOpen 
}: ReceiveMoneyDialogProps) {
  const [open, setOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Handle both controlled and uncontrolled states
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
  
  // Use either the single account provided or filter the active accounts from the accounts array
  const activeAccounts = account 
    ? [account] 
    : accounts && accounts.length > 0 
      ? accounts.filter(acc => !acc.archived) 
      : [];
  
  const form = useForm<z.infer<typeof receiveMoneySchema>>({
    resolver: zodResolver(receiveMoneySchema),
    defaultValues: {
      accountCode: account ? account.code : "",
      amount: "",
      payer: "",
      reference: "",
      date: new Date(),
      notes: "",
    },
  });

  const watchAccountCode = form.watch("accountCode");
  const watchAmount = form.watch("amount");
  
  // Reset form and close dialog
  const handleClose = () => {
    form.reset();
    setFile(null);
    setPreviewMode(false);
    setIsOpen(false);
  };

  const onSubmit = (data: z.infer<typeof receiveMoneySchema>) => {
    if (previewMode) {
      // Process the payment receipt
      onReceive(
        data.accountCode,
        parseInputCurrency(data.amount),
        data.payer,
        data.reference || "",
        data.date,
        data.notes || ""
      );
      toast.success("Payment received successfully");
      handleClose();
    } else {
      // Show preview
      setPreviewMode(true);
    }
  };

  // Selected account details for preview
  const selectedAccount = activeAccounts.find(acc => acc.code === watchAccountCode);
  
  // Format input as currency
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCurrency(e.target.value);
    form.setValue("amount", formatted);
  };
  
  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm">
            Receive Money
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {previewMode ? "Confirm Payment Receipt" : "Record Incoming Payment"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {previewMode ? (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">To Account:</div>
                  <div className="text-sm font-medium">
                    {selectedAccount?.name} ({selectedAccount?.code})
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Amount:</div>
                  <div className="text-sm font-medium">
                    Rp {parseInputCurrency(watchAmount).toLocaleString('id-ID')}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Payer:</div>
                  <div className="text-sm font-medium">{form.getValues("payer")}</div>
                  
                  <div className="text-sm text-muted-foreground">Reference:</div>
                  <div className="text-sm font-medium">{form.getValues("reference") || "-"}</div>
                  
                  <div className="text-sm text-muted-foreground">Date:</div>
                  <div className="text-sm font-medium">
                    {format(form.getValues("date"), "PP")}
                  </div>
                  
                  {form.getValues("notes") && (
                    <>
                      <div className="text-sm text-muted-foreground">Notes:</div>
                      <div className="text-sm font-medium">{form.getValues("notes")}</div>
                    </>
                  )}
                  
                  {file && (
                    <>
                      <div className="text-sm text-muted-foreground">Attachment:</div>
                      <div className="text-sm font-medium">{file.name}</div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="accountCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Account</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!!account}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select receiving account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAccounts.map((acc) => (
                            <SelectItem key={acc.code} value={acc.code}>
                              {acc.name} - {acc.balance}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={handleAmountChange}
                          prefix="Rp"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="payer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name of person/company paying" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference/Invoice (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Invoice number or reference" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Received</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Additional payment details"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="receipt">Attach Proof (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {file && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setFile(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              </>
            )}
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              
              {previewMode ? (
                <div className="flex gap-2">
                  <Button variant="outline" type="button" onClick={() => setPreviewMode(false)}>
                    Back
                  </Button>
                  <Button type="submit">
                    Confirm Receipt
                  </Button>
                </div>
              ) : (
                <Button 
                  type="submit" 
                  disabled={!watchAccountCode || !watchAmount || !form.getValues("payer")}
                >
                  Review Receipt
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
