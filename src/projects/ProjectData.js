// ProjectData.js
// Route slugs: /projects/:project
export const projectOrder = ["dial-in", "UTD-NSBE",   "portfolio-site",
  "algo-visualizer",];

export const projectMeta = {
  "dial-in": {
    displayName: "Dial In",
    title: "Creator & Developer",
    dates: "March 2025–present",
    team: "Solo",
    blurb:
      "Cryptic number-decoding game with hundreds of weekly players and ~80% retention.",
    overview:
      "Built a fast, lightweight word/number puzzle where players decode numeric ciphers into phrases. "
      + "Shipped tactile interactions, daily/weekly cadence, and difficulty curves that keep casual players engaged. "
      + "Implemented a monthly content pipeline powered by a Python agent using the OpenAI API with guardrails and validation. "
      + "Added basic analytics to balance difficulty and track cohorts.",
    skills: [
      "Flask",
      "JavaScript",
      "HTML/CSS",
      "Python",
      "OpenAI API",
      "Content Pipeline",
      "UI/UX Design",
      "User Retention",
      "Analytics",
      "Deployment",
    ],
    links: {
      live: "https://dialin.fun",
      repo: "https://github.com/dlethab/dial-in",
    },
  },

  "UTD-NSBE": {
    displayName: "UTD NSBE Website",
    title: "Designer & Developer",
    dates: "2023–present",
    location: "Dallas, TX",
    team: "Chapter Tech",
    blurb:
      "Chapter site & UI system enabling 100+ members to stay informed and engaged.",
    overview:
      "Designed and implemented a clean Bootstrap-based UI for chapter announcements, events, and resources. "
      + "Streamlined navigation and content structure to reduce friction to get involved. "
      + "Added simple admin workflows so officers can update pages without code. "
      + "Emphasis on accessibility, mobile-first layouts, and fast load.",
    skills: [
      "Node.js",
      "JavaScript",
      "Bootstrap",
      "HTML/CSS",
      "Content Modeling",
      "Deployment/Hosting",
    ],
    links: {
      live: "https://utdnsbe.vercel.app/",
      repo: "https://github.com/DemarcusI/Website", // optional
    },

    "portfolio-site": {
    title: "Personal Portfolio",
    dates: "2024 – Present",
    location: "Remote",
    overview:
      "Responsive personal site showcasing projects, writing, and contact. Focus on accessibility, performance budgets, and fluid typography.",
    skills: [
      "React", "React Router", "GSAP", "Embla Carousel",
      "Responsive Design", "Accessibility (a11y)", "Vite/CRA",
      "Netlify/Vercel", "SEO", "Analytics",
    ],
  },

  "algo-visualizer": {
    title: "Algorithm Visualizer",
    dates: "2023",
    location: "Remote",
    overview:
      "Interactive visualizations for classic algorithms (sorting, pathfinding). Emphasis on animation timing, step-by-step states, and user controls.",
    skills: [
      "React", "TypeScript", "Canvas/SVG", "D3 (light)",
      "State Machines", "Performance", "Testing",
    ],
  },
  },
};
