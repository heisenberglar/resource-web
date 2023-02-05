import Layout from "src/components/layouts/layout";
import { useSession } from "next-auth/react";
import LoginPrompt from "src/components/ui/loginPrompt";

export default function AddReview({ resource, articleId }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout title={"Review resource"}>
        <LoginPrompt />
      </Layout>
    );
  }

  return (
    <Layout>
      <p>Resource review is not yet available.</p>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const rawResource = await fetch(
    API_URL + `/api/resources?filters[slug]=${context.query.slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resource = await rawResource.json();

  let articleId = context.query.article;

  if (!articleId) {
    articleId = null;
  }

  return {
    props: {
      resource: resource.data[0],
      articleId: articleId,
    },
  };
}
