import { useForm } from "react-hook-form"
import {
  Flex,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Button,
  Textarea,
  useToast,
  Spacer,
} from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import LoadingPage from "src/components/ui/loadingPage"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ResourceForm({ article, categories }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const { data: session, status } = useSession()
  const toast = useToast()
  const statuses = ["success", "error", "warning", "info"]

  async function onSubmit(resourceData) {
    const res = await fetch(`${API_URL}/api/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({
        data: {
          ...resourceData,
          user: session?.user?.id,
        },
      }),
    })

    const response = await res.json()
    console.log(response)

    if (response.error) {
      const errorDetails =
        typeof response.error.details === "object"
          ? response.error.name
          : response.error.details

      toast({
        title: errorDetails,
        description: response.error.message,
        status: statuses[1],
      })
    } else {
      const res = await fetch(`${API_URL}/api/resource-instances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({
          data: {
            article: article.id,
            resource: response?.data?.id,
          },
        }),
      })

      const resourceInstancesResponse = await res.json()
      console.log(resourceInstancesResponse)

      toast({
        title: "Resource sent",
        description: "Your new resource has been submitted. Many thanks!",
        status: statuses[0],
      })

      reset({
        title: "",
        creator: "",
        link: "",
        description: "",
        prerequisite: "",
      })
    }
  }

  if (status === "loading") return <LoadingPage />

  return (
    <Flex align="center" justifyContent="center" mx="auto">
      <Box p={2} width="full">
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired isInvalid={errors.title} mt={3}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                name="title"
                {...register("title", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <Flex direction="row" wrap="wrap">
              <FormControl mt={3}>
                <FormLabel htmlFor="creator">Created by</FormLabel>
                <Input name="creator" type="text" {...register("creator")} />
              </FormControl>
              <Spacer />
              <FormControl isRequired isInvalid={errors.category} mt={3}>
                <FormLabel htmlFor="category">Category</FormLabel>
                <Select id="category" name="category" {...register("category")}>
                  {categories?.map((category) => {
                    return (
                      <option value={category?.id} key={category?.id}>
                        {category?.attributes?.title}
                      </option>
                    )
                  })}
                </Select>
                <FormErrorMessage>
                  {errors.category && errors.category.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex direction="row" wrap="wrap">
              <FormControl isRequired mt={3} isInvalid={errors.type}>
                <FormLabel htmlFor="type">Type</FormLabel>
                <Select id="type" name="type" {...register("type")}>
                  <option value="Course">Course</option>
                  <option value="Blog">Blog</option>
                  <option value="Book">Book </option>
                  <option value="App">App</option>
                  <option value="Website">Website </option>
                  <option value="Other">Other</option>
                </Select>
                <FormErrorMessage>
                  {errors.type && errors.type.message}
                </FormErrorMessage>
              </FormControl>
              <Spacer />
              <FormControl isRequired isInvalid={errors.pricing}>
                <FormLabel htmlFor="pricing">Pricing</FormLabel>
                <Select id="pricing" name="pricing" {...register("pricing")}>
                  <option value="Paid">Paid</option>
                  <option value="Audit">Audit</option>
                  <option value="Free">Free</option>
                </Select>
                <FormErrorMessage>
                  {errors.pricing && errors.pricing.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl isRequired isInvalid={errors.link} mt={3}>
              <FormLabel htmlFor="link">Link</FormLabel>
              <Input
                id="link"
                name="link"
                inputMode="url"
                {...register(
                  "link",
                  {
                    required: "This is required",
                    pattern: {
                      value:
                        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/,
                      message:
                        "The URL you entered seems weird. Kindly check for typos.",
                    },
                  },
                  {
                    shouldFocus: true,
                  }
                )}
              />
              <FormErrorMessage>
                {errors.link && errors.link.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.description} mt={3}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                name="description"
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

            <FormControl mt={3}>
              <FormLabel htmlFor="prerequisite">Prerequisites</FormLabel>
              <Textarea
                id="prerequisite"
                name="prerequisite"
                {...register("prerequisite")}
              />
            </FormControl>
            <Box align="center">
              <Button
                justifySelf="center"
                mt={10}
                px={12}
                type="submit"
                isDisabled={isSubmitting}
                onClick={() => {
                  register("writer", { value: 1 })
                }}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Flex>
  )
}
