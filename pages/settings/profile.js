import Layout from "src/components/layouts/layout";
import { useForm } from "react-hook-form";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  Button,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import LoginPrompt from "src/components/ui/loginPrompt";
import { useEffect, useState } from "react";
import LoadingPage from "src/components/ui/loadingPage";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfileSettings() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const toast = useToast();
  const statuses = ["success", "error", "warning", "info"];

  const [username, setUsername] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [socialsLinkedin, setSocialsLinkedin] = useState("");
  const [socialsYoutube, setSocialsYoutube] = useState("");
  const [socialOther, setSocialOther] = useState("");

  const { data: session, loading } = useSession();

  const fetchProfileSettings = async () => {
    const res = await fetch(`${API_URL}/api/users/me?populate=socials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const profileSettings = await res.json();

    setUsername(profileSettings.username);
    setAboutMe(profileSettings.about);
    setSocialsLinkedin(profileSettings.socials?.linkedin);
    setSocialsYoutube(profileSettings.socials?.youtube);
    setSocialOther(profileSettings.socials?.other);
  };

  useEffect(() => {
    if (!loading) {
      fetchProfileSettings();
    }
  }, [loading]);

  if (!session || loading) {
    return (
      <Layout title={"Profile settings"}>
        <LoginPrompt />
      </Layout>
    );
  }

  async function onSubmit(userData) {
    const res = await fetch(`${API_URL}/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: userData }),
    });

    const response = await res.json();
    console.log(response);

    if (response.error) {
      console.log(response.error);
      toast({
        title: response.error.message,
        description: "We're not in the right place. Let's try that again.",
        status: statuses[1],
        position: "top-right",
      });
    } else {
      toast({
        title: "User profile updated",
        status: statuses[0],
        position: "top-right",
      });
    }
  }

  return (
    <Layout title={"Profile settings"}>
      <Flex align="center" mx="auto" mt={5} maxW="620px">
        <Box p={2} width="full">
          <Box>
            <Heading>Profile settings</Heading>
          </Box>
          <Divider />
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isRequired isInvalid={errors.username} my="20px">
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  defaultValue={username}
                  {...register("username", {
                    pattern: /^[a-zA-Z0-9]+$/,
                    maxLength: 25,
                    minLength: 6,
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <Flex flexFlow="column" gap="5px" my="20px">
                <FormControl minW="300px">
                  <FormLabel htmlFor="linkedin">LinkedIn</FormLabel>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    defaultValue={socialsLinkedin}
                    placeholder="Enter LinkedIn profile"
                    {...register("socials.linkedin")}
                  />
                  <FormErrorMessage>
                    {errors.linkedin && errors.linkedin.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl minW="300px">
                  <FormLabel htmlFor="youtube">YouTube</FormLabel>
                  <Input
                    id="youtube"
                    name="youtube"
                    defaultValue={socialsYoutube}
                    placeholder="Enter YouTube channel"
                    {...register("socials.youtube")}
                  />
                  <FormErrorMessage>
                    {errors.youtube && errors.youtube.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl minW="300px">
                  <FormLabel htmlFor="other">Other</FormLabel>
                  <Input
                    id="other"
                    name="other"
                    defaultValue={socialOther}
                    placeholder="Where can we hear more from you"
                    {...register("socials.other")}
                  />
                  <FormErrorMessage>
                    {errors.other && errors.other.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <FormControl isInvalid={errors.about} my="20px">
                <FormLabel htmlFor="about">Bio</FormLabel>
                <Textarea
                  id="about"
                  name="about"
                  defaultValue={aboutMe}
                  placeholder="Tell us a little bit about yourself"
                  {...register("about", { maxLength: 400 })}
                  minH={100}
                />
                <FormErrorMessage>
                  {errors.about && errors.about.message}
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
  );
}
