"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const SavingsTypesTable = ({ savingTypes }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Savings Types</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savingTypes?.map((type) => (
            <TableRow key={type.id}>
              <TableCell className="font-medium">{type.name}</TableCell>
              <TableCell>
                <span className="font-semibold text-success">
                  {type.interest_rate}%
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {type.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default SavingsTypesTable;
