
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Account {
  code: string;
  name: string;
  statementBalance: string;
  balance: string;
}

const accounts: Account[] = [
  { code: "1-10001", name: "Cash", statementBalance: "Rp.0,00", balance: "Rp.4.490.871,00" },
  { code: "1-10002", name: "Bank Account", statementBalance: "Rp.0,00", balance: "Rp.1.800.002,00" },
  { code: "1-10003", name: "Giro", statementBalance: "Rp.0,00", balance: "Rp.184.651.887,42" },
  { code: "1-10004", name: "Test AKUN", statementBalance: "Rp.0,00", balance: "Rp.0,00" },
  { code: "1-10012", name: "Test BCA", statementBalance: "Rp.0,00", balance: "(Rp.151.623.322,00)" },
];

const Reports = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Cash & Bank</h1>
              <Button className="bg-[#6366F1] text-white">
                Create Account <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account code</TableHead>
                  <TableHead>Account name</TableHead>
                  <TableHead>Statement balance</TableHead>
                  <TableHead>Balance in Jurnal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="text-[#6366F1]">
                        Connect to bank
                      </Button>
                    </TableCell>
                    <TableCell>{account.statementBalance}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="ml-auto">
                        Create Transaction <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
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
                    5
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">Rp.30.337.696,42</div>
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
                <div className="text-xl font-semibold">Rp.130.545.869,42</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
