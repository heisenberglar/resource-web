import { useState } from "react"
import {
  Heading,
  Text,
  Box,
  Flex,
  Button,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react"

import { NextSeo, ArticleJsonLd } from "next-seo"
import qs from "qs"
import NextLink from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserAstronaut, faPlus } from "@fortawesome/free-solid-svg-icons"
import BreadCrumb from "src/components/ui/breadcrumb"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import LoadingPage from "src/components/ui/loadingPage"
import ArticleLayout from "src/components/layouts/articleLayout"
dayjs.extend(relativeTime)

const nextUrl = process.env.NEXT_PUBLIC_URL

function ArticlePage(props) {
  const router = useRouter()

  const [isDesktop] = useMediaQuery("(min-width: 800px)")

  const { articleJson, categorySlug, resourceInstances } = props

  if (!articleJson || router.isFallback) return <LoadingPage />

  const article = articleJson?.data[0]?.attributes
  const articleUrl = `${nextUrl}/${categorySlug}/${article.slug}`

  const writer = article.writer?.data?.attributes.username
  const lastUpdated = article.updatedAt || article.createdAt
  const timeSinceUpdate = dayjs(lastUpdated).fromNow(true)

  return (
    <ArticleLayout title={article.title}>
      <article>
        <NextSeo
          title={article.title}
          description={article.intro?.slice(0, 160)}
          canonical={articleUrl}
          openGraph={{
            title: article.title,
            description: article.intro?.slice(0, 160),
            url: articleUrl,
            type: "article",
            article: {
              publishedTime: article.createdAt,
              modifiedTime: article.updatedAt,
              authors: [writer],
              tags: [article.tags],
            },
          }}
        />
        <ArticleJsonLd
          url={articleUrl}
          title={article.title}
          datePublished={article.publishedAt}
          dateModified={article.updatedAt}
          authorName={writer}
          publisherName="dynarank"
          publisherLogo="favicon.ico"
          description={article.intro?.slice(0, 160)}
        />
        <Box mx="0.75rem">
          <BreadCrumb router={router} />
          <Box my="1.5rem">
            <Heading as="h1" size="xl">
              {article.title}
            </Heading>
            <Box
              display="flex"
              flexFlow="row"
              flexWrap="wrap"
              mt="2"
              gap="0.35rem"
              lineHeight="1.2"
              alignItems="center"
            >
              {writer && (
                <NextLink href={`/profile/${writer}`} passHref>
                  <Box
                    as="a"
                    display="flex"
                    flexFlow="row"
                    gap="0.25rem"
                    _hover={{ cursor: "pointer" }}
                  >
                    <Box minW="1rem" my="auto">
                      <FontAwesomeIcon icon={faUserAstronaut} />
                    </Box>
                    <Text>{writer}</Text>
                  </Box>
                </NextLink>
              )}
              <Text fontSize="sm">[{timeSinceUpdate} ago]</Text>
            </Box>
          </Box>
          <Text>{article.intro}</Text>
        </Box>
        <Box my="2.5rem">
          <Box textAlign="center" my="1rem">
            {resourceInstances.length ? (
              <Heading as="h2" size="lg" lineHeight="1.3">
                Most popular
              </Heading>
            ) : (
              <Heading as="h2" size="lg" lineHeight="1.3">
                No resources found
              </Heading>
            )}
          </Box>
          <Box>{/* Ranking here */}</Box>
          <Flex justifyContent="center">
            <Button
              style={
                resourceInstances.length > 0
                  ? {
                      position: "fixed",
                      bottom: "20px",
                      right: isDesktop ? "15%" : "15px",
                      marginBottom: "0",
                      minWidth: "2rem",
                      borderRadius: "0.5rem",
                    }
                  : {
                      mx: "auto",
                    }
              }
            >
              <NextLink
                href={`/${categorySlug}/${article.slug}/submit-resource`}
                passHref
              >
                <Text as="a" p="0">
                  {resourceInstances.length === 0 ? (
                    "Add a new resource"
                  ) : (
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                  )}
                </Text>
              </NextLink>
            </Button>
          </Flex>
        </Box>
      </article>
    </ArticleLayout>
  )
}

export async function getStaticProps(context) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  if (!(context.params.category && context.params.slug))
    return { props: {}, notFound: true }

  const articleQuery = qs.stringify(
    {
      filters: {
        slug: context.params.slug,
        category: {
          slug: context.params.category,
        },
      },
      populate: {
        writer: {
          fields: ["id", "username"],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const article = await fetch(`${API_URL}/api/articles?${articleQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const articleJson = await article.json()

  if (!articleJson?.data?.length) return { props: {}, notFound: true }

  const resourceInstancesQuery = qs.stringify(
    {
      filters: {
        article: articleJson?.data[0]?.id,
      },
      populate: {
        resource: "*",
        user: {
          fields: ["id", "username"],
        },
      },
      sort: ["trueRating:desc"],
      pagination: {
        page: 1,
        pageSize: 20,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  const fetchedResourceInstances = await fetch(
    API_URL + `/api/resource-instances?` + resourceInstancesQuery,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const resourceInstancesJson = await fetchedResourceInstances.json()

  const topReviewQuery = (instanceId) =>
    qs.stringify(
      {
        filters: {
          resource_instance: instanceId,
        },
        fields: ["rating", "updatedAt", "votes"],
        populate: {
          comment: "*",
          reviewer: {
            fields: ["id", "username"],
          },
        },
        sort: ["votes:desc"],
        pagination: {
          page: 1,
          pageSize: 3,
        },
      },
      {
        encodeValuesOnly: true,
      }
    )

  const resourceInstancesWithReview = await Promise.all(
    resourceInstancesJson?.data?.map(async (instance) => {
      const topReview = await fetch(
        API_URL + `/api/reviews?${topReviewQuery(instance.id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      instance.attributes.review = await topReview?.json()
      return instance
    })
  )

  return {
    props: {
      articleJson,
      categorySlug: context.params.category,
      resourceInstances: resourceInstancesWithReview || [],
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchedArticles = await fetch(
    API_URL + "/api/articles?fields[0]=slug&populate[category][fields][0]=slug",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  const articles = await fetchedArticles?.json()

  const paths = await articles?.data?.map((article) => ({
    params: {
      category: article.attributes?.category?.data?.attributes?.slug,
      slug: article.attributes?.slug,
    },
  }))

  return { paths, fallback: true }
}

export default ArticlePage
