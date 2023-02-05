import {
  Heading,
  Text,
  Flex,
  Box,
  LinkBox,
  LinkOverlay,
  useColorModeValue,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { CollectionPageJsonLd } from "next-seo";
import NextButton from "src/components/ui/next-button";
import { useRouter } from "next/router";
import BreadCrumb from "src/components/ui/breadcrumb";
import qs from "qs";
import LoadingPage from "src/components/ui/loadingPage";
import Layout from "src/components/layouts/layout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
dayjs.extend(relativeTime);

export default function CategoryPage({ articles, category }) {
  const router = useRouter();
  const hasArticles = Boolean(articles?.length);

  const primaryBackground = useColorModeValue("white", "gray.900");
  const secondaryBackground = useColorModeValue("blackAlpha.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const [isDesktop] = useMediaQuery("(min-width: 800px)");

  if (!articles || !category) return <LoadingPage />;
  return (
    <Layout title={category?.attributes?.title}>
      <BreadCrumb router={router} />
      <Heading as="h1" align="center" my="1rem">
        {category?.attributes?.title}
      </Heading>
      {hasArticles && (
        <Box>
          <CollectionPageJsonLd
            name={category?.attributes?.title}
            description={category?.attributes?.description}
            hasPart={articles?.map((article, index) => {
              if (index < 20) {
                return {
                  about: article?.attributes?.intro,
                  name: article?.attributes?.title,
                  datePublished: article?.attributes?.publishedAt,
                  keywords: article?.attributes?.tags
                    ? article?.attributes?.tags
                    : null,
                };
              } else return;
            })}
          />
          <Flex my="1rem" justifyContent="center" flexFlow="wrap">
            {articles.map((article) => {
              const lastUpdated =
                article?.attributes?.updatedAt ||
                article?.attributes?.createdAt;
              const timeSinceUpdate = dayjs(lastUpdated).fromNow(true);
              const writer =
                article?.attributes?.writer?.data?.attributes?.username;

              return (
                <LinkBox
                  as="article"
                  key={article?.id}
                  bg={primaryBackground}
                  w={["95%", "90%", "680px"]}
                  m="0.5rem"
                  borderWidth="1px"
                  rounded="sm"
                  boxShadow="base"
                >
                  <Box p="1rem 1rem 0.25rem 1rem">
                    <Box
                      display="flex"
                      flexFlow="row"
                      alignItems="center"
                      gap="0.1rem"
                      flexWrap="wrap"
                    >
                      {writer && (
                        <NextLink href={`/profile/${writer}`} passHref>
                          <Text as="a" fontSize="xs" color="gray.600">
                            {writer}{" "}
                          </Text>
                        </NextLink>
                      )}
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
                        href={`/${category?.attributes?.slug}/${article?.attributes?.slug}`}
                        passHref
                      >
                        <LinkOverlay fontWeight="600">
                          {article?.attributes?.title}
                        </LinkOverlay>
                      </NextLink>
                    </Heading>
                  </Box>
                  {article && (
                    <Box
                      p="1rem"
                      mt="0.5rem"
                      fontSize="sm"
                      bg={secondaryBackground}
                      borderRadius="2px"
                    >
                      {article?.attributes?.intro.slice(0, 350) + "..."}
                    </Box>
                  )}
                </LinkBox>
              );
            })}
          </Flex>
        </Box>
      )}
      <Flex justifyContent="center">
        <Button
          style={
            articles.length > 0
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
          <NextLink href={`/submit-article`} passHref>
            <Text as="a" p="0">
              {articles.length === 0 ? (
                "Add a new article "
              ) : (
                <FontAwesomeIcon icon={faPlus} size="sm" />
              )}
            </Text>
          </NextLink>
        </Button>
      </Flex>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchedCategory = await fetch(
    API_URL + `/api/categories?filters[slug]=${context?.params?.category}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const categoryJson = await fetchedCategory?.json();

  if (!categoryJson?.data?.length) return { props: {}, notFound: true };

  const articlesQuery = qs.stringify(
    {
      filters: {
        category: {
          slug: context?.params?.category,
        },
      },
      populate: {
        writer: {
          fields: ["id", "username"],
        },
      },
      fields: ["createdAt", "updatedAt", "intro", "title", "slug"],
      sort: ["updatedAt:desc", "createdAt:desc"],
      pagination: {
        page: 1,
        pageSize: 20,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const fetchedArticles = await fetch(
    API_URL + `/api/articles?${articlesQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const articlesJson = await fetchedArticles?.json();

  return {
    props: { articles: articlesJson?.data, category: categoryJson?.data[0] },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchedCategories = await fetch(API_URL + "/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const categoriesJson = await fetchedCategories?.json();
  const categories = categoriesJson?.data;

  const paths = categories?.map((category) => ({
    params: { category: category?.attributes?.slug?.toString() },
  }));

  return { paths, fallback: true };
}
