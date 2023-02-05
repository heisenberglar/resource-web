import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR, { useSWRConfig } from "swr";
import { Text, Stack, Button, useToast, Box } from "@chakra-ui/react";
import fetcher, { fetcherWithToken } from "src/components/__utils/fetcher";
import qs from "qs";
import { CollectionPageJsonLd } from "next-seo";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReviewVote({ review }) {
  const { data: session, status } = useSession();
  const { mutate } = useSWRConfig();
  const [vote, setVote] = useState(0);
  const toast = useToast();
  const hasSession = session && status !== "loading";

  const userUpvoteQuery = qs.stringify(
    {
      filters: {
        review: review?.id,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const userUpvotesAPI = `${API_URL}/api/review-votes/me?${userUpvoteQuery}`;
  const { data: userUpvotes, userLoading } = useSWR(
    hasSession ? [userUpvotesAPI, session?.jwt] : null,
    fetcherWithToken
  );
  const hasUserUpvote = Boolean(userUpvotes?.length);

  const totalUpvotesAPI = `${API_URL}/api/review-votes/count?filters[review]=${review.id}&filters[vote]=1`;
  const { data: totalUpvotes, totalLoading } = useSWR(totalUpvotesAPI, fetcher);

  useEffect(() => {
    if (hasUserUpvote) {
      setVote(userUpvotes[0]?.vote);
    }
  }, [userUpvotes, hasUserUpvote]);

  async function upVote() {
    const res = await fetch(`${API_URL}/api/review-votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
      body: JSON.stringify({
        data: {
          vote: 1,
          review: review?.id,
          voter: session?.user?.id,
        },
      }),
    });
    await res.json();
  }

  async function changeVote(vote) {
    const res = await fetch(
      `${API_URL}/api/review-votes/${userUpvotes[0]?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.jwt}`,
        },
        body: JSON.stringify({
          data: {
            vote: vote ? 1 : 0,
          },
        }),
      }
    );
    await res.json();
  }

  if (totalLoading || userLoading) return <div>Loading..</div>;

  return (
    <Stack direction="row" align="center" gap={1} wrap="wrap">
      <Button
        isDisabled={userLoading || status === "loading"}
        onClick={async () => {
          if (!session) {
            return toast({
              title: "You need to be logged in to do this",
              status: "error",
              isClosable: true,
              position: "bottom-right",
            });
          }

          hasUserUpvote ? await changeVote(!vote) : await upVote();
          setVote(!vote);
          mutate(userUpvotesAPI);
          mutate(totalUpvotesAPI);
        }}
        textColor="white"
        backgroundColor={vote ? undefined : "gray.500"}
        mt="0.25rem"
      >
        Helpful
      </Button>
      <Box pb="0.5rem">
        {totalUpvotes > 0 ? (
          totalUpvotes > 1 ? (
            <Text>At least {totalUpvotes} lifeforms agree</Text>
          ) : (
            <Text>At least {totalUpvotes} lifeform agrees</Text>
          )
        ) : null}
      </Box>
    </Stack>
  );
}
