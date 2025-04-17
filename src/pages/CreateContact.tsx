
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Users, Building2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  category: z.string({
    required_error: "Please select a category",
  }),
  name: z.string().min(1, "Name is required"),
  number: z.string().min(1, "ID is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const CreateContact = () => {
  const navigate = useNavigate();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: "",
      name: "",
      number: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // In a real app, this would save to a database
    console.log("Contact data:", data);
    
    // Show success message
    toast.success("Contact created successfully");
    
    // Navigate back to contacts page
    navigate("/contacts");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Employee":
        return <User size={16} />;
      case "Customer":
        return <Users size={16} />;
      case "Vendor":
        return <Building2 size={16} />;
      default:
        return <User size={16} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Create New Contact</h1>
          <p className="text-white/80">Add a new contact to your network</p>
        </div>
        
        <div className="p-6 max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate("/contacts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full mt-6">
                  <Save className="mr-2 h-4 w-4" />
                  Create Contact
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateContact;
