import { extendTheme } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

const styles = {
  global: (props) => ({
    h1: {
      fontSize: "24px",
      fontWeight: "600",
      mt: "1.5rem",
    },
    h2: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "2",
      mt: "5px",
    },
    h3: {
      fontSize: "18px",
      fontWeight: "400",
      lineHeight: "2",
      mt: "5px",
    },
    h4: {
      fontSize: "18px",
      fontWeight: "400",
      lineHeight: "1.5",
      mt: "5px",
    },
    p: {
      my: "auto",
    },
    ul: {
      pl: "2rem",
      li: {
        pl: "1rem",
      },
    },
    body: {
      color: mode("#141214", "whiteAlpha.900")(props),
      bg: mode("whiteAlpha.800", "#001")(props),
    },
  }),
}

const breakpoints = {
  sm: "32em",
  md: "48em",
  lg: "64em",
  xl: "80em",
}

const theme = extendTheme({
  colors: {
    primary: "#150050",
    secondary: "#3F0071",
    highlight: "#610094",
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  breakpoints,
  styles,
  icons: {
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: "0 0 3000 3163",
    },
  },
  components: {
    Drawer: {
      baseStyle: (props) => ({
        dialog: {
          bg: mode("white", "#141214")(props),
        },
      }),
    },
    Button: {
      variants: {
        "primary-shadow": {
          boxShadow: "0 0 1px 1px #efdfde",
          bg: "black",
          color: "white",
          my: "1rem",
          px: "1rem",
          py: "0.5rem",
          minW: "9rem",
          borderRadius: "2px",
        },
      },
      defaultProps: {
        colorScheme: "primary",
        variant: "primary-shadow",
      },
      baseStyle: {
        _hover: {
          bgGradient: "linear(to-r, #BA1282, #FB0C3A, #FAB800)",
          color: "white",
          transform: "scale(1.05)",
        },
      },
    },
    Text: {
      baseStyle: {
        whiteSpace: "pre-wrap",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
      },
    },
  },
  // , components: {
  //   Heading: {
  //     variants" }
  //     baseStyle: {

  //     }
  //   }
  // }
})

export default theme
