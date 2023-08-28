---
layout: "../../layouts/BlogPost.astro"
title: "Deploying a Vue Component on NPM: Lessons Learned"
description: "Every mistake I made in publishing a Vue component to NPM"
pubDate: "Aug 28 2023"
heroImage: "/images/blog/publishing-a-npm-package/npm.png"
---

# Introduction

In the pursuit of making and publishing a Vue component on NPM, I followed a helpful article that initially covered React component publishing. The journey was marked with a series of challenges and mistakes, which I'm sharing here to help others avoid similar pitfalls.

Article Reference: [React Component Library with Vite and Deploy in NPM](https://articles.wesionary.team/react-component-library-with-vite-and-deploy-in-npm-579c2880d6ff)

# Building the library

## Getting Started

To start off, I used the following command to scaffold my Vue component project:

```bash
npm init vite@latest vue-table -- --template vue-ts
```

However, this command didn't work seamlessly for me. I had to update vue-tsc to the latest version.
I also had an issue with my outdated Node version as I discovered in [this article](https://github.com/unjs/consola/issues/204).

# Testing locally

To test locally I ran `npm build` and `npm pack` to create a local package. I created a new Vue consuming app and installed via a absolute path. When I was testing I kept getting type errors. 

I asked ChatGPT 

```i am getting the error Could not find a declaration file for module 'vue-table'. how do i add one```

It recommended me to check my original library had the correct typings exposed and I realised I had completely forgot to add `vite-tsconfig-paths` and `vite-plugin-dts` in my `vite.config.js` so it wasn't exporting any types.

# Deployment Challenges

Publishing the component to NPM brought its own set of challenges. Initially, I attempted to publish under the name `vue-table`, only to discover that this package name was already taken. It took me some time to realize that the key to changing the package name lay within the `name` field of the `package.json` file.

Another hurdle came in the form of missing peer dependencies. Not including Vue as a peer dependency led to issues during the NPM publishing process. An essential piece of advice from the article helped me understand this: "We do not install it as a production dependency because the app using your component package is responsible for the dependency."

To manage external dependencies during the build process, I made use of the following Rollup configuration snippet:

```js
rollupOptions: {
  external: [...Object.keys(packageJson.peerDependencies)],
},
```

# Documentation with Vitepress

For documentation purposes, I decided to integrate Vitepress. Here's how I added it to my project:

```bash
npx add -D vitepress
```

However, a blunder on my part led me to initially install Vitepress in the same directory as my components. This caused chaos in the project, as reported in [this GitHub issue](https://github.com/vuejs/vitepress/issues/2220).

# GitHub Action Woes

In an attempt to automate the deployment process to NPM, I created a GitHub Action workflow. Strangely, it didn't seem to work. After some head-scratching, I discovered that I had mistakenly given the workflow file the same name `main.yml`, causing the confusion.

I also prompted ChatGPT with this

```
write me a github actions yml file that will build and deploy a vitepress site to github pages 
you may optionally use this package JamesIves/github-pages-deploy-action@3.6.2
```

I copy pasted the result into the pipelines folder and ran every command over. This worked like a charm. 

# Enhancing Documentation

To improve the documentation of the component, I integrated `vue-docgen-cli`:

```bash
npm add -D vue-docgen-cli
```

Additionally, I wanted to include Markdown files within other Markdown files. The syntax to achieve this was:

```markdown
<!--@include: components/src/components/VueTable.md-->
```


