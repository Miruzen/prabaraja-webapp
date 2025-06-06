
import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContacts } from "@/hooks/useContacts";
import { AddContactDialog } from "./AddContactDialog";

interface ContactSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function ContactSelector({ value, onValueChange, placeholder = "Select contact..." }: ContactSelectorProps) {
  const [open, setOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const { data: contacts = [] } = useContacts();

  const selectedContact = contacts.find(contact => contact.id === value);

  const handleAddNewContact = () => {
    setOpen(false);
    setAddContactOpen(true);
  };

  const handleContactAdded = (contactId: string) => {
    onValueChange(contactId);
    setAddContactOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedContact
              ? `${selectedContact.name} (${selectedContact.category})`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search contacts..." />
            <CommandList>
              <CommandEmpty>No contacts found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={handleAddNewContact}
                  className="flex items-center gap-2 text-blue-600 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add new contact
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Existing Contacts">
                {contacts.map((contact) => (
                  <CommandItem
                    key={contact.id}
                    value={contact.id}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === contact.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-sm text-gray-500">
                        {contact.category} • {contact.email}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AddContactDialog
        open={addContactOpen}
        onOpenChange={setAddContactOpen}
        onContactAdded={handleContactAdded}
      />
    </>
  );
}
