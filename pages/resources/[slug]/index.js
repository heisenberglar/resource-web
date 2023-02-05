import NextLink from "next/link";
import {
  Heading,
  Text,
  Flex,
  Box,
  Stack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faAtom,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { CourseJsonLd } from "next-seo";
import Layout from "src/components/layouts/layout";

export default function ResourcePage(props) {
  const { resource } = props;
  const resourceData = resource?.data?.attributes;

  return (
    <Layout title={resourceData?.title}>
      <Box my="5">
        <Heading as="h1" my="5">
          {resourceData?.title}
        </Heading>
        <CourseJsonLd
          courseName={resourceData?.title}
          providerName={resourceData?.creator ? resourceData?.creator : null}
          providerUrl={resourceData?.link}
          description={
            resourceData?.description ? resourceData?.description : null
          }
        />
        <Text>{resourceData?.category?.title}</Text>
        <Text fontSize="xl" my={5}>
          {resourceData?.description}
        </Text>
        <Flex wrap="wrap" flexDirection="row" fontSize="md">
          <Box w="50%" minW="150px">
            <HStack alignItems="start" py="1">
              <Box minW="20px" justify="center" pt="0.5">
                <FontAwesomeIcon icon={faChalkboardTeacher} />
              </Box>

              <Stack direction="column">
                <strong>Created by:</strong>
                <>{resourceData?.creator} </>
              </Stack>
            </HStack>
          </Box>
          <Box w="50%" minW="150px">
            <HStack alignItems="start" py="1">
              <Box minW="20px" justify="center" pt="0.5">
                <FontAwesomeIcon icon={faAtom} />
              </Box>
              <Stack direction="column">
                <strong>Type:</strong>
                <>{resourceData?.type}</>
              </Stack>
            </HStack>
          </Box>
        </Flex>
        <Flex wrap="wrap" flexDirection="row">
          <Box w="50%" minW="150px">
            <HStack alignItems="start" py="1">
              <Box minW="20px" justify="center" pt="0.5">
                <FontAwesomeIcon icon={faStar} />
              </Box>
              <Stack direction="column">
                <strong>Overall rating:</strong>
              </Stack>
            </HStack>
          </Box>
          <Box w="50%" minW="150px">
            <HStack alignItems="start" py="1">
              <Box justify="center" minW="20px" pt="0.5">
                <FontAwesomeIcon icon={faTag} />
              </Box>
              <Stack direction="column">
                <strong>Pricing:</strong>
                <>{resourceData?.pricing}</>
              </Stack>
            </HStack>
          </Box>
        </Flex>
      </Box>
      <Box fontSize="md">
        {resourceData?.prerequisite ? (
          <Text>
            <strong>Pre-requisites:</strong>
            <Text>{resourceData?.prerequisite}</Text>
          </Text>
        ) : null}
      </Box>
      <Box align="center" m={15}>
        <Button colorScheme="blue" variant="link" px={8} py={2}>
          <NextLink href={`/resources/${resourceData?.slug}/submit-review`}>
            <a>Submit a review</a>
          </NextLink>
        </Button>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const resource = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/resources?slug=${params?.slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resourceJson = await resource?.json();

  return {
    props: { resource: resourceJson },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const resources = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/resources`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const parsedResources = await resources?.json();

  const paths = parsedResources?.data?.map((resource) => ({
    params: {
      slug: resource?.attributes?.slug?.toString(),
    },
  }));

  return { paths, fallback: false };
}
