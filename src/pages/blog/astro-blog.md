---
layout: "../../layouts/BlogPost.astro"
title: "Publishing my blog with Astro"
description: "Steps I took in publishing this blog with Astro."
pubDate: "Aug 22 2022"
heroImage: "/images/blog/astro-blog/hero.jpeg"
---

## Intro
In this blog post I will describe how I set up this blog to run off Github pages with Astro as well as how to configure a subdomain on blog.darrenxu.com with the Netlify DNS

## Background
I have a domain name with name.com but the DNS records are pointing to Netlify. This is so I can set up sites with custom domains in Netlify such as [my website](darrenxu.com).

## Steps
1. Create an astro project
2. Follow [this tutorial](https://docs.astro.build/en/guides/deploy/github/) to set your blog up with Github
3. Set up name.com DNS to point to Netlify. Follow [this guide](https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/) on how to set up your DNS records. I found a problem with name.com updating but there was a [support ticket](https://answers.netlify.com/t/support-guide-name-com-domain-reports-a-dns-zone-for-this-domain-already-exists-on-ns1-error/11461) raised about this which fixed it.
4. In Netlify Domain settings add a new DNS record. Choose CNAME record and point it to your github profile (darrenxu94.github.io)
5. In your Github repo add the custom domain in Settings -> Pages -> Custom domain
