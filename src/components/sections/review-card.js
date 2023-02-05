import { Text, Box, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import starMaker from "src/components/ui/star-maker";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

export default function ReviewCard({ review }) {
  const timeSinceCreated = dayjs(
    review.attributes.createdAt || review.attributes.updatedAt
  ).fromNow(true);
  const primaryBackground = useColorModeValue("white", "gray.900");
  const reviewer = review.attributes.reviewer?.data?.attributes.username;
  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="3px"
      p="1rem"
      my="1.5rem"
      boxShadow="md"
      bg={primaryBackground}
    >
      <Box mb="1rem">
        <Box
          display="flex"
          flexFlow="row"
          alignItems="center"
          mb="0.5rem"
          gap="0.5rem"
          flexWrap="wrap"
          lineHeight="1.1"
        >
          <Box pb="3px">{starMaker(review.attributes.rating)}</Box>
          <Text fontWeight="600">{review.attributes.comment.title}</Text>
        </Box>
        <Box display="flex" flexWrap="wrap" alignItems="center" gap="0.35rem">
          {reviewer && (
            <NextLink href={`/profile/${reviewer}`}>
              <Box display="flex" flexFlow="row" _hover={{ cursor: "pointer" }}>
                <Box minW="1rem" my="auto">
                  <FontAwesomeIcon icon={faUserAstronaut} size="xs" />
                </Box>
                <Text>{reviewer}</Text>
              </Box>
            </NextLink>
          )}
          <Text fontSize="xs" color="gray.600">
            [{timeSinceCreated} ago]
          </Text>
        </Box>
      </Box>
      <Text>{review.attributes.comment.content}</Text>
      {review.attributes.comment.target && (
        <>
          <Text mt="2" fontWeight="600">
            Recommends it to:
          </Text>
          <p>{review.attributes.comment.target}</p>
        </>
      )}
    </Box>
  );
}
