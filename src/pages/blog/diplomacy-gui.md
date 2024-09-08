---
layout: "../../layouts/BlogPost.astro"
title: "Making a GUI for the game diplomacy"
description: "How to save 1 hour reading by spending all weekend devving"
pubDate: "Sep 5 2024"
heroImage: "/images/blog/diplomacy/hero.png"
---

Recently, my friends and I decided to start a game of Diplomacy online, playing asynchronously. As a developer, I naturally didn't want to read the documentation (rules of the game), so I looked for an easier solution. 

### Finding a Solution

I found a project on GitHub called an [“diplomacy”](https://github.com/mfro/diplomacy) It had all the game logic and a basic GUI. I downloaded the project and started making a few changes to fit our game.

I also made it scrape data from our Diplomacy game and display it on the map. But things weren't that simple.

### Problems I faced

1. Old dependencies: The project was built on an old version of Vue.js, which had broken dependencies. It took some time to figure out how to fix those.

2. Loading Units on the Map: The project used unit classes, not simple javascript objects, for game units. I had no idea how to load them onto the map at first. Eventually, I found that using the built-in scraper functions gave me the perfect game state.

3. Region IDs and Sets: I still had to manually pass regions into the scraper, and I ran into issues with how the region IDs worked. Regions had data attached via javascript sets, which is the first real time I've had to use them. 

### Adding features

Once the main issues were sorted, I added some extra features like sending proposed orders directly with a hash encoded game state. I also hard coded our game state into the website.

### Deploying on Netlify

I tried to deploy the project using Netlify, but hit a snag. The PHP login page blocked headers in the response, so I couldn’t get the login token. I also tried using Netlify functions, but that didn't work either. SO currently the game only updates if I locally run the fetching function and push.

### Conclusion

Although I ran into several issues, this project taught me a lot about handling dependencies, working with different data types, and deploying apps. Plus, it's a fun way to play Diplomacy with friends without needing to read the rules!

[See the live site here](https://diplomacy.darrenxu.com/)