import Layout from "src/components/layouts/layout";
import ResourceForm from "src/components/sections/resource-form";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ResourceSearchBar from "src/components/ui/resource-search-bar";
import { Box, Text, Heading, Center } from "@chakra-ui/react";
import BreadCrumb from "src/components/ui/breadcrumb";
import { useRouter } from "next/router";
import LoginPrompt from "src/components/ui/loginPrompt";

export default function AddResource({ article, categories }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showResourceForm, setShowResourceForm] = useState(false);

  if (!session || status === "loading") {
    return (
      <Layout title={"Link a new resource"}>
        <LoginPrompt />
      </Layout>
    );
  }

  return (
    <Layout title={"Link a new resource"}>
      <BreadCrumb router={router} />
      {article ? (
        <Box>
          {!showResourceForm && (
            <Box my={10}>
              <Heading as="h2" fontSize="2xl" align="center">
                Search our repositories
              </Heading>
              <ResourceSearchBar article={article} />
              <Center>
                <Text pr="1">Resource not found? </Text>
                <Text
                  as="u"
                  onClick={() => {
                    setShowResourceForm(!showResourceForm);
                  }}
                  _hover={{ cursor: "pointer" }}
                >
                  Add it!
                </Text>
              </Center>
            </Box>
          )}
          {showResourceForm && (
            <ResourceForm article={article} categories={categories} />
          )}
          {showResourceForm && (
            <Center
              alignItems="center"
              as="u"
              onClick={() => {
                setShowResourceForm(!showResourceForm);
              }}
              _hover={{
                cursor: "pointer",
              }}
            >
              Use resource finder
            </Center>
          )}
        </Box>
      ) : (
        <Text align="center" my={45}>
          Please show your authorization. Sign in to proceed.
        </Text>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const rawCategoriesData = await fetch(API_URL + "/api/categories/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const categoriesJson = await rawCategoriesData.json();

  const rawArticle = await fetch(
    API_URL +
      `/api/articles?filters[slug]=${context.query.slug}&populate[category][fields]=id`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const article = await rawArticle.json();

  return {
    props: {
      article: article.data[0],
      categories: categoriesJson?.data,
    },
  };
}
