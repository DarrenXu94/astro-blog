---
layout: "../../layouts/BlogPost.astro"
title: "Using Notion to import bookmarks"
description: "Using the Notion API to create a page of bookmarks."
pubDate: "Sep 1 2021"
heroImage: "/placeholder-hero.jpg"
---

Recently I decided to create a developer profile on Chrome so I could clean up my bookmarks and split up what browser I used for each activity. This was not effective. I still ended up using my main profile to browser tech related things and found switching between the two too tedious. I was going to add all my tech bookmarks back, but I decided to store them in Notion instead as a better reference as I don't use them all the time.

### Export

First I exported my bookmarks from Chrome.

### Create Notion credentials

Follow [this page](https://developers.notion.com/docs/getting-started) to get a developer account with a secret and set up an integration. From step 2 onwards this tutorial is not relevant as it talks about using the Notion database, whereas we want to create page content.

Share your page you want to post to with your integration. Take note of the URL as it contains the Database Id.

### NodeJS

To work with Notion via JS we need the [Javascript](https://github.com/makenotion/notion-sdk-js) client.

    npm install @notionhq/client
    

We will be using the [Append Block Children](https://developers.notion.com/reference/patch-block-children) route. The following lines are all you need to connect to the client.

    const notion = new client.Client({
      auth: process.env.SECRET,
    });
    
    const databaseId = process.env.DATABASE_ID;
    
    ...
    const response = await notion.blocks.children.append({
          block_id: databaseId,
          children,
        });
    ...

Structuring the call

I used [bookmark-parser](https://www.npmjs.com/package/bookmark-parser) to read my local .html bookmark file and looped through all the folders and links.

    // For a heading
     const folderTitleBlock = {
          object: "block",
          type: "heading_2",
          heading_2: {
            text: [
              {
                type: "text",
                text: {
                  content: folder.name,
                },
              },
            ],
          },
        };
    
    // For a link
    const paragraphBlock = {
            object: "block",
            type: "paragraph",
            paragraph: {
              text: [
                {
                  type: "text",
                  text: {
                    content: link.name,
                    link: {
                      url: link.url,
                    },
                  },
                },
              ],
            },
          };

Then I just call the append function and it works like a charm!