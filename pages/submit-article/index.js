import Layout from "src/components/layouts/layout"
import { useForm } from "react-hook-form"
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
  Button,
  Textarea,
} from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import BreadCrumb from "src/components/ui/breadcrumb"
import LoginPrompt from "src/components/ui/loginPrompt"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SubmitArticle({ categories }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const router = useRouter()
  const toast = useToast()
  const statuses = ["success", "error", "warning", "info"]

  const { data: session, loading } = useSession()

  if (!session || status === "loading") {
    return (
      <Layout title={"Post a new article"}>
        <LoginPrompt />
      </Layout>
    )
  }

  async function onSubmit(articleData) {
    articleData.writer = session?.user?.id

    if (!articleData.target) {
      articleData.target = articleData.intro.slice(0, 160)
    }

    const res = await fetch(`${API_URL}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: articleData }),
    })

    const response = await res.json()
    console.log(response)

    if (response.error) {
      console.log(response.error)
      toast({
        title: response.error.message,
        description: "We're not in the right place. Let's try that again.",
        status: statuses[1],
        position: "top-right",
      })
    } else {
      toast({
        title: "Article posted",
        description: `Your article has been submitted and is pending review. Many thanks!`,
        status: statuses[0],
        position: "top-right",
      })

      reset({
        title: "",
        category: "",
        intro: "",
      })
    }
  }

  return (
    <Layout title={"Post a new article"}>
      <BreadCrumb router={router} />
      <Flex align="center" justifyContent="center" mx="auto" mt={5}>
        <Box p={2} width="full">
          <Box textAlign="center">
            <Heading>Create a new post</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isRequired isInvalid={errors.title}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter title"
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
              <FormControl isRequired isInvalid={errors.category} mt={3}>
                <FormLabel htmlFor="category">Category</FormLabel>
                <Select
                  id="category"
                  name="category"
                  placeholder="Choose category"
                  {...register("category")}
                >
                  {categories?.map((category) => {
                    return (
                      <option key={category?.id} value={category?.id}>
                        {category?.attributes?.title}
                      </option>
                    )
                  })}
                </Select>
                <FormErrorMessage>
                  {errors.category && errors.category.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.intro} mt={3}>
                <FormLabel htmlFor="intro">Content</FormLabel>
                <Textarea
                  id="intro"
                  name="intro"
                  placeholder="Give a little background about the topic"
                  {...register("intro", {
                    required: "This is required",
                    minLength: {
                      value: 200,
                      message: "Kindly give more insight about the topic.",
                    },
                  })}
                  minH={200}
                />
                <FormErrorMessage>
                  {errors.intro && errors.intro.message}
                </FormErrorMessage>
              </FormControl>
              <Box align="center">
                <Button mt={10} px={12} isDisabled={isSubmitting} type="submit">
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Flex>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const categories = await fetch(API_URL + `/api/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const categoriesJson = await categories?.json()

  return {
    props: {
      categories: categoriesJson?.data,
    },
  }
}
