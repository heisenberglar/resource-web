import {
  Text,
  Flex,
  Box,
  HStack,
  Stack,
  VStack,
  Link,
  Button,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faAtom,
  faCommentsDollar,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

export default function ResourceDetail({ resource, resourceInstance }) {
  return (
    <Box>
      <Flex
        wrap="wrap"
        flexDirection="row"
        flex={1}
        justifyContent="flex-start"
        lineHeight="1.3"
        my="0.75rem"
      >
        {resource.creator && (
          <HStack
            alignItems="start"
            px="0.5rem"
            py="0.5rem"
            flex="1"
            minW="120px"
          >
            <Box alignItems="center" pt="0.5">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </Box>
            <Stack direction="column">
              <strong>Created by</strong>
              <Text>{resource.creator || "Not specified"}</Text>
            </Stack>
          </HStack>
        )}
        {resource.type && (
          <HStack
            alignItems="start"
            px="0.75rem"
            py="0.5rem"
            flex="1"
            minW="120px"
          >
            <Box minW="20px" justify="center" pt="0.5">
              <FontAwesomeIcon icon={faAtom} />
            </Box>
            <Stack direction="column">
              <strong>Type</strong>
              <Text>{resource.type || "Not specified"}</Text>
            </Stack>
          </HStack>
        )}
        {resource.pricing && (
          <HStack
            alignItems="start"
            px="0.75rem"
            py="0.5rem"
            flex="1"
            minW="120px"
          >
            <Box minW="20px" justify="center" pt="0.5">
              <FontAwesomeIcon icon={faCommentsDollar} />
            </Box>
            <Stack direction="column">
              <strong>Pricing</strong>
              <Text>{resource.pricing || "Not specified"}</Text>
            </Stack>
          </HStack>
        )}
      </Flex>
      <Box>
        {(resourceInstance.description || resource.description) && (
          <Text py="2">
            {resourceInstance.description || resource.description}
          </Text>
        )}
        {(resourceInstance.prerequisite || resource.prerequisite) && (
          <Text>
            <strong>Pre-requisites:</strong>{" "}
            {resourceInstance.prerequisite || resource.prerequisite}
          </Text>
        )}
      </Box>
    </Box>
  );
}
