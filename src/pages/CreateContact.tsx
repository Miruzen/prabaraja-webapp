
import { useState, useEffect } from "react";
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
import { useContacts, useCreateContact } from "@/hooks/useContacts";

const contactSchema = z.object({
  category: z.enum(["Customer", "Vendor", "Employee"], {
    required_error: "Please select a category",
  }),
  name: z.string().min(1, "Name is required"),
  number: z.number().min(1, "Number is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const CreateContact = () => {
  const navigate = useNavigate();
  const { data: contacts = [] } = useContacts();
  const createContactMutation = useCreateContact();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: undefined,
      name: "",
      number: 0,
      email: "",
      phone: "",
      address: "",
    },
    mode: "onChange",
  });
  
  // Function to generate the next contact number based on category
  const generateNextNumber = (category: string) => {
    if (!category) return 1;
    
    // Find the highest number for the selected category
    const categoryContacts = contacts.filter(c => c.category === category);
    
    if (categoryContacts.length === 0) {
      return 1; // First contact of this category
    }
    
    // Find the highest number
    const highestNumber = Math.max(...categoryContacts.map(contact => contact.number));
    return highestNumber + 1;
  };

  // Update number when category changes
  useEffect(() => {
    const category = form.watch("category");
    if (category) {
      const nextNumber = generateNextNumber(category);
      form.setValue("number", nextNumber);
    }
  }, [form.watch("category"), contacts]);
  
  // Check if all fields are filled
  const isFormComplete = form.formState.isValid;

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await createContactMutation.mutateAsync(data);
      toast.success("Contact created successfully");
      navigate("/contacts");
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact");
    }
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
                      <FormLabel>Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Contact number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          readOnly 
                          className="bg-gray-100 cursor-not-allowed"
                        />
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
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={!isFormComplete || createContactMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createContactMutation.isPending ? "Creating..." : "Create Contact"}
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
