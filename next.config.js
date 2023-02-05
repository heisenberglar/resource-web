module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
  // webpack: (config, options) => {
  //   config.module.rules.push( {
  //     test: /\.md$/,
  //     use: [
  //       {
  //         loader: "html-loader",
  //       },
  //       {
  //         loader: "markdown-loader",
  //         options: {
  //           // Pass options to marked
  //           // See https://marked.js.org/using_advanced#options
  //         },
  //       },
  //     ],
  //   })
  //   return config
  // },
};

// module.exports = ({
//   assetPrefix: '/'
// })
