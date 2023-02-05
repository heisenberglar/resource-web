module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || "https://dynarank.io",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ["/profile", "/submit-article"],
  // ...other options
};
