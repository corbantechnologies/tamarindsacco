import { Card, Heading, Table } from "@radix-ui/themes";
import React from "react";

const SavingsTypesTable = ({ savingTypes }) => (
  <Card className="mt-6">
    <Heading size="5" mb="4">
      Savings Types
    </Heading>
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Interest Rate</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {savingTypes?.map((type) => (
          <Table.Row key={type.id}>
            <Table.Cell>{type.name}</Table.Cell>
            <Table.Cell>{type.interest_rate}%</Table.Cell>
            <Table.Cell>{type.description}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Card>
);

export default SavingsTypesTable;
