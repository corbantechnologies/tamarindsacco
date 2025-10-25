import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const AccountsListTable = ({ accountsList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSavingsTypes, setSelectedSavingsTypes] = useState([]);
  const [selectedVentureTypes, setSelectedVentureTypes] = useState([]);
  const [selectedLoanTypes, setSelectedLoanTypes] = useState([]);
  const [openSavings, setOpenSavings] = useState(false);
  const [openVentures, setOpenVentures] = useState(false);
  const [openLoans, setOpenLoans] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // Handle flat array or object with results
  const data = accountsList?.results || accountsList || [];

  // Extract unique savings, venture, and loan types for filters
  const savingsTypes = useMemo(() => {
    const types = new Set();
    data.forEach((user) => {
      user.savings_accounts.forEach(([_, typeName]) => types.add(typeName));
    });
    return Array.from(types);
  }, [data]);

  const ventureTypes = useMemo(() => {
    const types = new Set();
    data.forEach((user) => {
      user.venture_accounts.forEach(([_, typeName]) => types.add(typeName));
    });
    return Array.from(types);
  }, [data]);

  const loanTypes = useMemo(() => {
    const types = new Set();
    data.forEach((user) => {
      user.loan_accounts.forEach(([_, typeName]) => types.add(typeName));
    });
    return Array.from(types);
  }, [data]);

  // Filter accounts based on search and selected types
  const filteredAccounts = useMemo(() => {
    return data.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.member_no.toLowerCase().includes(searchLower) ||
        user.member_name.toLowerCase().includes(searchLower);

      const hasSelectedSavings =
        selectedSavingsTypes.length === 0 ||
        user.savings_accounts.some(([_, typeName]) =>
          selectedSavingsTypes.includes(typeName)
        );

      const hasSelectedVentures =
        selectedVentureTypes.length === 0 ||
        user.venture_accounts.some(([_, typeName]) =>
          selectedVentureTypes.includes(typeName)
        );

      const hasSelectedLoans =
        selectedLoanTypes.length === 0 ||
        user.loan_accounts.some(([_, typeName]) =>
          selectedLoanTypes.includes(typeName)
        );

      return (
        matchesSearch &&
        hasSelectedSavings &&
        hasSelectedVentures &&
        hasSelectedLoans
      );
    });
  }, [
    data,
    searchTerm,
    selectedSavingsTypes,
    selectedVentureTypes,
    selectedLoanTypes,
  ]);

  // Generate table headers for main table
  const headers = useMemo(() => {
    const allHeaders = ["Member Number", "Member Name", ""];
    if (
      selectedSavingsTypes.length === 0 ||
      selectedSavingsTypes.length === savingsTypes.length
    ) {
      savingsTypes.forEach((type) => {
        allHeaders.push(`${type} Account`, `${type} Balance`);
      });
    } else {
      selectedSavingsTypes.forEach((type) => {
        allHeaders.push(`${type} Account`, `${type} Balance`);
      });
    }
    if (
      selectedVentureTypes.length === 0 ||
      selectedVentureTypes.length === ventureTypes.length
    ) {
      ventureTypes.forEach((type) => {
        allHeaders.push(`${type} Account`, `${type} Balance`);
      });
    } else {
      selectedVentureTypes.forEach((type) => {
        allHeaders.push(`${type} Account`, `${type} Balance`);
      });
    }
    if (
      selectedLoanTypes.length === 0 ||
      selectedLoanTypes.length === loanTypes.length
    ) {
      loanTypes.forEach((type) => {
        allHeaders.push(`${type} Account`, `${type} Balance`);
      });
    } else {
      selectedLoanTypes.forEach((type) => {
        allHeaders.push(`${type} Account`, `${type} Balance`);
      });
    }
    return allHeaders;
  }, [
    savingsTypes,
    ventureTypes,
    loanTypes,
    selectedSavingsTypes,
    selectedVentureTypes,
    selectedLoanTypes,
  ]);

  // Interest table headers
  const interestHeaders = [
    "Loan Account",
    "Loan Type",
    "Interest Amount",
    "Outstanding Balance",
  ];

  // Handle filter changes
  const handleSavingsTypeFilter = (type) => {
    setSelectedSavingsTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleVentureTypeFilter = (type) => {
    setSelectedVentureTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLoanTypeFilter = (type) => {
    setSelectedLoanTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Toggle row expansion
  const toggleRow = (memberNo) => {
    setExpandedRows((prev) => ({
      ...prev,
      [memberNo]: !prev[memberNo],
    }));
  };

  // Clear all filters and search
  const handleClearFilters = () => {
    setSelectedSavingsTypes([]);
    setSelectedVentureTypes([]);
    setSelectedLoanTypes([]);
    setSearchTerm("");
    setOpenSavings(false);
    setOpenVentures(false);
    setOpenLoans(false);
    setExpandedRows({});
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Member Number or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Savings Types Dropdown */}
          <div>
            <Popover open={openSavings} onOpenChange={setOpenSavings}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSavings}
                  className="w-[200px] justify-between"
                >
                  {selectedSavingsTypes.length > 0
                    ? `${selectedSavingsTypes.length} savings selected`
                    : "Select savings types"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search savings types..." />
                  <CommandList>
                    <CommandEmpty>No savings types found.</CommandEmpty>
                    <CommandGroup>
                      {savingsTypes.map((type) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={() => {
                            handleSavingsTypeFilter(type);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSavingsTypes.includes(type)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* Venture Types Dropdown */}
          <div>
            <Popover open={openVentures} onOpenChange={setOpenVentures}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openVentures}
                  className="w-[200px] justify-between"
                >
                  {selectedVentureTypes.length > 0
                    ? `${selectedVentureTypes.length} ventures selected`
                    : "Select venture types"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search venture types..." />
                  <CommandList>
                    <CommandEmpty>No venture types found.</CommandEmpty>
                    <CommandGroup>
                      {ventureTypes.map((type) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={() => {
                            handleVentureTypeFilter(type);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedVentureTypes.includes(type)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* Loan Types Dropdown */}
          <div>
            <Popover open={openLoans} onOpenChange={setOpenLoans}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openLoans}
                  className="w-[200px] justify-between"
                >
                  {selectedLoanTypes.length > 0
                    ? `${selectedLoanTypes.length} loans selected`
                    : "Select loan types"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search loan types..." />
                  <CommandList>
                    <CommandEmpty>No loan types found.</CommandEmpty>
                    <CommandGroup>
                      {loanTypes.map((type) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={() => {
                            handleLoanTypeFilter(type);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLoanTypes.includes(type)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* Clear Filters Button */}
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="h-10 px-4"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((user) => (
                <React.Fragment key={user.member_no}>
                  <TableRow>
                    <TableCell>{user.member_no}</TableCell>
                    <TableCell>{user.member_name}</TableCell>
                    <TableCell>
                      {user.loan_interest.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(user.member_no)}
                        >
                          {expandedRows[user.member_no] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                    {savingsTypes.map((type) => {
                      if (
                        selectedSavingsTypes.length === 0 ||
                        selectedSavingsTypes.includes(type)
                      ) {
                        const account = user.savings_accounts.find(
                          ([_, t]) => t === type
                        );
                        return (
                          <React.Fragment key={type}>
                            <TableCell>{account ? account[0] : ""}</TableCell>
                            <TableCell>
                              {account ? account[2].toFixed(2) : ""}
                            </TableCell>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                    {ventureTypes.map((type) => {
                      if (
                        selectedVentureTypes.length === 0 ||
                        selectedVentureTypes.includes(type)
                      ) {
                        const account = user.venture_accounts.find(
                          ([_, t]) => t === type
                        );
                        return (
                          <React.Fragment key={type}>
                            <TableCell>{account ? account[0] : ""}</TableCell>
                            <TableCell>
                              {account ? account[2].toFixed(2) : ""}
                            </TableCell>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                    {loanTypes.map((type) => {
                      if (
                        selectedLoanTypes.length === 0 ||
                        selectedLoanTypes.includes(type)
                      ) {
                        const account = user.loan_accounts.find(
                          ([_, t]) => t === type
                        );
                        return (
                          <React.Fragment key={type}>
                            <TableCell>{account ? account[0] : ""}</TableCell>
                            <TableCell>
                              {account ? account[2].toFixed(2) : ""}
                            </TableCell>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                  </TableRow>
                  {expandedRows[user.member_no] &&
                    user.loan_interest.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={headers.length} className="p-0">
                          <div className="p-4 bg-gray-50">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {interestHeaders.map((header) => (
                                    <TableHead key={header}>{header}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {user.loan_interest
                                  .filter(
                                    ([_, acc_no]) =>
                                      selectedLoanTypes.length === 0 ||
                                      user.loan_accounts.some(
                                        ([loan_acc_no, type]) =>
                                          loan_acc_no === acc_no &&
                                          selectedLoanTypes.includes(type)
                                      )
                                  )
                                  .map(
                                    (
                                      [amount, acc_no, outstanding_balance],
                                      index
                                    ) => {
                                      const loan = user.loan_accounts.find(
                                        ([loan_acc_no]) =>
                                          loan_acc_no === acc_no
                                      );
                                      return (
                                        <TableRow key={`${acc_no}-${index}`}>
                                          <TableCell>{acc_no}</TableCell>
                                          <TableCell>
                                            {loan ? loan[1] : "Unknown"}
                                          </TableCell>
                                          <TableCell>
                                            {amount.toFixed(2)}
                                          </TableCell>
                                          <TableCell>
                                            {outstanding_balance.toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-center text-gray-500"
                >
                  No accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AccountsListTable;
