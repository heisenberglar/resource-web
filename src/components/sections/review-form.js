import { useForm } from "react-hook-form"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
  Select,
  Button,
  Box,
  Flex,
  useToast,
  Input,
} from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import LoginPrompt from "../ui/loginPrompt"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ReviewForm(props) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const { resourceInstance } = props
  const toast = useToast()
  const statuses = ["success", "error", "warning", "info"]
  const { data: session } = useSession()

  async function onSubmit(reviewData) {
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...reviewData,
          reviewer: session?.user?.id,
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
        title: response.error.message,
        description: errorDetails,
        status: statuses[1],
      })
    } else {
      toast({
        title: "Review sent",
        description: "Your review has been submitted. Many thanks!",
        status: statuses[0],
      })

      reset({
        comment: {
          target: "",
          content: "",
        },
        rating: "",
      })
    }
  }

  if (!session) {
    return <LoginPrompt />
  }

  return (
    <Flex
      flexDirection="column"
      maxWidth="720px"
      align="center"
      justifyContent="center"
      mx="auto"
      mt={5}
    >
      <Box p={2} width="full">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl isRequired isInvalid={errors.comment?.title}>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter review title"
              {...register("comment.title", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.comment?.title && errors.comment?.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.comment?.content} mt={3}>
            <FormLabel>Review</FormLabel>
            <Textarea
              type="text"
              placeholder="What did you like most about it?"
              {...register("comment.content", {
                required: "This is required",
                minLength: {
                  value: 15,
                  message: "Kindly give more insight into your review",
                },
              })}
            />
            <FormErrorMessage>
              {errors.comment?.content && errors.comment?.content.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mt={3}>
            <FormLabel>Target</FormLabel>
            <Textarea
              type="text"
              placeholder="Who should take this resource?"
              {...register("comment.target")}
            />
          </FormControl>
          <FormControl isRequired isInvalid={errors.rating} mt={3}>
            <FormLabel>Rating</FormLabel>
            <Select
              placeholder="How would you rate it?"
              {...register("rating", {
                required: "This is required",
              })}
            >
              <option value={5}>5 - Outstanding</option>
              <option value={4}>4 - Impressive</option>
              <option value={3}>3 - Satisfactory</option>
              <option value={2}>2 - Lacking</option>
              <option value={1}>1 - Heartbreaking</option>
            </Select>
            <FormErrorMessage>
              {errors.rating && errors.rating.message}
            </FormErrorMessage>
          </FormControl>

          <Box align="center">
            <Button
              mt={10}
              px="1.5rem"
              py="0.5rem"
              type="submit"
              isDisabled={isSubmitting}
              onClick={() => {
                register("resource_instance", { value: resourceInstance.id })
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Flex>
  )
}
