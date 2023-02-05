import { ChakraProvider } from "@chakra-ui/react"
import theme from "/theme"
import NavBar from "src/components/layouts/navbar"
import Footer from "src/components/layouts/footer"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import Head from "next/head"
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent"
import { useEffect } from "react"
config.autoAddCss = false
import * as gtag from "../src/lib/gtag"
import { useRouter } from "next/router"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter()

  useEffect(() => {
    if (getCookieConsentValue() === true) {
      console.log("trued")
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      })
    }
  }, [])

  useEffect(() => {
    if (getCookieConsentValue() === true) {
      const handleRouteChange = (url) => {
        gtag.pageview(url)
      }
      router.events.on("routeChangeComplete", handleRouteChange)
      router.events.on("hashChangeComplete", handleRouteChange)
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange)
        router.events.off("hashChangeComplete", handleRouteChange)
      }
    }
  }, [router.events])

  function handleAccept() {
    window.gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    })
  }

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ChakraProvider resetCSS theme={theme}>
        <Head>
          <title>dynarank</title>
        </Head>
        <NavBar />
        <Component {...pageProps} />
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          onAccept={() => {
            handleAccept()
          }}
          enableDeclineButton
          declineButtonText="Decline"
          style={{
            background: "#001",
            borderTop: "1px solid #fff",
          }}
          buttonStyle={{
            color: "#001",
            borderRadius: "4px",
            padding: "8px 16px",
            backgroundColor: "FA661B",
            margin: "15px 10px",
          }}
          declineButtonStyle={{
            color: "#fff",
            borderRadius: "4px",
            padding: "8px 16px",
            backgroundColor: "#FA2631",
            margin: "15px 10px",
          }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.{" "}
          <a href="https://dynarank.io/policies/cookie-policy">Read more.</a>
        </CookieConsent>
        <Footer />
      </ChakraProvider>
    </SessionProvider>
  )
}
