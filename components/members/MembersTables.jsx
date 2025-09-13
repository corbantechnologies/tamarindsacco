import React from "react";
import { Card, Heading, Table } from "@radix-ui/themes";

const MembersTable = ({ members, refetchMembers }) => (
  <Card className="mt-6">
    <Heading size="5" mb="4">
      Members List
    </Heading>
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Member No</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members?.map((member) => (
          <Table.Row key={member.id}>
            <Table.Cell>{member.member_no}</Table.Cell>
            <Table.Cell>
              {member.salutation} {member.first_name} {member.last_name}
            </Table.Cell>
            <Table.Cell>{member.email}</Table.Cell>
            <Table.Cell>{member.phone}</Table.Cell>
            <Table.Cell>
              {member.is_approved ? "Approved" : "Pending"}
            </Table.Cell>
            <Table.Cell>
              {!member.is_approved && (
                <Button
                  size="sm"
                  color="orange"
                  onClick={() => {
                    // Add approval logic here
                    refetchMembers();
                  }}
                >
                  Approve
                </Button>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Card>
);

export default MembersTable;
