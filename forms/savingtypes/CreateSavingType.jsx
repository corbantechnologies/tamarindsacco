"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createSavingType } from "@/services/savingstypes";
import { Field, Form, Formik } from "formik";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

function CreateSavingType({ refetchSavingTypes, closeModal }) {
  const [loading, setLoading] = useTransition();
  const token = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        interest_rate: 0,
      }}
      onSubmit={async (values) => {
        try {
          setLoading(async () => {
            await createSavingType(values, token);
            toast?.success("Saving type created successfully!");
            closeModal();
            refetchSavingTypes();
          });
        } catch (error) {
          console.error(error);
          toast?.error("Failed to create saving type!");
        }
      }}
    >
      {({ values }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Field type="text" id="name" name="name" />
          </div>

          <div className="space-y-2">
            <label htmlFor="interest_rate">Interest Rate</label>
            <Field type="number" id="interest_rate" name="interest_rate" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Field
              as="textarea"
              rows={4}
              type="text"
              id="description"
              name="description"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#cc5500] hover:bg-[#ffcc00] text-white font-semibold py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create Saving Type"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateSavingType;
