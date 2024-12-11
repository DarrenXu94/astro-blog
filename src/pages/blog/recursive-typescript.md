---
layout: "../../layouts/BlogPost.astro"
title: "Defining a recursive type"
description: "An interesting bit of code I generated with ChatGPT."
pubDate: "Aug 09 2024"
heroImage: "/images/blog/recursive-typescript/hero.jpg"

---

Every now and then I find a piece of code so interesting generated from AI that I would have never thought of myself. In my instance, I wanted to be able to create a type of a sidebar menu I am creating. The sidebar should allow for nested sidebars but only up to a certain depth (as we don't want the sidebar to go on infinitely). 

I was stumped if such a solution could exist so I asked ChatGPT. While it didn't give me the correct solution straight away, I massaged the responses a few times to ultimately get what I wanted.

Hypothetically if my sidebar type looked like this:

```ts
interface Sidebar {
  name: string;
  children: Sidebar[]
}
```

It created a solution looking like this:

```ts
// Base Nav type with generic depth control
type NavWithDepth<Depth extends number, CurrentDepth extends any[] = []> = {
  name: string;
  // If CurrentDepth length is less than Depth, allow children; otherwise, don't allow further nesting
  children?: CurrentDepth['length'] extends Depth ? never : NavWithDepth<Depth, [unknown, ...CurrentDepth]>[];
};

// Example: Set maximum depth to 3
type NavMaxDepth3 = NavWithDepth<3>;

// Valid example with depth 3
const validNav: NavMaxDepth3 = {
  name: "Home",
  children: [
    {
      name: "About",
      children: [
        {
          name: "Team",
          children: [
            {
              name: "Member 1",
              // No more children allowed here as max depth is 3
            }
          ]
        }
      ]
    }
  ]
};

// Invalid example with depth exceeding 3 (this will cause a TypeScript error)
const invalidNav: NavMaxDepth3 = {
  name: "Home",
  children: [
    {
      name: "About",
      children: [
        {
          name: "Team",
          children: [
            {
              name: "Member 1",
              children: [
                {
                  name: "Member 2", // Error: Exceeds the maximum depth of 3
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

```

I interrogated the code further to try really understand what was going on. Usually for recursion to work you need a base case and something to increment towards the base case. I had no idea this could be achieved with types. The way depth is tracked here is by using `[unknown, ...CurrentDepth]` to increment the counter and `CurrentDepth['length'] extends Depth` to implement the base case (when depth equals specified depth). This was genius.