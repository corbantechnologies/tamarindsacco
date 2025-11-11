"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, User } from "lucide-react";
import { deleteNextOfKin } from "@/services/nextofkin";
import toast from "react-hot-toast";
import NextOfKinFormDialog from "@/forms/nextofkin/NextOfKinFormDialog";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

function NextOfKinTable({ nextofkin = [], refetchAccount }) {
  const [editKin, setEditKin] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const token = useAxiosAuth();

  const handleDelete = async (reference) => {
    if (!confirm("Delete this next of kin?")) return;
    try {
      await deleteNextOfKin(reference, token);
      toast.success("Deleted successfully");
      refetchAccount();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (!nextofkin || nextofkin?.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No next of kin added yet.
      </p>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nextofkin?.map((kin) => (
              <TableRow key={kin?.reference}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#045e32]" />
                    {kin?.first_name} {kin?.last_name}
                  </div>
                </TableCell>
                <TableCell>{kin?.relationship}</TableCell>
                <TableCell>{kin?.phone}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditKin(kin);
                      setEditOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(kin?.reference)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <NextOfKinFormDialog
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditKin(null);
        }}
        refetchAccount={refetchAccount}
        nextOfKin={editKin}
      />
    </>
  );
}

export default NextOfKinTable;
