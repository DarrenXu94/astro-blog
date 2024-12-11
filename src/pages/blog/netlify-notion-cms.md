---
layout: "../../layouts/BlogPost.astro"
title: "Creating a blog website using Notion as the CMS"
description: "Discover how you can deploy a blog on Netlify for free using Notion as the CMS"
pubDate: "Dec 24 2023"
---

Embarking on a web development project is always an adventure, and my recent escapade involved deploying an Astro site on Netlify while juggling Notion as the CMS. 

Why did I decide to do this? I wanted to use a CMS that was easily accessible to everyone, able to be edited on my phone and most importantly 100% free.

## 1. Notion Page for API Integration:

To set up Notion page to work with the API I had to create an [integration](https://www.notion.so/my-integrations). This will create an API key which I added to my local .env file and Netlify deployment variables. 

Next I made sure my Notion page had access to the integration with [page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions).

## 2. Netlify function to talk to API

To make requests to Notion I added the `@notionhq/client` package and created a file under `/netlify/functions`. I used the [Notion API endpoints](https://developers.notion.com/reference/retrieve-a-page) to find the endpoints I needed to use (in this case both pages and blocks).

## 3. Astro site

I explored different methods of rendering with Astro originally going with Server-Side Rendering (SSR). This required setting `output: "server"` in `astro.config.mjs` and adding the netlify adapter from `@astrojs/netlify/functions`. This worked originally and also meant changes from Notion were almost live. I thought it was a bit slow as it needed to make the requests on the first time of page load and the content in the pages don't change that much. 

I decided to change to a static site setting `output: "static"` and using getStaticPaths to generate the pages.

```js
export async function getStaticPaths() {
  const allPaths = await getData();

  return allPaths.data.response.results.map((review) => ({
    params: { slug: review.id },
  }));
}
```
## 4. Deploy

As the Notion pages were no longer fetched every time you visit the page I added in a deploy hook on Netlify. This hook could be triggered on a page on the website with a client side HTTP request.

## A few things that caught me out

- When deploying the site my site name didn't match in `astro.config.mjs`. To fix this I changed the config to pull from `process.env.URL` which is exposed from Netlify.
- Notion API pages only return list of child page's titles, and when running a query on the page block it doesn't give any page metadata such as title. So landing on a page actually means doing two requests, one for page and one for block. 
