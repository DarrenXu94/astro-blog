---
layout: "../../layouts/BlogPost.astro"
title: "Setting up Ghost to run from a subdomain"
description: "Brief notes on setting up my subdomain"
pubDate: "Apr 29 2021"
heroImage: "/NGINX-logo-rgb-large.png"
---

When I first set up my Ghost blog I decided to host it at the apex domain level darrenxu.com. This was a good place to start but I decided having a blog as my default landing page wasn't what I was after. Instead I wanted to have my portfolio in the 'home' page and the blog part of a subdomain off that domain.

When I set up Ghost I had set the url in the config to be https://darrenxu.com. I followed [these](https://forum.ghost.org/t/solved-change-name-and-domain-of-the-blog/600/15) instructions on changing my url.

    ssh into ghost
      sudo -i -u ghost-mgr
      cd /var/www/ghost
      ghost config url {enterURL}
      ghost setup nginx
      ghost setup ssl
      ghost restart

Next I needed to point my apex domain to where my [portfolio](https://darren-xu.netlify.app/) was hosted on Netlify. I configured the nginx file (/etc/nginx/sites-available/darrenxu.com-ssl.conf) to change where darrenxu.com pointed to.

    #proxy_pass http://127.0.0.1:2368;
    proxy_pass https://darren-xu.netlify.app;

Luckily the droplet had SSL all configured so it worked like a charm out of the box. Finally I added the A records to my DNS provider to point both darrenxu.com and \*.darrenxu.com to the IP address of the droplet and everything was working as expected.