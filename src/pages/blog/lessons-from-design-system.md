---
layout: "../../layouts/BlogPost.astro"
title: "Lessons learned from building a table component in a design system"
description: ""
pubDate: "Dec 10 2024"
heroImage: "/images/blog/lessons-from-design-system/hero.jpg"
---

## Lessons Learned from Building a Table Component in a Design System

Building a table component for a design system might sound straightforward, but as I discovered, it can quickly become a Pandora's box of complexity. Here are the key lessons I learned during the process:

1. **Provide the Bare Minimum**

When I initially built the table component, I kept getting feature requests from various teams: "Can it do this?" "What about that?" I obliged, adding feature after feature, until the component became massive and unwieldy. What I learned: start small. Provide only the essential functionality and only add features after serious consideration. This avoids bloat and keeps your component maintainable.

2. **Expose Functionality Headless**

Despite designing the table with a specific approach in mind, users always found ways to implement it differently. I should have exposed functionality in a headless way—separating the behavior from the presentation—to allow users to integrate their custom designs and workflows without being tied to my visual or structural choices. This approach, such as using Vue slot props and mixins, would have empowered teams to innovate while still leveraging the core capabilities of the component.

3. **Don’t Be Afraid to Compose Small Components**

It’s tempting to create one "do-it-all" table component, but this approach can quickly spiral out of control. I should have broken the table into smaller, composable components: headers, rows, cells, pagination controls, and so on. These smaller pieces are easier to understand, test, and maintain, and they can be recombined to suit different use cases.

4. **State Assumptions and Best Practices**

One of the biggest challenges I faced was addressing misuse of the table component. Here are a few examples:

- Client-side filter/sort: Users were often unaware of how their data was being fetched—whether client-side or server-side—so they didn’t understand how filtering or sorting would function effectively. Documenting this assumption early on would have saved a lot of back-and-forth.

- Complex cell content: Some users embedded multiple form elements into a single table cell. This made the table difficult to navigate for keyboard users and created accessibility issues. Clear guidelines on appropriate cell content would have helped prevent this.

- Misaligned rows and headings: Some users conditionally added new rows that didn’t align with the table headings, making the table unusable for screen reader users. Emphasizing the importance of consistent structure in the documentation could have avoided these pitfalls.

By clearly stating assumptions, limitations, and best practices upfront, you can guide users toward effective implementations and reduce misuse.

### Final Thoughts

Building a table component taught me that simplicity, flexibility, and clear communication are crucial. By starting with a minimal feature set, exposing headless functionality, leveraging composable components, and documenting assumptions and best practices, you can create a table component that is both powerful and user-friendly—without becoming a burden to maintain.