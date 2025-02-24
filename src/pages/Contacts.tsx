
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserPlus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data - replace with actual data when connected to backend
const contacts = [
  {
    id: 1,
    category: "Customer",
    name: "PT Maju Jaya",
    number: "CUST-001",
    email: "contact@majujaya.com",
    address: "Jl. Sudirman No. 123, Jakarta",
    balance: 5000000,
  },
  {
    id: 2,
    category: "Vendor",
    name: "CV Sukses Makmur",
    number: "VEN-001",
    email: "info@suksesmakmur.com",
    address: "Jl. Gatot Subroto No. 45, Bandung",
    balance: -2500000,
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

const ITEMS_PER_PAGE = 10;

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('id-ID').format(absAmount);
    return `${amount < 0 ? '-' : ''}Rp ${formatted}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Employee":
        return "#0EA5E9";
      case "Customer":
        return "#8B5CF6";
      case "Vendor":
        return "#F97316";
      default:
        return "#64748B";
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Contacts</h1>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-primary hover:bg-gray-100">
                <UserPlus className="mr-2" />
                Create Contact
              </Button>
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                {paginatedContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User size={20} color={getCategoryColor(contact.category)} />
                        {contact.category}
                      </div>
                    </TableCell>
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

          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;

