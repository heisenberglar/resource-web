import { Box, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

export default function SuccessMessage({ message }) {
  return (
    <Box my={4}>
      <Alert status="success" borderRadius={4}>
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
}
