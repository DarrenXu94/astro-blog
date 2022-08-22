---
layout: "../../layouts/BlogPost.astro"
title: "Hosting a blog with Ghost CMS"
description: "A biref set of notes in setting up my Ghost CMS blog"
pubDate: "Apr 04 2021"
heroImage: "/ghost_logo_big.png"
---

I have previously used several blog CMS platforms such as Netlify with Gatsby but have recently decided to give [Ghost](https://ghost.org/) a try. Ghost is open source and developer focused which has resulted in plenty of quality of life features being built in. [Themes](https://ghost.org/marketplace/) are a quick and easy way to customise your blog and [integrations](https://ghost.org/integrations/) allow for quick functionality to be added.

**Hosting**

For my setup I have decided to use Ghost on [Digital Ocean](https://ghost.org/docs/install/digitalocean/). Ghost offer $100 free Digital Ocean credit which means I can run my droplet for almost two years free of charge. The installation and setup was extremely easy.

1.  Add ssh keys to Digital Ocean
2.  Configure an A name record in the domain registry to point to the Digital Ocean droplet IP

I did run in to a [problem](https://www.digitalocean.com/community/questions/ghost-1click-app-access-denied-for-user-ghost-localhost) where my installation failed due to missing MySQL permissions seen below.

    Message: ER_ACCESS_DENIED_ERROR: Access denied for user 'ghost'@'localhost' (using password: YES)

After searching for a while and finding no solutions, deleting the droplet and recreating it seemed to work anyway.

**Customisation**

For fonts I have decided to use [Fontjoy](https://fontjoy.com/). Fontjoy uses machine learning to determine aesthetic font pairings and is very easy to use.

I have decided to use the fonts Ubuntu and Nunito. To use them copy the snippet below and add to /ghost/#/settings/code-injection.

    <link href="https://fonts.googleapis.com/css2?family=Nunito&family=Ubuntu:wght@300&display=swap" rel="stylesheet">
    <style>
    :root {
        --font-primary: 'Ubuntu', sans-serif;
        --font-secondary: 'Nunito', sans-serif;
      }
    </style>

My avatar was created using [OpenPeeps](https://www.openpeeps.com/), an open source vector character creator. These illustrations can be created online with a limited set of features or downloaded and edited with your favourite illustration editor (Figma, Adobe XD).

**Themes**

I played around with using the [Attila](https://github.com/zutrinken/attila) ghost theme because I thought it looked clean and perfect for a developer blog. It was a bit confusing at first following the Ghost documentation on adding in [Disqus](https://ghost.org/integrations/disqus/) to the blog as it turns out Attilla already had that built in. Later, I found some issues with the styling of the code blocks as Attila had their own styles that took importance over the [Prism](https://ghost.org/docs/tutorials/code-syntax-highlighting/) themes.

I decided to use the default Casper theme with the [Prism Tomorrow](https://www.npmjs.com/package/prismjs-tomorrow-theme) theme for code highlighting.