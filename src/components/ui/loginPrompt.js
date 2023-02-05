import { Text, Box } from "@chakra-ui/react"
import { signIn } from "next-auth/react"

const LoginPrompt = () => {
  return (
    <Box
      textAlign="center"
      mx="auto"
      my="2rem"
      onClick={(e) => {
        e.preventDefault()
        signIn("google", { callbackUrl: "https://dynarank.io" })
      }}
      _hover={{ cursor: "pointer" }}
    >
      <Text as="b">Please login to continue</Text>
    </Box>
  )
}

export default LoginPrompt
