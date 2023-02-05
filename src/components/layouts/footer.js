import { Box, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <footer>
      <Flex
        p="1rem"
        borderTop="1px solid #fff"
        mx="auto"
        flexFlow="column"
        color="white"
        backgroundColor="#171923"
        position="relative"
        sx={{ zIndex: 3 }}
        gap="1rem"
      >
        <Box align="center">
          <p>dynarank.io Copyright 2023</p>
        </Box>
        <Flex
          justifyContent={"center"}
          gap="1rem"
          textAlign="center"
          flexWrap="wrap"
          fontSize="14px"
        >
          <NextLink href={`/policies/privacy-policy`} passHref>
            <Text _hover={{ cursor: "pointer" }}>Privacy Policy</Text>
          </NextLink>
          <NextLink href={`/policies/terms-of-service`} passHref>
            <Text _hover={{ cursor: "pointer" }}>Terms</Text>
          </NextLink>
        </Flex>
      </Flex>
    </footer>
  );
}
