---
layout: "../../layouts/BlogPost.astro"
title: "Follow my journey on creating a fun front-end side project"
description: "Part 1 of an unknown number part series where I try make something and document every dumb mistake I make"
pubDate: "Oct 16 2022"
hidden: true
---

# Part 1, I wanna make something, but what?

I have been feeling a bit inspired lately and wanted to work on a project in my spare time. I know the project I want to make would most likely be a front-end project consuming from an existing free API (as I am too lazy to make one myself).

[This](https://github.com/davemachado/public-api) Github repo has a number of free APIs for people to use. I decided to pick one that I have an interest in, football. I'm using [Football Data](https://www.football-data.org/) as they have a generous free tier and have used them before so I already have an API key. 

## Function apps

I'm pretty sure last time I used this API I had an issue with calling the API directly due to CORs. This time I've decided to create a function app on Netlify to call the API so I won't run into that issue. I also wanted to learn how to make function apps on Netlify so I can use that technology in the future. 

### Approach

#### Set up and test the functions

I knew absolutely nothing about function apps so I went to the [Netlify documentation](https://docs.netlify.com/functions/build/?fn-language=js). I started by making a test js function. 

```js
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "hello world" }),
  };
};

```

To serve and test the functions locally I had to setup the [Netlify cli](https://docs.netlify.com/cli/get-started/#run-a-local-development-environment).

```
npm install netlify-cli -g

netlify login
```

Since I had already set up a Git repo for this project and deployed it to Netlify I could just link it.

```
netlify link
```

I can run `netlify dev` and it will spin up a local server with the endpoints exposed at `/.netlify/functions/hello`.

#### Link to API

After I deployed and checked that the function app was working I worked on making the API call to the football api.

```js
const axios = require("axios");
require("dotenv").config();

async function callAPI() {
  return axios.get("http://api.football-data.org/v4/competitions/PL", {
    headers: {
      "X-Auth-Token": process.env.NETLIFY_FOOTBALL_API_KEY,
    },
  });
}
exports.handler = async function (event, context) {
  const res = await callAPI();
  return {
    statusCode: 200,
    body: JSON.stringify(res.data),
  };
};
```

I saved the environment variable locally in a `.env` file and also added it to the settings on Netlify.

#### Typescript

I installed the following modules to get a Typescript endpoint working.
```
npm i -D typescript @netlify/functions @types/node

```

Also added a tsconfig by Googling 'Netlify function app tsconfig.json'. I made a call with the API and copied the response to [Quicktype](https://app.quicktype.io/).

```ts
...
export interface League {
  area: Area;
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  currentSeason: Season;
  seasons: Season[];
  lastUpdated: Date;
}
...
```

Final function code for Typescript.

```ts
import { Handler } from "@netlify/functions";
import axios from "axios";
import { League } from "../../models/football";

async function callAPI() {
  return axios.get<League>("http://api.football-data.org/v4/competitions/PL", {
    headers: {
      "X-Auth-Token": process.env.NETLIFY_FOOTBALL_API_KEY,
    },
  });
}

const handler: Handler = async (event, context) => {
  const res = await callAPI();
  return {
    statusCode: 200,
    body: JSON.stringify(res.data),
  };
};

export { handler };

```