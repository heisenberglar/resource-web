import Layout from "src/components/layouts/layout";
import ReviewVote from "src/components/ui/review-vote";
import ReviewCard from "src/components/sections/review-card";
import { Box, Heading } from "@chakra-ui/react";
import BreadCrumb from "src/components/ui/breadcrumb";
import { useRouter } from "next/router";
import qs from "qs";

export default function ResourceReviews({ reviews, resourceTitle }) {
  const router = useRouter();

  return (
    <Layout title={resourceTitle}>
      <BreadCrumb router={router} />
      <Heading as="h1">{resourceTitle}</Heading>
      {reviews?.map((review, index) => {
        return (
          <Box key={index}>
            <ReviewCard review={review} key={index} />
            <ReviewVote review={review} />
          </Box>
        );
      })}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  //REFACTOR TO GETSTATICPROPS
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const reviewsQuery = qs.stringify(
    {
      filters: {
        resource_instance: {
          resource: {
            slug: context.query.resource,
          },
        },
      },
      fields: ["rating", "updatedAt", "votes"],
      populate: {
        comment: "*",
        reviewer: {
          fields: ["id", "username"],
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
  );

  const fetchedReviews = await fetch(API_URL + `/api/reviews?${reviewsQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const reviews = await fetchedReviews.json();

  const rawResource = await fetch(
    API_URL + `/api/resources?filters[slug]=${context.query.resource}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resource = await rawResource.json();
  const resourceTitle = await resource?.data[0]?.attributes?.title;

  return {
    props: {
      reviews: reviews?.data,
      resourceTitle,
    },
  };
}
