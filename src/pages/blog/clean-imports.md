---
layout: "../../layouts/BlogPost.astro"
title: "Clean imports"
description: "Configure your imports with Webpack."
pubDate: "Aug 20 2021"
---

Do you have code that looks like this?
```ts
import Button from "../../../common/Button/Button";
```
This is not effective from both a readability and maintainability standpoint. When you move your component you will have to change all your imports and similar component names might get mixed up. A much cleaner solution would be using an import like below.
```ts
import Button from "@common/Button/Button";
```
[This article](https://spblog.net/post/2019/02/05/sharepoint-framework-development-tips-prettify-your-imports) explains how to do it with the SPFX framework.

**TLDR: Add the configuration to your gulp.js file and tsconfig.json file**
```json
// gulp.js
const path = require("path");

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if (!generatedConfiguration.resolve.alias) {
      generatedConfiguration.resolve.alias = {};
    }

    // common
    generatedConfiguration.resolve.alias["@common"] = path.resolve(
      __dirname,
      "lib/webparts/sample/common/"
    );

    //root src folder
    generatedConfiguration.resolve.alias["@src"] = path.resolve(
      __dirname,
      "lib"
    );

    return generatedConfiguration;
  },
});

//tsconfig.json
{
...
  "compilerOptions": {
  ...
  "baseUrl": ".",
    "paths": {
      "@common/*": ["src/webparts/sample/common/*"],
      "@src/*": ["src/*"]
    }
  }
}
```

### Longer(ish) explanation

Webpack has an [alias configuration](https://webpack.js.org/configuration/resolve/#resolve-alias) that allows you to set aliases which are then resolved. However in the SPFX framework you do not get access to the webpack config file so you must add the configuration into the Microsoft build pipeline.