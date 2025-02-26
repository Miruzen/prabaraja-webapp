
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Sidebar } from "@/components/Sidebar";
import { CreateAccountDialog } from "@/components/bank/CreateAccountDialog";
import { AccountActionDropdown } from "@/components/bank/AccountActionDropdown";
import { toast } from "sonner";
import { useState } from "react";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
}

const CashnBank = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { code: "1-10001", name: "Cash", balance: "Rp 4.490.871" },
    { code: "1-10002", name: "Bank Account", balance: "Rp 1.800.002" },
    { code: "1-10003", name: "Giro", balance: "Rp 184.651.887" },
    { code: "1-10004", name: "Test AKUN", balance: "Rp 0" },
    { code: "1-10012", name: "Test BCA", balance: "(Rp 151.623.322)" },
  ]);

  const handleCreateAccount = (formData: any) => {
    const newAccount = {
      code: formData.accountCode,
      name: formData.accountName,
      balance: `Rp ${formData.startBalance.toLocaleString('id-ID')}`,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
    };
    setAccounts([...accounts, newAccount]);
    toast.success("Account created successfully!");
  };

  const handleAction = (action: string) => {
    toast.info(`${action} feature coming soon!`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Cash & Bank</h1>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <CreateAccountDialog onSubmit={handleCreateAccount} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account code</TableHead>
                  <TableHead>Account name</TableHead>
                  <TableHead>Balance in Prabasena</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.balance}</TableCell>
                    <TableCell>
                      <AccountActionDropdown onSelect={handleAction} />
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
                    {accounts.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">Rp 30.337.696</div>
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
