import { Box, Text } from "@chakra-ui/react";
import { getProviders, signIn } from "next-auth/react";
import NextLink from "next/link";

export default function SignIn({ providers }) {
  return (
    <Box>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      <NextLink href={"/terms-of-service"} passHref>
        <Text as="a">Terms of Service</Text>
      </NextLink>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
