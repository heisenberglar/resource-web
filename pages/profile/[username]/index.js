import NextLink from "next/link"
import Layout from "src/components/layouts/layout"
import {
  Flex,
  Box,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Link,
  Button,
} from "@chakra-ui/react"
import qs from "qs"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import ReviewCard from "src/components/sections/review-card"
import { faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
dayjs.extend(relativeTime)

export default function Profile({ user, articles, reviews }) {
  const timeSinceJoined = dayjs(user.createdAt).fromNow(true)

  const formatUrl = (url) => url?.replace(/^https?:\/\//, "")

  return (
    <Flex flexWrap="wrap" maxW="1200px" mx="auto">
      <Flex
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        justifyContent="flex-start"
        mx="auto"
        w="350px"
        mt="5%"
        p="2rem"
      >
        <Box my="1rem">
          <Text fontSize="lg" fontWeight="600">
            {user.username}
          </Text>
          <Text as="time" dateTime={user.createdAt}>
            Joined {timeSinceJoined} ago
          </Text>
          {user.about && (
            <Text textAlign="start" my="1rem">
              {user.about}
            </Text>
          )}
        </Box>
        <Flex mt="1rem" flexWrap="wrap" gap="1rem">
          {user.socials?.linkedin && (
            <Link
              href={`//${formatUrl(user.socials.linkedin)}`}
              isExternal
              mx="auto"
              style={{ textDecoration: "none" }}
            >
              <Button gap="8px" variant="ghost" fontWeight="500">
                <FontAwesomeIcon icon={faLinkedin} size="sm" />
                <Text>LinkedIn</Text>
              </Button>
            </Link>
          )}
          {user.socials?.youtube && (
            <Link
              href={`//${formatUrl(user.socials.youtube)}`}
              isExternal
              mx="auto"
              style={{ textDecoration: "none" }}
            >
              <Button gap="8px" variant="ghost" fontWeight="500">
                <FontAwesomeIcon icon={faYoutube} size="sm" />
                <Text>YouTube</Text>
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
      <Layout title={user.username}>
        <Tabs>
          <TabList>
            <Tab>Articles</Tab>
            <Tab>Reviews</Tab>
          </TabList>
          <TabPanels>
            <TabPanel mt="1rem">
              <Flex flexFlow="wrap">
                {articles.length === 0 ? (
                  <Text>No articles posted yet</Text>
                ) : (
                  articles.map((article) => {
                    const lastUpdated =
                      article?.attributes?.updatedAt ||
                      article?.attributes?.createdAt
                    const timeSinceUpdate = dayjs(lastUpdated).fromNow(true)

                    return (
                      <LinkBox as="article" key={article?.id} w="100%">
                        <Box>
                          <Box
                            display="flex"
                            flexFlow="row"
                            alignItems="center"
                            gap="0.1rem"
                            flexWrap="wrap"
                          >
                            <Text
                              fontSize="xs"
                              color="gray.600"
                              as="time"
                              dateTime={article?.attributes?.updatedAt}
                            >
                              [{timeSinceUpdate} ago]
                            </Text>
                          </Box>
                          <Heading
                            as="h2"
                            fontWeight="500"
                            fontSize="md"
                            mt="0.25rem"
                          >
                            <NextLink
                              href={`/${article?.attributes?.category?.data?.attributes?.slug}/${article?.attributes?.slug}`}
                              passHref
                            >
                              <LinkOverlay fontWeight="600">
                                {article?.attributes?.title}
                              </LinkOverlay>
                            </NextLink>
                          </Heading>
                        </Box>
                        {article && (
                          <Box mt="0.5rem" fontSize="sm" borderRadius="2px">
                            {article?.attributes?.intro.slice(0, 350) + "..."}
                          </Box>
                        )}
                        <Divider my="1rem" />
                      </LinkBox>
                    )
                  })
                )}
              </Flex>
            </TabPanel>
            <TabPanel mt="1rem">
              {reviews.length === 0 ? (
                <Text>No reviews posted yet</Text>
              ) : (
                reviews?.map((review, index) => {
                  return (
                    <Box key={index} mb="3rem">
                      <Heading as="h3" fontSize="lg" lineHeight="1">
                        {
                          review.attributes.resource_instance?.data?.attributes
                            .resource?.data?.attributes.title
                        }{" "}
                        in{" "}
                        {
                          review.attributes.resource_instance?.data?.attributes
                            .article?.data?.attributes.title
                        }
                      </Heading>
                      <ReviewCard review={review} key={index} />
                    </Box>
                  )
                })
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layout>
    </Flex>
  )
}

export async function getServerSideProps(context) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const reviewsQuery = qs.stringify(
    {
      filters: {
        username: context.params.username,
      },
      fields: ["id", "username", "createdAt", "about"],
      populate: {
        socials: {
          fields: ["linkedin", "youtube", "other"],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const user = await fetch(API_URL + `/api/users?${reviewsQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const userJson = await user.json()

  if (!userJson?.length) return { props: {}, notFound: true }

  const userArticlesQuery = qs.stringify(
    {
      filters: {
        writer: userJson[0].id,
      },
      fields: ["createdAt", "updatedAt", "intro", "title", "slug"],
      populate: {
        category: {
          fields: ["id", "slug"],
        },
      },
      sort: ["updatedAt:desc", "createdAt:desc"],
      pagination: {
        page: 1,
        pageSize: 20,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const userArticles = await fetch(
    API_URL + `/api/articles?${userArticlesQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  const userArticlesJson = await userArticles.json()

  const userReviewsQuery = qs.stringify(
    {
      filters: {
        reviewer: userJson[0].id,
      },
      sort: ["updatedAt:desc", "createdAt:desc"],
      populate: {
        comment: "*",
        resource_instance: {
          populate: {
            article: {
              fields: ["title"],
            },
            resource: {
              fields: ["title"],
            },
          },
        },
      },
      pagination: {
        page: 1,
        pageSize: 20,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const userReviews = await fetch(
    API_URL + `/api/reviews?${userReviewsQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  const userReviewsJson = await userReviews.json()

  return {
    props: {
      user: userJson[0],
      articles: userArticlesJson?.data,
      reviews: userReviewsJson?.data,
    },
  }
}
