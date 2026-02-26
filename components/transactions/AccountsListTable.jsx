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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAccounts, currentPage]);

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

  // Headers for expanded tables
  const interestHeaders = [
    "Loan Account",
    "Loan Type",
    "Interest Amount",
    "Outstanding Balance",
  ];

  const disbursementHeaders = [
    "Loan Account",
    "Loan Type",
    "Disbursed Amount",
    "Date",
  ];

  const repaymentHeaders = [
    "Loan Account",
    "Loan Type",
    "Repayment Amount",
    "Date",
  ];

  const feeHeaders = [
    "Account Number",
    "Fee Type",
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
    setCurrentPage(1);
  };

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSavingsTypes, selectedVentureTypes, selectedLoanTypes]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Member Number or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-xs sm:text-sm h-10"
          />
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap lg:gap-2">
          {/* Savings Types Dropdown */}
          <div>
            <Popover open={openSavings} onOpenChange={setOpenSavings}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSavings}
                  className="w-full lg:w-[150px] justify-between text-xs sm:text-sm h-10"
                >
                  {selectedSavingsTypes.length > 0
                    ? `${selectedSavingsTypes.length} savings`
                    : "Savings types"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search savings..."
                    className="text-xs sm:text-sm h-8"
                  />
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
                          className="text-xs sm:text-sm"
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
                  className="w-full lg:w-[150px] justify-between text-xs sm:text-sm h-10"
                >
                  {selectedVentureTypes.length > 0
                    ? `${selectedVentureTypes.length} ventures`
                    : "Venture types"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search ventures..."
                    className="text-xs sm:text-sm h-8"
                  />
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
                          className="text-xs sm:text-sm"
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
                  className="w-full lg:w-[150px] justify-between text-xs sm:text-sm h-10"
                >
                  {selectedLoanTypes.length > 0
                    ? `${selectedLoanTypes.length} loans`
                    : "Loan types"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search loans..."
                    className="text-xs sm:text-sm h-8"
                  />
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
                          className="text-xs sm:text-sm"
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
            className="w-full lg:w-auto h-10 px-2 text-xs sm:text-sm"
          >
            <X className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className="text-xs sm:text-sm whitespace-nowrap px-2"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map((user) => (
                <React.Fragment key={user.member_no}>
                  <TableRow>
                    <TableCell className="text-xs sm:text-sm truncate px-2">
                      {user.member_no}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm truncate px-2">
                      {user.member_name}
                    </TableCell>
                    <TableCell className="px-2">
                      {(user.loan_interest?.length > 0 ||
                        user.loan_disbursements?.length > 0 ||
                        user.loan_repayments?.length > 0 ||
                        user.fees?.length > 0) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(user.member_no)}
                          >
                            {expandedRows[user.member_no] ? (
                              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
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
                            <TableCell className="text-xs sm:text-sm truncate px-2">
                              {account ? account[0] : ""}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm px-2">
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
                            <TableCell className="text-xs sm:text-sm truncate px-2">
                              {account ? account[0] : ""}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm px-2">
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
                            <TableCell className="text-xs sm:text-sm truncate px-2">
                              {account ? account[0] : ""}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm px-2">
                              {account ? account[2].toFixed(2) : ""}
                            </TableCell>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                  </TableRow>
                  {expandedRows[user.member_no] &&
                    (user.loan_interest?.length > 0 ||
                      user.loan_disbursements?.length > 0 ||
                      user.loan_repayments?.length > 0 ||
                      user.fees?.length > 0) && (
                      <TableRow className="bg-gray-50/50">
                        <TableCell colSpan={headers.length} className="p-0 border-b-2 border-[#cc5500]/20">
                          <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
                            {/* Loan Interest Table */}
                            {user.loan_interest?.length > 0 && (
                              <div className="bg-white rounded-md border shadow-sm">
                                <h4 className="px-3 py-2 text-sm font-semibold text-[#cc5500] border-b bg-orange-50/50">
                                  Loan Interest
                                </h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                      {interestHeaders.map((header) => (
                                        <TableHead
                                          key={header}
                                          className="text-xs sm:text-sm whitespace-nowrap px-3 h-8 text-gray-500"
                                        >
                                          {header}
                                        </TableHead>
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
                                            <TableRow key={`interest-${acc_no}-${index}`}>
                                              <TableCell className="text-xs sm:text-sm truncate px-3 py-2">
                                                {acc_no}
                                              </TableCell>
                                              <TableCell className="text-xs sm:text-sm truncate px-3 py-2 text-gray-600">
                                                {loan ? loan[1] : "Unknown"}
                                              </TableCell>
                                              <TableCell className="text-xs sm:text-sm px-3 py-2 font-medium">
                                                {amount.toFixed(2)}
                                              </TableCell>
                                              <TableCell className="text-xs sm:text-sm px-3 py-2">
                                                {outstanding_balance.toFixed(2)}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        }
                                      )}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            {/* Loan Disbursements Table */}
                            {user.loan_disbursements?.length > 0 && (
                              <div className="bg-white rounded-md border shadow-sm">
                                <h4 className="px-3 py-2 text-sm font-semibold text-green-700 border-b bg-green-50/50">
                                  Loan Disbursements
                                </h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                      {disbursementHeaders.map((header) => (
                                        <TableHead
                                          key={header}
                                          className="text-xs sm:text-sm whitespace-nowrap px-3 h-8 text-gray-500"
                                        >
                                          {header}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {user.loan_disbursements.map(
                                      ([amount, acc_no, type, date], index) => (
                                        <TableRow key={`disb-${acc_no}-${index}`}>
                                          <TableCell className="text-xs sm:text-sm truncate px-3 py-2">
                                            {acc_no}
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm truncate px-3 py-2 text-gray-600">
                                            {type}
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-3 py-2 font-medium text-green-700">
                                            {amount.toFixed(2)}
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-3 py-2 text-gray-500">
                                            {new Date(date).toLocaleString()}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            {/* Loan Repayments Table */}
                            {user.loan_repayments?.length > 0 && (
                              <div className="bg-white rounded-md border shadow-sm">
                                <h4 className="px-3 py-2 text-sm font-semibold text-blue-700 border-b bg-blue-50/50">
                                  Loan Repayments
                                </h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                      {repaymentHeaders.map((header) => (
                                        <TableHead
                                          key={header}
                                          className="text-xs sm:text-sm whitespace-nowrap px-3 h-8 text-gray-500"
                                        >
                                          {header}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {user.loan_repayments.map(
                                      ([amount, acc_no, type, date], index) => (
                                        <TableRow key={`repay-${acc_no}-${index}`}>
                                          <TableCell className="text-xs sm:text-sm truncate px-3 py-2">
                                            {acc_no}
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm truncate px-3 py-2 text-gray-600">
                                            {type}
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-3 py-2 font-medium text-blue-700">
                                            {amount.toFixed(2)}
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-3 py-2 text-gray-500">
                                            {new Date(date).toLocaleString()}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            {/* Fees Table */}
                            {user.fees?.length > 0 && (
                              <div className="bg-white rounded-md border shadow-sm">
                                <h4 className="px-3 py-2 text-sm font-semibold text-purple-700 border-b bg-purple-50/50">
                                  Fees
                                </h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                      {feeHeaders.map((header) => (
                                        <TableHead
                                          key={header}
                                          className="text-xs sm:text-sm whitespace-nowrap px-3 h-8 text-gray-500"
                                        >
                                          {header}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {user.fees.map((fee, index) => (
                                      <TableRow key={`fee-${fee.account_number}-${index}`}>
                                        <TableCell className="text-xs sm:text-sm truncate px-3 py-2">
                                          {fee.account_number}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm truncate px-3 py-2 text-gray-600">
                                          {fee.fee_type_name}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
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
                  className="text-center text-gray-500 text-xs sm:text-sm"
                >
                  No accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-md">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-xs"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredAccounts.length)}
                </span>{" "}
                of <span className="font-medium">{filteredAccounts.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 h-9"
                >
                  <span className="sr-only">Previous</span>
                  {"← Prev"}
                </Button>
                {/* Simple page numbers */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first, last, and immediate siblings
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 h-9 ${currentPage === pageNumber
                          ? "bg-[#045e32] text-white hover:bg-[#022007]"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 h-9"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 h-9"
                >
                  <span className="sr-only">Next</span>
                  {"Next →"}
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsListTable;
