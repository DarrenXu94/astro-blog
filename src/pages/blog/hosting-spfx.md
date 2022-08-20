---
layout: "../../layouts/BlogPost.astro"
title: "SPFX project on Ubuntu"
description: "I describe the process of setting up a SPFX project on Ubtunu."
pubDate: "May 15 2021"
heroImage: "/placeholder-hero.jpg"
---

During work I use a windows machine to develop SPFX solutions on a corporate SharePoint Online tenancy. It turns out Microsoft have given developers a chance to have their [own developer tenancy](https://developer.microsoft.com/en-us/microsoft-365/dev-program) for personal development and playing around. I decided to have a go at setting this up to see how the process would work on my own machine.

Setting up the Microsoft developer account
------------------------------------------

After [creating an account](https://developer.microsoft.com/en-us/microsoft-365/dev-program) on the developer portal (I strongly recommend using your personal email as if you change jobs you will lose access) you will be able to access your [365 profile page](https://developer.microsoft.com/en-us/microsoft-365/profile/). On this profile page I installed the sample data pack (which says it should take a few minutes, turns out it took almost 10 hours) before installing the SharePoint data pack.

![](__GHOST_URL__/content/images/2021/05/image.png)

Once you've set these up you will need to create an admin account which will have a [onmicrosoft.com](mailto:something@yourdomain.onmicrosoft.com) extension. This will be the account you use to log in to SharePoint with. If you have forgotten the SharePoint site name you can always visit the [admin centre](https://admin.microsoft.com/) (I had to do this).

Setting up SPFX
---------------

Following the [Set up SharePoint Environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment) guide was helpful but didn't get me all the way there. For some reason installing the Microsoft generator globally was causing issues.

    npm install @microsoft/generator-sharepoint --global
    

It was throwing a permissions error even though I had managed to install gulp and yo globally. I tried with both sudo and regular, and —unsafe-perm as mentioned [here](https://github.com/pnp/generator-spfx/issues/227) (different package but same problem). The [issue seemed to be a race condition](https://github.com/SharePoint/sp-dev-docs/issues/992) that was resolved, but obviously not for me. For me to get around this I just create a folder called spfx and installed it locally there and ran yo @microsoft/sharepoint which worked perfectly. I guess all my SPFX webparts will exist in that folder from now on.

I ran the project with gulp serve and voila, address already in use. I ran a port scan to see what was on that address and it turns out I had postgres running on 5432.

    sudo lsof -i -P -n | grep LISTEN

I don't really want to stop postgres as I'll be using that for other projects so I changed the api port in serve.json in the config folder to 5439.

I ran the serve command again and got a certificate issue, but at least the webpart is running. I ran the trust cert command (gulp trust-dev-cert) as detailed on the Set up SharePoint Environment page but that didn't fix the issue. Apparently this is because the trust-dev-cert command only works for OSX and Windows.

    Automatic certificate trust is only implemented for gulp-core-build-serve on Windows and macOS

Every now and then your project will stop loading your SPFX files and you will need to visit [https://localhost:4321/temp/manifests.js](https://localhost:4321/temp/manifests.js) to re-allow the untrusted certificate.

I don't actually care about this as I won't be developing on localhost anyway but instead on the SharePoint online workbench which can be accessed by adding /\_layouts/15/workbench.aspx to the end of your site. At last the SPFX solution is running on SharePoint and we can start developing.

![](__GHOST_URL__/content/images/2021/05/image-1.png)