---
layout: "../../layouts/BlogPost.astro"
title: "Host a component library for free"
description: "Steps I did to host a Vue component library for free using Github pages and storybook"
pubDate: "Sep 02 2021"
---

I wanted to create and host a design system online for free. This is part 1 of the series where I host the Vue components in a Storybook project deployed on Github pages.

## Creating a Vue component library

I wanted to create a very basic component library with a few modern features:
- Components styled with CSS variables for greater customization and flexibility
- Intellisense when used in child projects

To make a basic vite project into a component library make the following changes.

Update your package.json

```json
...
"main": "./dist/vue-component-lib.es.js",
"module": "./dist/vue-component-lib.es.js",
"types": "./dist/src/lib.d.ts",
"files": [
  "dist/**/**",
  "src/**/**"
],
...
```

Update your vite.config.ts

```ts
plugins: [vue(), dts(), renameNodeModules("ext", false)],

...
build: {
  minify: false,
  lib: {
    entry: path.resolve(__dirname, "src/lib.ts"),
    name: "Vue component lib",
    fileName: (format) => `vue-component-lib.${format}.js`,
  },
  rollupOptions: {
    external: ["vue"],
    output: [
      {
        format: "es",
        dir: "dist",
        preserveModules: true,
      },
    ],
  },
},
...
```

Make sure you install the [dts](https://www.npmjs.com/package/npm-dts) (for Intellisense) and [renameNodeModules](https://www.npmjs.com/package/rollup-plugin-rename-node-modules) packages. 

Make a file lib.ts and delete the index.html. This file will be the entry point to the library so the scss styles can be imported here.

```ts
import "./globals/scss/styles.scss";
export { default as DSButton } from "./components/button/Button.vue";
```

## Adding Storybook

Storybook can be easily added to a existing project with ```npx storybook init```. Once Storybook has been initialized add the scss imports to the preview-head.html file. 
```html
<link rel="stylesheet" href="../src/globals/scss/styles.scss">
```
This is because Storybook doesn't use lib.ts so the styles need to be imported elsewhere. 

A few new scripts need to be added for building the library.

```json
"cpy-scss": "cpr ./src/globals/scss ./dist/scss -d",
"storybook": "start-storybook -p 6006",
"build-storybook": "build-storybook -o docs-build && cp ./dist/style.css ./docs-build && echo 'storybook.darrenxu.com' > './docs-build/CNAME'",
"deploy-storybook": "storybook-to-ghpages --existing-output-dir docs-build"
```

These scripts to a variety of things such as move the built scss files into the correct repository for Storybook to consume.

I am using [this library](https://www.npmjs.com/package/@storybook/storybook-deployer) to deploy to Github pages. I have to manually add in a CNAME file as I am using a custom domain in my Github pages settings. 

I added a Github pipeline to update the static site when specific files are changed as well as allow for manual deployment.

```yaml
on:
  push:
    paths: ["stories/**", "src/components/**"] # Trigger the action only when files change in the folders defined here
    # Allows you to run this workflow manually from the Actions tab on GitHub.
  workflow_dispatch:
```

I use [this action](https://github.com/JamesIves/github-pages-deploy-action) to run the Github pages deploy action from the specified out folder. 

```yaml
- name: Deploy 🚀
  uses: JamesIves/github-pages-deploy-action@3.6.2
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    BRANCH: main # The branch the action should deploy to.
    FOLDER: docs-build # The folder that the build-storybook script generates files.
    CLEAN: true # Automatically remove deleted files from the deploy branch
    TARGET_FOLDER: docs # The folder that we serve our Storybook files from
```

See the full repo [here](https://github.com/DarrenXu94/component-library). See the live site [here](https://storybook.darrenxu.com/?path=/story/button--first-story).