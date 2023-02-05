import { Flex, Stack, Skeleton } from "@chakra-ui/react";

const LoadingPage = () => {
  return (
    <Flex maxW="820px" align="center">
      <Stack my="2rem">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Flex>
  );
};

export default LoadingPage;
