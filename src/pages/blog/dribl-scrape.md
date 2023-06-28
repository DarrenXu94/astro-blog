---
layout: "../../layouts/BlogPost.astro"
title: "Scraping and deploying a website with Astro and Github actions"
description: "Steps I followed and lessons learnt during a process of making a static site with Astro and Github actions"
pubDate: "Dec 28 2022"
heroImage: "/images/blog/dribl-scrape/hero.png"
---

### What am I making

Some of my friends play in a futsal competition which uses a generic sports CMS to display results, scores and fixtures as well as player statistics and match data. This website has a horrible user experience for mobile as the tables weren't responsive. As well as that, you had to select the competition every single time as there was no URL for a pre selected competition. I wanted to create a simple, fast mobile site that could show the current table, recent results and upcoming fixtures. 

### Front end technology
I decided to use Astro as the front end technology as I wanted to try the tech out on a full project. Originally I wanted to use the hydration features but there were some issues with this I will explain later.

### Getting the data
To get the data I need from the website I expected to use Playwright to manually visit the URL, change to the correct tab by selecting an item from a dropdown menu and scrape the resulting table. However, surprisingly after I selected the competition the whole data object for the table was logged in the console. I used Playwright's built in console event listener to collect this data and populate the relevant tables. 

### Combining the data
Originally I implemented the Astro app with static data but on the deployed site I want the website to do an API call to run a scrape that fetches the latest data. There were a few problems with this. 
- Playwright (and even Puppeteer) had limitations on where you could deploy your function app due to the size. 
- Netlify function apps didn't cache the Chromium executable as well so the binaries didn't work.
- Using a workaround I managed to get Chromium to at least run with netlify-plugin-playwright-cache. However there was a timeout problem as the scrape had a few timeouts and waits for the dribl website to load, and for some reason it would always take longer than 30 seconds which was the limit

To solve this problem I decided to just run the scrape on the Astro build time which would mean the data would not be fetched fresh on each page visit, but only on every deploy. I figured this was good enough as the matches only happen once a week so for most of the time the tables will be up to date. 

I had to use this code in the Github actions yml file to save the result of the scrape into a env variable as the JSON response caused issues with the bash output.

```yml
echo 'JSON_RESPONSE<<EOF' >> $GITHUB_ENV
echo $OUTPUT >> $GITHUB_ENV
echo 'EOF' >> $GITHUB_ENV
```