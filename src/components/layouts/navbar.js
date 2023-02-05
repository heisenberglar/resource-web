import NextLink from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Box,
  Stack,
  Button,
  useColorMode,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import {
  faSun,
  faMoon,
  faCaretDown,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const [username, setUsername] = useState("Test");

  function handleToggleTheme() {
    toggleColorMode();
  }

  useEffect(() => {
    if (status !== "loading" && session) {
      setUsername(session.user.username);
    }
  }, [status, session]);

  const allUserLinks = [
    {
      id: "home",
      label: "Home",
      href: "/",
    },
  ];

  const authenticatedUserLinks = [
    // {
    //     id: "profile",
    //     label: "Profile",
    //     href: "/profile",
    // },
  ];

  function settingsDropdown() {
    if (!session) {
      return false;
    }

    if (status === "authenticated") {
      return (
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              _hover={{ cursor: "pointer" }}
              rightIcon={<FontAwesomeIcon icon={faCaretDown} size="sm" />}
              my="0.1rem"
              background="none"
              color={colorMode === "light" ? "black" : "gray.200"}
              minW="1rem"
            >
              <FontAwesomeIcon icon={faUserAstronaut} size="md" mx="0" />
            </MenuButton>
            <MenuList>
              <Text py="5px" textAlign="center" overflowWrap="break-word">
                Signed in as {username}
              </Text>
              <MenuDivider />
              <NextLink href={`/profile/${username}`} passHref>
                <MenuItem as="a">Profile</MenuItem>
              </NextLink>
              <NextLink href={`/settings/profile`} passHref>
                <MenuItem as="a">Settings</MenuItem>
              </NextLink>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                <NextLink href="/api/auth/signout">Sign Out</NextLink>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      );
    }
  }

  function signInButton() {
    if (session) {
      return false;
    }

    return (
      <Box>
        <Button
          my="1px"
          minW="8rem"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            signIn("google", { callbackUrl: "https://dynarank.io" });
          }}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  const themeToggleButton = () => {
    return (
      <Box _hover={{ cursor: "pointer" }}>
        <FontAwesomeIcon
          aria-label="Toggle theme"
          fontSize="20px"
          icon={colorMode === "dark" ? faMoon : faSun}
          onClick={handleToggleTheme}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Box p="0.5rem" shadow="md" pos="relative">
        <Box maxW="7xl" mx="auto" w="full">
          <Stack
            isInline
            spacing={4}
            align="center"
            justifyContent="space-between"
            w="full"
          >
            <Box>
              <Stack isInline spacing={4} align="center" fontWeight="semibold">
                {allUserLinks.map((link) => {
                  return (
                    <Box key={link.id}>
                      <NextLink href={link.href} passHref>
                        <a>{link.label}</a>
                      </NextLink>
                    </Box>
                  );
                })}
                {/* {session &&
                  authenticatedUserLinks.map((link) => {
                  return (
                      <Box key={link.id}>
                          <NextLink href={link.href}>
                              <Link>{link.label}</Link>
                          </NextLink>
                      </Box>
                  );
                })} */}
              </Stack>
            </Box>
            <Box>
              <Stack isInline spacing={4} align="center">
                {themeToggleButton()}
                {settingsDropdown()}
                {signInButton()}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
