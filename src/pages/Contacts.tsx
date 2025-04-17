
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, User, UserPlus, Users, Building2, ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const contacts = [
  {
    id: 1,
    category: "Customer",
    name: "PT Maju Jaya",
    number: "CUST-001",
    email: "contact@majujaya.com",
    address: "Jl. Sudirman No. 123, Jakarta",
  },
  {
    id: 2,
    category: "Vendor",
    name: "CV Sukses Makmur",
    number: "VEN-001",
    email: "info@suksesmakmur.com",
    address: "Jl. Gatot Subroto No. 45, Bandung",
  },
  {
    id: 3,
    category: "Employee",
    name: "Budi Santoso",
    number: "EMP-001",
    email: "budi.s@company.com",
    address: "Jl. Melati No. 67, Surabaya",
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15];

const Contacts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1]);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Employee":
        return <User size={16} color={getCategoryColor("Employee")} />;
      case "Customer":
        return <Users size={16} color={getCategoryColor("Customer")} />;
      case "Vendor":
        return <Building2 size={16} color={getCategoryColor("Vendor")} />;
      default:
        return <User size={16} color={getCategoryColor("default")} />;
    }
  };

  const handleContactClick = (contactId: number) => {
    navigate(`/contact-details/${contactId}`);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Contacts</h1>
          <p className="text-white/80"> View your company Contacts</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="bg-[#F8F7FF] p-5 rounded-lg inline-block">
              <Button 
                className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                onClick={() => navigate('/create-contact')}
              >
                Create Contact<UserPlus className="ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      All Categories
                    </span>
                  </SelectItem>
                  <SelectItem value="Customer">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon("Customer")}
                      Customer
                    </span>
                  </SelectItem>
                  <SelectItem value="Vendor">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon("Vendor")}
                      Vendor
                    </span>
                  </SelectItem>
                  <SelectItem value="Employee">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon("Employee")}
                      Employee
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} rows
                    </SelectItem>
                  ))}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(contact.category)}
                        {contact.category}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        onClick={() => handleContactClick(contact.id)}
                      >
                        {contact.name}
                        <ArrowRight size={14} />
                      </Button>
                    </TableCell>
                    <TableCell>{contact.number}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{contact.address}</TableCell>
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
