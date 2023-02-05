import {
  Flex,
  Heading,
  Box,
  Button,
  useMediaQuery,
  keyframes,
  useColorMode,
} from "@chakra-ui/react"
import NextImage from "next/image"
import NextButton from "src/components/ui/next-button"
import { NextSeo } from "next-seo"
import { useRef, Fragment, useState } from "react"
import { useInView } from "react-intersection-observer"

export default function HomePage({ categories }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const myRef = useRef(null)
  const executeScroll = () => {
    myRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const textColor = colorMode === "light" ? "gray.100" : "#000011"

  const [isDesktop] = useMediaQuery("(min-width: 800px)")
  const seoDescription =
    "dynarank is the gateway to the best resources you can find to learn a topic."

  const slide = (direction, magnitude) => keyframes`
    from { transform: ${direction}(${magnitude}); }
    to { transform: ${direction}(0px); }
  `

  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: 0,
  })

  return (
    <Fragment>
      <NextSeo
        title="dynarank"
        description={seoDescription}
        openGraph={{
          title: "dynarank",
          description: seoDescription,
          images: [
            {
              url: "astro.webp",
              width: 500,
              height: 600,
              alt: "Astronaut in a portal",
            },
          ],
        }}
      />
      <Box
        minH="200vh"
        mx="auto"
        bgGradient={
          "radial-gradient(circle at 5% 95%, #ccc 0%, #1144aa 0%, #000011 28%)"
        }
      >
        <Box
          maxW={["100%", "99%"]}
          mx="auto"
          mt="5px"
          color="white"
          bgGradient={
            "radial-gradient(circle at 90% 85%, #ccc 0%, #1144aa 0%, #000011 28%)"
          }
          boxShadow="dark-lg"
        >
          <Flex
            flexFlow="row"
            flexWrap="wrap"
            maxW="1050px"
            minH="100vh"
            align="center"
            justify={isDesktop ? "start" : "center"}
            px="7vw"
            mx="auto"
            mb="20vh"
            position="relative"
          >
            <Box
              height="400px"
              zIndex="1"
              position="absolute"
              right="5%"
              my="auto"
              top="0"
              bottom="0"
              boxSize="md"
              w="40%"
              alignSelf="center"
            />
            <Flex
              flexFlow="column"
              flexWrap="wrap"
              maxW={["300px", "450px"]}
              mt="-3rem"
              textAlign={isDesktop ? "start" : "center"}
              align={isDesktop ? "start" : "center"}
            >
              <Heading
                as="h1"
                fontSize={["5xl", "7xl", "7xl"]}
                lineHeight="1.1"
                mt="0.5rem"
              >
                {"Get to that next level"}
              </Heading>
              <Heading
                fontSize={["5xl", "7xl", "7xl"]}
                lineHeight="1.1"
                animation={`${slide(
                  "translateX",
                  "-500px"
                )} 1 0.25s ease-in-out 0.5s`}
              >
                {"faster"}
              </Heading>
              <Heading
                as="h2"
                fontSize={["2xl", "2xl", "3xl"]}
                maxW="320px"
                mt="0.75rem"
                fontWeight="500"
                lineHeight="1.3"
              >
                {"Use the best resources to get there"}
              </Heading>
              <Button
                variant="primary-shadow"
                bgGradient="linear(to-r, #BA1282, #FB0C3A, #FAB800)"
                maxW="80%"
                mt="2.5rem"
                px="2.25rem"
                py="1.5rem"
                onClick={executeScroll}
                zIndex="5"
              >
                {"Explore"}
              </Button>
            </Flex>
            {isDesktop && (
              <Flex
                position="absolute"
                right="5%"
                my="auto"
                top="0"
                bottom="0"
                boxSize="md"
                w="40%"
                alignSelf="center"
              >
                <Box
                  transition="all 0.5s ease-in-out"
                  _hover={{
                    cursor: "pointer",
                    transform: "scale(1.05) rotateZ(-5deg)",
                  }}
                  onClick={executeScroll}
                >
                  <NextImage
                    src="/astro.webp"
                    alt="astronaut-in-rainbow-portal"
                    width={600}
                    height={600}
                    priority="true"
                  />
                </Box>
              </Flex>
            )}
          </Flex>
        </Box>
        <Box>
          <Box
            minH="120vh"
            maxW={["100%", "80%", "55%"]}
            mx="auto"
            px="0.75rem"
            ref={myRef}
          >
            <Heading
              as="h2"
              fontSize={["4xl", "5xl", "5xl"]}
              textAlign="center"
              py="1.5rem"
              bgGradient="linear(to-r, #BA1282, #FB0C3A, #FAB800)"
              bgClip="text"
            >
              Choose your portal
            </Heading>
            <Flex
              align="center"
              justify="center"
              flexWrap="wrap"
              ref={inViewRef}
            >
              {categories.map((category, i) => {
                return (
                  inView && (
                    <NextButton
                      key={category.id}
                      href={`/${category.attributes.slug}`}
                      animation={`${slide("translateY", "1000px")} 1 ${
                        0.25 + 0.5 * i
                      }s ease-in-out`}
                      m="0.75rem"
                      px="2.25rem"
                      py="1.5rem"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                        lineHeight: "1.05",
                        border: "1px solid white",
                      }}
                    >
                      {category.attributes.title}
                    </NextButton>
                  )
                )
              })}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}

export const getStaticProps = async ({ req }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const rawCategoriesData = await fetch(API_URL + "/api/categories/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })

  const categoriesJson = await rawCategoriesData.json()

  return {
    props: {
      categories: categoriesJson.data,
    },
  }
}
