import React from "react";
import { useToast } from "@chakra-ui/react";

export default function ErrorMessage({ title, description }) {
  const toast = useToast();

  return toast({
    title: title,
    description: description,
    status: "error",
    isClosable: true,
    position: "bottom-right",
  });
}
