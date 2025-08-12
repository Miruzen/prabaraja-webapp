import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCOAAccounts, useJournalTransactionsAPI } from '@/hooks/useMasterDataAPI';
import { CreateCOADialog } from '@/components/masterdata/CreateCOADialog';
import { CreateJournalDialog } from '@/components/masterdata/CreateJournalDialog';

const MasterData = () => {
  const navigate = useNavigate();
  const [selectedCoaCode, setSelectedCoaCode] = useState<string>('');
  const [showJournalEntries, setShowJournalEntries] = useState(false);
  
  const { data: chartOfAccounts, loading: coaLoading } = useCOAAccounts();
  const { data: journalTransactions, loading: journalLoading } = useJournalTransactionsAPI(selectedCoaCode);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const generateJournalNumber = (date: string, id: string) => {
    const dateFormatted = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
    return `JRN-${dateFormatted}-${id.slice(-4)}`;
  };

  const calculateRunningBalance = (transactions: any[], currentIndex: number) => {
    let balance = 0;
    for (let i = 0; i <= currentIndex; i++) {
      balance += (transactions[i].debit || 0) - (transactions[i].credit || 0);
    }
    return balance;
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Master Data</h1>
          <p className="text-white/80">Manage your master data and reference information</p>
        </div>
        
        <div className="p-6">
          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button 
              variant="outline"
              onClick={() => navigate('/note-journal')}
            >
              Note Journal
            </Button>
            <CreateCOADialog>
              <Button>
                Create New COA
              </Button>
            </CreateCOADialog>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="coa" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="coa">COA</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>

            <TabsContent value="coa" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Balance in IDR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coaLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : chartOfAccounts?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No chart of accounts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      chartOfAccounts?.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-mono">{account.number}</TableCell>
                          <TableCell>{account.description}</TableCell>
                          <TableCell>{account.account_type}</TableCell>
                          <TableCell>All</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(account.balance || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="journal" className="space-y-4">
              <div className="space-y-4">
                {/* COA Selection */}
                <div className="flex items-center gap-4">
                  <Select value={selectedCoaCode} onValueChange={setSelectedCoaCode}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select COA Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartOfAccounts?.map((account) => (
                        <SelectItem key={account.id} value={account.number.toString()}>
                          {account.number} - {account.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setShowJournalEntries(true)}
                    disabled={!selectedCoaCode}
                  >
                    Generate Journal Entry
                  </Button>
                </div>

                {/* Journal Entries Table */}
                {showJournalEntries && selectedCoaCode && (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Journal Number</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {journalLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              Loading journal entries...
                            </TableCell>
                          </TableRow>
                        ) : journalTransactions?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              No journal entries found for selected account
                            </TableCell>
                          </TableRow>
                        ) : (
                          journalTransactions?.map((transaction, index) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto font-mono text-blue-600"
                                  onClick={() => {
                                    // Handle journal detail view
                                    console.log('Show journal details for:', transaction.id);
                                  }}
                                >
                                  {generateJournalNumber(transaction.transaction_date, transaction.id)}
                                </Button>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {transaction.debit ? formatCurrency(transaction.debit) : '-'}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {transaction.credit ? formatCurrency(transaction.credit) : '-'}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(calculateRunningBalance(journalTransactions, index))}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MasterData;