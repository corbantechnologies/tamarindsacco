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
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
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
  const [openSavings, setOpenSavings] = useState(false);
  const [openVentures, setOpenVentures] = useState(false);

  // Handle flat array or object with results
  const data = accountsList?.results || accountsList || [];

  // Extract unique savings and venture types for filters
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

      return matchesSearch && hasSelectedSavings && hasSelectedVentures;
    });
  }, [data, searchTerm, selectedSavingsTypes, selectedVentureTypes]);

  // Generate table headers dynamically
  const headers = useMemo(() => {
    const allHeaders = ["Member Number", "Member Name"];
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
    return allHeaders;
  }, [savingsTypes, ventureTypes, selectedSavingsTypes, selectedVentureTypes]);

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

  // Clear all filters and search
  const handleClearFilters = () => {
    setSelectedSavingsTypes([]);
    setSelectedVentureTypes([]);
    setSearchTerm("");
    setOpenSavings(false);
    setOpenVentures(false);
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
                    ? `${selectedSavingsTypes.length} selected`
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
                    ? `${selectedVentureTypes.length} selected`
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

      {/* Table */}
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
                <TableRow key={user.member_no}>
                  <TableCell>{user.member_no}</TableCell>
                  <TableCell>{user.member_name}</TableCell>
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
                </TableRow>
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
