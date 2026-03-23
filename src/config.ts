export const SITE = {
  website: "https://blog.yasser.solutions/",
  author: "Yasser Alattas",
  profile: "https://yasser.solutions/",
  desc: "MLOps, Cloud Infrastructure, and SRE insights from the trenches.",
  title: "Yasser Alattas | MLOps, Kubernetes & SRE Blog",
  ogImage: "og-blog.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit on GitHub",
    url: "https://github.com/yalattas/cf-yasser-blog/edit/main/src/data/blog/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Riyadh",
} as const;
