<project_details>

<description>
These rules apply specifically to this repository and should be used for all code within this project scope.
</description>

<content_rules>
- All text must be in British English
- Use ’ instead of ' as an apostrophe on any frontend words (words that display to the user). e.g. Let’s, not Let's, businesses’, not businesses'
</content_rules>

<technical_requirements>
- Next.js 14 with App Router
- Tailwind CSS for styling
- Node.js v22.11.0 required
- Automatic deployment via GitHub Actions on push to main branch
- Static site deployment to GitHub Pages:
  - Builds to `/out` directory
  - Deploys to `gh-pages` branch
  - Custom domain: embeddings.au
  - No server-side functionality available
  - All API endpoints must be external services
- Image Handling:
  - Featured image must be in public/images/ for direct URL mapping
  - All other images must be in src/images/ for optimization
  - Featured image configuration in src/lib/images.ts
  - Image paths must use forward slashes (/)
- Component Architecture:
  - Use Server Components by default (no 'use client' directive)
  - Only use Client Components when needed for:
    - React hooks (useState, useEffect, etc.)
    - Browser APIs
    - Interactive features
    - Event listeners
  - Split interactive components into separate files
  - Mark Client Components with 'use client' directive
</technical_requirements>

<key_templates>
src/
├── components/
│   ├── RootLayout.jsx: Main navigation and site structure
│   │   └── Navigation(): Main nav items
│   │   └── Header(): Contact button and mobile menu
│   ├── Footer.jsx: Footer structure and links
│   │   └── navigation[]: Footer sections and links
│   ├── Logo.jsx: Site logo and hover states
│   │   └── socialMediaProfiles[]: Social platform links
│   └── Offices.jsx: Office location information
├── lib/
│   └── images.ts: Featured image configuration for social sharing/meta tags
├── app/
│   ├── page.jsx: Homepage content and hero section
│   ├── about/
│   │   └── page.jsx: About page content and team info
│   ├── process/
│   │   └── page.jsx: Process page methodology
│   └── contact/
│       ├── page.jsx: Contact page layout and static content
│       ├── ContactForm.jsx: Interactive contact form (Client Component)
│       └── ContactDetails.jsx: Office locations and contact info
└── images/
    ├── clients/: Client logos and case studies
    └── team/: Team member photos

<disabled_pages>
src/app/_disabled_pages/
├── work/: Case studies and portfolio (currently disabled)
└── blog/: Blog posts and articles (currently disabled)
</disabled_pages>

</key_templates>

</project_details>