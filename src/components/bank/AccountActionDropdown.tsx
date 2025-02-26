
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowRightLeft, PiggyBank, BarChart, Pencil, Trash2 } from "lucide-react"

interface AccountActionDropdownProps {
  onSelect: (action: string) => void
}

export function AccountActionDropdown({ onSelect }: AccountActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Action <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-white">
        <DropdownMenuItem onClick={() => onSelect("edit")} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4 text-[#0FA0CE]" />
          Edit Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("delete")} className="cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4 text-[#ea384c]" />
          Delete Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onSelect("transfer")} className="cursor-pointer">
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Transfer Funds
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("receive")} className="cursor-pointer">
          <PiggyBank className="mr-2 h-4 w-4" />
          Receive Money
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("analysis")} className="cursor-pointer">
          <BarChart className="mr-2 h-4 w-4" />
          Cashflow Analysis
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
