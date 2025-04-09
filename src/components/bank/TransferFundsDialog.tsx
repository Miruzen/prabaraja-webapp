<<<<<<< HEAD
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
=======

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
>>>>>>> e707e64ff2913728f46ab635ef450f868c45b79f
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { formatCurrency, parseInputCurrency, formatInputCurrency } from "@/lib/utils";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
  archived?: boolean;
}

interface TransferFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromAccount: Account;
  accounts: Account[];
  onTransfer: (from: string, to: string, amount: number, notes: string) => void;
  fromAccount?: Account;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const transferFormSchema = z.object({
  fromAccount: z.string().min(1, "Please select a source account"),
  toAccount: z.string().min(1, "Please select a destination account"),
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional(),
})
.refine(data => data.fromAccount !== data.toAccount, {
  message: "Source and destination accounts must be different",
  path: ["toAccount"],
});

export function TransferFundsDialog({ 
<<<<<<< HEAD
  open, 
  onOpenChange, 
  fromAccount,
  accounts, 
  onTransfer 
}: TransferFundsDialogProps) {
  const [previewMode, setPreviewMode] = React.useState(false);
  const activeAccounts = accounts.filter(account => !account.archived);
=======
  accounts, 
  onTransfer, 
  fromAccount,
  open: controlledOpen,
  onOpenChange: setControlledOpen 
}: TransferFundsDialogProps) {
  const [open, setOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const activeAccounts = accounts && accounts.length > 0 ? accounts.filter(account => !account.archived) : [];
  
  // Handle both controlled and uncontrolled states
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
>>>>>>> e707e64ff2913728f46ab635ef450f868c45b79f
  
  const form = useForm<z.infer<typeof transferFormSchema>>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
<<<<<<< HEAD
      fromAccount: fromAccount.code,
=======
      fromAccount: fromAccount ? fromAccount.code : "",
>>>>>>> e707e64ff2913728f46ab635ef450f868c45b79f
      toAccount: "",
      amount: "",
      notes: "",
    },
  });
  
  // Update form when fromAccount changes
  useEffect(() => {
    if (fromAccount) {
      form.setValue("fromAccount", fromAccount.code);
    }
  }, [fromAccount, form]);

  const watchFromAccount = form.watch("fromAccount");
  const watchToAccount = form.watch("toAccount");
  const watchAmount = form.watch("amount");
  
  const numericAmount = parseInputCurrency(watchAmount);
  
  const selectedFromAccount = activeAccounts.find(acc => acc.code === watchFromAccount);
  const selectedToAccount = activeAccounts.find(acc => acc.code === watchToAccount);
  
  const getAccountBalance = (balanceString: string) => {
    return parseInt(balanceString.replace(/[^\d-]/g, '')) || 0;
  };
  
  const fromAccountBalance = selectedFromAccount ? getAccountBalance(selectedFromAccount.balance) : 0;
  const insufficientFunds = numericAmount > fromAccountBalance;

  const handleClose = () => {
    form.reset();
    setPreviewMode(false);
<<<<<<< HEAD
    onOpenChange(false);
=======
    setIsOpen(false);
>>>>>>> e707e64ff2913728f46ab635ef450f868c45b79f
  };

  const onSubmit = (data: z.infer<typeof transferFormSchema>) => {
    if (previewMode) {
      onTransfer(
        data.fromAccount,
        data.toAccount,
        parseInputCurrency(data.amount),
        data.notes || ""
      );
      toast.success("Funds transferred successfully");
      handleClose();
    } else {
      setPreviewMode(true);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCurrency(e.target.value);
    form.setValue("amount", formatted);
  };

  return (
<<<<<<< HEAD
    <Dialog open={open} onOpenChange={onOpenChange}>
=======
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm">
            Transfer Funds
          </Button>
        </DialogTrigger>
      )}
>>>>>>> e707e64ff2913728f46ab635ef450f868c45b79f
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {previewMode ? "Confirm Transfer" : "Transfer Funds Between Accounts"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {previewMode ? (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">From Account:</div>
                  <div className="text-sm font-medium">
                    {selectedFromAccount?.name} ({selectedFromAccount?.code})
                  </div>
                  
                  <div className="text-sm text-muted-foreground">To Account:</div>
                  <div className="text-sm font-medium">
                    {selectedToAccount?.name} ({selectedToAccount?.code})
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Amount:</div>
                  <div className="text-sm font-medium">
                    Rp {parseInputCurrency(watchAmount).toLocaleString('id-ID')}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Current Balance (From):</div>
                  <div className="text-sm font-medium">{selectedFromAccount?.balance}</div>
                  
                  <div className="text-sm text-muted-foreground">New Balance (From):</div>
                  <div className="text-sm font-medium">
                    Rp {(fromAccountBalance - numericAmount).toLocaleString('id-ID')}
                  </div>
                  
                  {form.getValues("notes") && (
                    <>
                      <div className="text-sm text-muted-foreground">Notes:</div>
                      <div className="text-sm font-medium">{form.getValues("notes")}</div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
<<<<<<< HEAD
                <div className="p-3 border rounded-md bg-muted/10">
                  <div className="text-sm font-medium">From Account:</div>
                  <div className="text-sm">
                    {fromAccount.name} ({fromAccount.code}) - {fromAccount.balance}
                  </div>
                </div>
=======
                <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Account</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!!fromAccount}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAccounts.map((account) => (
                            <SelectItem key={account.code} value={account.code}>
                              {account.name} - {account.balance}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
>>>>>>> e707e64ff2913728f46ab635ef450f868c45b79f
                
                <FormField
                  control={form.control}
                  name="toAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Account</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAccounts
                            .filter(account => account.code !== fromAccount.code)
                            .map((account) => (
                              <SelectItem key={account.code} value={account.code}>
                                {account.name} - {account.balance}
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
                      {insufficientFunds && watchAmount && (
                        <p className="text-sm text-destructive mt-1">
                          Insufficient funds in the source account
                        </p>
                      )}
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
                          placeholder="Purpose of transfer or reference"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <Button type="submit" disabled={insufficientFunds}>
                    Confirm Transfer
                  </Button>
                </div>
              ) : (
                <Button 
                  type="submit" 
                  disabled={!watchToAccount || !watchAmount || insufficientFunds}
                >
                  Review Transfer
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}