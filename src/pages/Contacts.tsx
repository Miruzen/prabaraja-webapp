
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus } from "lucide-react";

// Mock data - replace with actual data when connected to backend
const contacts = [
  {
    id: 1,
    category: "Customer",
    name: "PT Maju Jaya",
    number: "CUST-001",
    email: "contact@majujaya.com",
    address: "Jl. Sudirman No. 123, Jakarta",
    balance: 5000000, // positive means they owe us
  },
  {
    id: 2,
    category: "Vendor",
    name: "CV Sukses Makmur",
    number: "VEN-001",
    email: "info@suksesmakmur.com",
    address: "Jl. Gatot Subroto No. 45, Bandung",
    balance: -2500000, // negative means we owe them
  },
  {
    id: 3,
    category: "Employee",
    name: "Budi Santoso",
    number: "EMP-001",
    email: "budi.s@company.com",
    address: "Jl. Melati No. 67, Surabaya",
    balance: 1500000,
  },
];

const Contacts = () => {
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('id-ID').format(absAmount);
    return `${amount < 0 ? '-' : ''}Rp ${formatted}`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">Contacts</h1>
            <Button className="bg-white text-primary hover:bg-gray-100">
              <UserPlus className="mr-2" />
              Create Contact
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.category}</TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.number}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{contact.address}</TableCell>
                    <TableCell className={contact.balance < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(contact.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
