---
layout: "../../layouts/BlogPost.astro"
title: "Creating a Github profile readme with Astro blogs"
description: "How I created a Github readme populated from posts from my blog"
pubDate: "Aug 28 2022"
heroImage: "/astro.jpeg"
---

## Intro

In this blog post I will share how I created a fun Github readme feature that listed the most recent blog posts from my blog run with Astro.

### Setting up a Github readme

Github has a [feature](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) that allows you to create your own readme in markdown.

Basic steps to create: 
- You've created a repository with a name that matches your GitHub username.
- The repository is public.
- The repository contains a file named README.md in its root.
- The README.md file contains any content.

### Setting up the Astro blog

If you have an Astro site you can install the [Astro rss plugin](https://docs.astro.build/en/guides/rss/). Make sure you configure astro.config.mjs to point to your domain. The rss feed generated will have the url: your-domain/rss.xml. 

### Setting up the Github workflow

Follow the instructions from [this](https://github.com/gautamkrishnar/blog-post-workflow) repository to add a Github action into your repository. Replace the rss link with your-domain/rss.xml. 

By default the action runs every hour but I changed the cron pattern to 0 1 * * * to run every day once at 1am. 