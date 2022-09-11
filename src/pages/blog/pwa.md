---
layout: "../../layouts/BlogPost.astro"
title: "Making SPFX into a PWA"
description: "How to make your SPFX solution into a progressive web app."
pubDate: "May 18 2021"
---

Having a lot of the SharePoint features is nice but if you'd like to have a standalone PWA where users don't even know you're sitting on top of SharePoint, this is also possible.

### Change the Page Layout

Changing the Page layout can be done by either using the Pnp Online CLI or using plain JS.
```cmd
$PageName = "Defence.aspx"
# Changing the page to SinglePageApp
$item = Get-PnPListItem -List "Site Pages" -Query "<View><Query><Where><Eq><FieldRef Name='FileLeafRef' /><Value Type='Text'>$PageName</Value></Eq></Where></Query></View>"
$item["PageLayoutType"] = "SingleWebPartAppPage"
$item.Update()
Invoke-PnPQuery
Disconnect-PnPOnline
```

This method above requires connecting to Pnp online then updating a page layout type
```js
var siteUrl = 'https://<your-site>.sharepoint.com/sites/hub/';
var pageUrl = 'SitePages/<your-page-name>.aspx'
fetch(siteUrl + '_api/contextinfo', {
  method: 'POST',
  headers: {
    accept: 'application/json;odata=nometadata'
  }
})
  .then(function (response) {
    return response.json();
  })
  .then(function (ctx) {
    return fetch(siteUrl + "_api/web/getfilebyurl('" + pageUrl + "')/ListItemAllFields", {
      method: 'POST',
      headers: {
        accept: 'application/json;odata=nometadata',
        'X-HTTP-Method': 'MERGE',
        'IF-MATCH': '*',
        'X-RequestDigest': ctx.FormDigestValue,
        'content-type': 'application/json;odata=nometadata',
      },
      body: JSON.stringify({
        PageLayoutType: "SingleWebPartAppPage"
      })
    })
  })
  .then(function(res) {
    console.log(res.ok ? 'DONE' : 'Error: ' + res.statusText);
  });
```
This method can be copy pasted and run in the console of a SharePoint page that's logged in.

### Adding in a Favicon

I used [this website](https://favicon.io/) to generate a favicon and webmanifest which allows for the icon when users save as a favourite to their home screen. [React Helmet](https://www.npmjs.com/package/react-helmet) can be used for injecting header tags to a page in React.

Step 1: Create your favicon using favicon.io and extract the contents into a directory outside your src folder (I used a folder called static). Add the following to your gulpfile.
```js
gulp.task('upload-static', function() {
  return gulp.src('./static/*')
  .pipe(spsync({
    "username": "<username>@<domain>.onmicrosoft.com",
    "password": <your-password>,
    "site": "https://<your-site>.sharepoint.com/sites/hub",
    "libraryPath":"SiteAssets/static"
  }));
})
```

When I run gulp upload-static this will upload all the contents from the folder into the Site Assets folder under a static sub-folder in SharePoint.

Step 2: Add Helmet to allow header links to be added to any React component, preferably the main component that gets loaded. Firstly we will add the favicon.

```tsx
<Helmet>
  <meta charSet="utf-8" />
  <title>My Sample WebPart</title>
  <link
    rel="shortcut icon"
    href="https://<your-site>.sharepoint.com/sites/hub/SiteAssets/favicon.ico"
  />
  
</Helmet>
```

Result

Step 3: Add in the web manifest. Cross origin tag needs to be used for the webmanifest to load assets within the same folder using auth. When I did this from my work SharePoint account everything worked out of the box, however when I tried to do this on my new instance the manifest file was pointing to the root directory of the site eg <your-site>/android-chrome-512x512.png (I found this out using [this handy article](https://web.dev/add-manifest-react/). Turns out Chrome's application tab can give you a manifest preview). I had to change the url of my webmanifest to include the full url /sites/hub/SiteAssets/static/android-chrome-512x512.png.
```tsx
<link
  rel="manifest"
  href="https://<your-site>.sharepoint.com/sites/hub/SiteAssets/site.webmanifest"
  crossOrigin="use-credentials"
/>
```

Final result!

Step 4: Add iPhone support. IPhones/Apple products don't actually use the webmanifest to load their icons (the icon names give it away with the Android tag) so we need to add their own reference using the apple-touch-icon link reference. This however causes some issues with SharePoint as the link icon needs to accessible without credentials. A few ways around this are by hosting the image elsewhere not behind logins or use the base 64 encoded image as a source. I chose the latter and converted my image using [this website](https://www.base64-image.de/).
```tsx
<link
  rel="apple-touch-icon"
  href="data:image/png;base64,iV<..reduced for brevity>"
/>
```