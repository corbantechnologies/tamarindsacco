"use client"

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { createBulkMembers } from "@/services/members";

function BulkMemberUploadCreate({ isOpen, onClose, refetchMembers }) {
    const auth = useAxiosAuth();
    const [loading, setLoading] = useState(false);


    const handleBulkMemberUpload = async (values, { resetForm }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (values.file) {
                formData.append("file", values.file);
            }
            await createBulkMembers(formData, auth);
            toast.success("Bulk members uploaded successfully");
            resetForm();
            onClose();
            refetchMembers();
        } catch (error) {
            toast.error("Failed to upload bulk members. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-[#cc5500]">
                        Bulk Member Upload Create
                    </DialogTitle>
                </DialogHeader>
                <Formik initialValues={{ file: null }} onSubmit={handleBulkMemberUpload}>
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="file" className="mb-3">
                                        Upload CSV File
                                    </Label>
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".csv"
                                        onChange={(event) => {
                                            setFieldValue("file", event.currentTarget.files[0]);
                                        }}
                                        disabled={loading}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !auth.isEnabled}
                                    className="bg-[#045e32] hover:bg-[#022007] text-white"
                                >
                                    {loading ? "Uploading..." : "Upload"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}

export default BulkMemberUploadCreate;