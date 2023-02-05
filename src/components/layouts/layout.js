import { Fragment } from "react";
import { Container, useColorMode } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import Script from "next/script";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Layout({ children, title }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Fragment>
      <Head>
        <title>{`${title} | dynarank`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <DefaultSeo
          config={{
            title: "dynarank",
            // hrefLang: 'en-US',
            description:
              "Get to your goals at warp speed with the best resources Earth has to offer.",
            openGraph: {
              type: "website",
              locale: "en_US",
              url: "https://dynarank.io/",
              site_name: "dynarank",
            },
            twitter: {
              cardType: "summary_large_image",
            },
          }}
        />
      </Head>
      <Container maxW="820px" minH="100vh" mx="auto" py="3rem">
        <main>{children}</main>
      </Container>
    </Fragment>
  );
}
