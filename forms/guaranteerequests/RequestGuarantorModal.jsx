// components/modals/RequestGuarantorModal.jsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { createGuaranteeRequest } from "@/services/guaranteerequests";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

export default function RequestGuarantorModal({
  isOpen,
  onClose,
  loan,
  guarantorProfiles = [],
  existingGuarantors = [],
  refetch,
}) {
  const auth = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");

  const remainingToCover = loan?.remaining_to_cover || 0;
  const currentMember = loan?.member;

  // Filter using your actual API fields
  const filteredProfiles = guarantorProfiles
    .filter((p) => {
      const query = search.toLowerCase();
      const matchesSearch = p.member.toLowerCase().includes(query);
      const notSelf = p.member !== currentMember;
      const notRequested = !existingGuarantors.some(
        (g) => g.guarantor === p.member
      );
      const canGuarantee = p.is_eligible && Number(p.available_amount) > 0;

      return matchesSearch && notSelf && notRequested && canGuarantee;
    })
    .sort((a, b) => b.available_amount - a.available_amount);

  const selectedMax = selected ? Number(selected.available_amount) : 0;
  const amountNum = Number(amount) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= selectedMax;

  const handleRequest = async () => {
    if (!selected || !isValidAmount) return;

    setLoading(true);
    try {
      await createGuaranteeRequest(
        {
          guarantor: selected.member,
          loan_application: loan.reference,
          guaranteed_amount: amountNum,
        },
        auth
      );
      toast.success(
        `KES ${formatCurrency(amountNum)} requested from ${selected.member}`
      );
      onClose();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#045e32]">
            Request Guarantor
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Remaining to cover:{" "}
            <strong className="text-red-600">
              {formatCurrency(remainingToCover)}
            </strong>
          </p>
        </DialogHeader>

        <div className="space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by member number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Guarantor List */}
          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {filteredProfiles.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <UserX className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>No eligible guarantors found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.member}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${selected?.member === profile.member
                        ? "bg-green-50 border-l-4 border-[#045e32]"
                        : ""
                      }`}
                    onClick={() => {
                      setSelected(profile);
                      setAmount("");
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-base">
                          {profile.member}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Active: {profile.active_guarantees_count} /{" "}
                          {profile.max_active_guarantees}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(profile.available_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Available to guarantee
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amount Input */}
          {selected && (
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-medium">
                Amount to request from <strong>{selected.member}</strong>
              </Label>
              <Input
                type="number"
                placeholder={`Max: ${formatCurrency(selectedMax)}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  Max available: <strong>{formatCurrency(selectedMax)}</strong>
                </p>
                {amountNum > selectedMax && (
                  <p className="text-red-600">Exceeds available amount</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleRequest}
            disabled={!selected || !isValidAmount || loading || !auth.isEnabled}
            className="bg-[#045e32] hover:bg-[#022007] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
