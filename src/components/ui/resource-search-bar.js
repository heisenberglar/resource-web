import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  Box,
  Input,
  Flex,
  Button,
  useToast,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import qs from "qs";
import useDebounce from "src/components/__utils/debouncer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResourceSearchBar({ article }) {
  const { data: session, status } = useSession();

  const [fetchedResources, setFetchedResources] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [chosenResource, setChosenResource] = useState(null);
  const toast = useToast();
  const statuses = ["success", "error", "warning", "info"];

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const primaryBackground = useColorModeValue("white", "gray.900");

  useDebounce(
    () => {
      const fetchFilteredResources = async (wordEntered) => {
        const resourceQuery = qs.stringify(
          {
            filters: {
              category: article.attributes.category.data.id,
              title: {
                $containsi: wordEntered,
              },
            },
            fields: ["title", "creator", "description", "prerequisite"],
            pagination: {
              page: 1,
              pageSize: 10,
            },
          },
          {
            encodeValuesOnly: true,
          }
        );

        const rawResources = await fetch(
          `${API_URL}/api/resources?` + resourceQuery,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.jwt}`,
            },
          }
        );

        const resources = await rawResources.json();
        setFetchedResources(resources?.data);

        return resources;
      };

      wordEntered
        ? fetchFilteredResources(wordEntered)
        : setFetchedResources([]);
    },
    [wordEntered],
    650
  );

  function handleClick(resource) {
    reset({});

    setChosenResource(resource);
    setFetchedResources([]);
  }

  async function onSubmit(resourceInstanceData) {
    if (!session) {
      return toast({
        title: "There seems to be a glitch.",
        description:
          "Please present your authorization. Sign in and try again.",
        status: statuses[1],
        isClosable: true,
        position: "bottom-right",
      });
    }

    const res = await fetch(`${API_URL}/api/resource-instances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...resourceInstanceData,
          article: article.id,
          resource: chosenResource.id,
        },
      }),
    });

    const response = await res.json();
    console.log(response);

    if (response.error) {
      toast({
        title: response.error.name,
        description: response.error.details,
        status: statuses[1],
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Resource added",
        description:
          "We've pinned the resource's coordinates to the article. Many thanks!",
        status: statuses[0],
        isClosable: true,
        position: "bottom-right",
      });
      clearInput();
    }
  }

  const clearInput = () => {
    setFetchedResources([]);
    setWordEntered("");
  };

  return (
    <Flex my={5} flexDirection="column" mx="auto" width={["100%", "80%"]}>
      <Input
        placeholder="Enter resource title"
        textAlign="center"
        border="1px"
        borderColor="gray.400"
        mx="auto"
        minH="3rem"
        value={chosenResource ? chosenResource?.attributes?.title : wordEntered}
        onChange={(e) => {
          setChosenResource(null);
          setWordEntered(e.target.value);
        }}
      ></Input>
      {fetchedResources?.length > 0 && !chosenResource ? (
        <Box
          p={2}
          border="1px"
          borderColor="gray.200"
          borderRadius="4px"
          zIndex="10"
        >
          {fetchedResources.slice(0, 5).map((resource, key) => {
            return (
              <Box
                key={key}
                p="0.5rem"
                _hover={{
                  background: "gray.500",
                  borderRadius: "3px",
                }}
                onClick={() => {
                  handleClick(resource);
                }}
              >
                {resource.attributes.title}
                {resource.attributes.creator
                  ? ` (${resource.attributes.creator})`
                  : null}
              </Box>
            );
          })}
        </Box>
      ) : null}
      {chosenResource && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired isInvalid={errors.description} mt={3}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              defaultValue={chosenResource.attributes.description}
              {...register("description", {
                required: "This is required",
                minLength: {
                  value: 100,
                  message: "Kindly give more insight about the resource.",
                },
              })}
              minH={150}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
          <Flex direction="row" wrap="wrap">
            <FormControl mt={3}>
              <FormLabel htmlFor="prerequisite">Prerequisites</FormLabel>
              <Textarea
                id="prerequisite"
                name="prerequisite"
                defaultValue={chosenResource.attributes.prerequisite}
                {...register("prerequisite")}
              />
            </FormControl>
          </Flex>
          <Box align="center" mt="1rem">
            <Button type="submit">Attach this resource</Button>
          </Box>
        </form>
      )}
    </Flex>
  );
}
