import React from "react";
import { Card, Flex, Text } from "@radix-ui/themes";
import { Users } from "lucide-react";

const MembersCountCard = ({ count }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <Flex direction="column" gap="2">
      <Flex align="center" gap="2">
        <Users className="h-6 w-6 text-[#cc5500]" />
        <Text size="5" weight="bold" color="orange">
          Total Members
        </Text>
      </Flex>
      <Text size="6" weight="bold">
        {count}
      </Text>
    </Flex>
  </Card>
);

export default MembersCountCard;
