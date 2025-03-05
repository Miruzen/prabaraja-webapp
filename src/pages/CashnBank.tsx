
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "@/components/Sidebar";
import { CreateAccountDialog } from "@/components/bank/CreateAccountDialog";
import { AccountActionDropdown } from "@/components/bank/AccountActionDropdown";
import { useState } from "react";
import { toast } from "sonner";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
  archived?: boolean;
}

const CashnBank = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { code: "1-10001", name: "Cash",bankName: "Bank Central Asia (BCA)" , balance: "Rp 4.490.871", archived: false },
    { code: "1-10002", name: "Bank Account",bankName: "Bank Central Asia (BCA)" , balance: "Rp 1.800.002", archived: false },
    { code: "1-10003", name: "Giro",bankName: "Bank Central Asia (BCA)" , balance: "Rp 184.651.887", archived: false },
    { code: "1-10004", name: "Test AKUN",bankName: "Bank Central Asia (BCA)" , balance: "Rp 0", archived: false },
    { code: "1-10012", name: "Test BCA",bankName: "Bank Central Asia (BCA)" , balance: "(Rp 151.623.322)", archived: false },
  ]);
  const [showArchived, setShowArchived] = useState(false);

  const handleCreateAccount = (formData: any) => {
    const newAccount = {
      code: formData.accountCode,
      name: formData.accountName,
      balance: `Rp ${formData.startBalance.toLocaleString('id-ID')}`,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      archived: false,
    };
    setAccounts([...accounts, newAccount]);
  };

  const handleArchiveAccount = (accountToArchive: Account) => {
    setAccounts(accounts.map(account => 
      account.code === accountToArchive.code 
        ? { ...account, archived: true }
        : account
    ));
  };

  const handleUnarchiveAccount = (accountToUnarchive: Account) => {
    setAccounts(accounts.map(account => 
      account.code === accountToUnarchive.code 
        ? { ...account, archived: false }
        : account
    ));
    toast.success("Account unarchived successfully");
  };

  const handleDeleteAccount = (accountToDelete: Account) => {
    setAccounts(accounts.filter(account => account.code !== accountToDelete.code));
    toast.success("Account deleted permanently");
  };

  const handleEditAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(account =>
      account.code === updatedAccount.code
        ? { ...account, ...updatedAccount }
        : account
    ));
  };

  const visibleAccounts = accounts.filter(account => account.archived === showArchived);

  const calculateTotal = (accounts: Account[]) => {
    return accounts.reduce((total, account) => {
      const amount = parseInt(account.balance.replace(/[^\d-]/g, '')) || 0;
      return total + amount;
    }, 0);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Cash & Bank</h1>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <CreateAccountDialog onSubmit={handleCreateAccount} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show archived accounts</span>
                <Switch
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account code</TableHead>
                  <TableHead>Account name</TableHead>
                  <TableHead>Account Bank</TableHead>
                  <TableHead>Balance in Prabasena</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleAccounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.balance}</TableCell>
                    <TableCell>
                      <AccountActionDropdown
                        account={account}
                        onArchive={handleArchiveAccount}
                        onEdit={handleEditAccount}
                        onUnarchive={handleUnarchiveAccount}
                        onDelete={handleDeleteAccount}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-[#F3F4F6]">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  Cash & bank balance
                  <span className="ml-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {visibleAccounts.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">
                  Rp {calculateTotal(visibleAccounts).toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#FEF2F2]">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  Credit Card balance
                  <span className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    5
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">Rp 130.545.869</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashnBank;
