---
layout: "../../layouts/BlogPost.astro"
title: "Deploying SPFX"
description: "How to publish your SPFX solution"
pubDate: "May 17 2021"
heroImage: "/placeholder-hero.jpg"
---

In this blog I will describe how I set up my deployment solution including how to publish your SPFX application to SharePoint using bash.

### Allow Authentication with Username and Password

This is the first step for future reference but the last step I figured out. Deploying with a script to SharePoint faces issues with a username and password solution as by default Azure has Multi Factor Authentication set up. This happens with the [m365 cli](https://pnp.github.io/cli-microsoft365/cmd/login/) (Linux version of PnP Powershell) and also [gulp-spsync-creds](https://www.npmjs.com/package/gulp-spsync-creds) (useful node package for performing authenticated SharePoint tasks). You will receive various error messages along the lines of "Access has been blocked by Conditional Access policies. The access policy does not allow token issuance".

After searching for an embarrassingly long time I finally discovered a [reply from the Microsoft community](https://docs.microsoft.com/en-us/answers/questions/23371/how-to-disable-mfa-from-azure-ad.html) to fix this. The problem wasn't the MFA on the users in Active Directory as the error would lead to suggest, but rather the fact that Azure has [security defaults](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/concept-fundamentals-security-defaults). Since this is a test site and I have absolutely nothing of value on here, I turned the defaults off in Azure [here](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties) under manage security defaults which allows authorisation by username and password only.

### Creating an App Catalog and deploying

I want to deploy my SPFX solution only to a specific site so I've decided to use an app catalog. To create an app catalog in SharePoint using Ubuntu I needed to use the [m365 cli](https://pnp.github.io/cli-microsoft365/sample-scripts/spo/add-app-catalog/). To upload your webpart to the catalog you must first build the solution then deploy using either use a bash script or gulp.

Package solution

    gulp clean
    gulp bundle --ship
    gulp package-solution --ship
    

Bash

    #!/bin/bash
    
    site=https://<your-site>.sharepoint.com/sites/hub
    read -sp 'Password: ' passvar
    
    m365 login -t password --userName <username>@<domain>.onmicrosoft.com --password $passvar
    m365 spo app add -p ./sharepoint/solution/sample.sppkg --overwrite --scope sitecollection --appCatalogUrl $site
    m365 spo app deploy -n sample.sppkg --scope sitecollection --appCatalogUrl $site
    

This will prompt for a password on run

The bash script above can deploy the solution but I wanted something that didn't need the m365 library (wanted the m365 to be used only in setting up the solution, not part of the ongoing project). The script required inputting a password every time (or saving in plain text which I didn't want to do) so I looked at using [Cpass](https://www.npmjs.com/package/cpass). It provides encryption of the weakest kind but means passwords won't be in plain text.

Gulp

    gulp.task("upload-app-pkg", function () {
      const pkgFile = require('./config/package-solution.json');
      const folderLocation = `./sharepoint/${pkgFile.paths.zippedPackage}`;
      return gulp.src(folderLocation)
        .pipe(spsync({
          "username": "<username>@<domain>.onmicrosoft.com",
          "password": cpass.decode("encoded pass"),
          "site": "https://<your-site>.sharepoint.com/sites/hub",
          "libraryPath": "AppCatalog",
          "publish": true,
          "verbose": false
        }))
    });
    gulp.task("deploy", function () {
      const pkgFile = require("./config/package-solution.json");
      if (pkgFile) {
        // Retrieve the filename from the package solution config file
        let filename = pkgFile.paths.zippedPackage;
        // Remove the solution path from the filename
        filename = filename.split("/").pop();
        // Retrieve the skip feature deployment setting from the package solution config file
        const skipFeatureDeployment = pkgFile.solution.skipFeatureDeployment ?
          pkgFile.solution.skipFeatureDeployment :
          false;
        // Deploy the SharePoint package
        return sppkgDeploy.deploy({
          username: "<user>@<domain>.onmicrosoft.com", // The user that will deploy the file
          password: cpass.decode("encoded pass"), // The password of the user
          tenant: "<your-site>", // The tenant name. Example: contoso
          site: "sites/hub", // Path to your app catalog site
          filename: filename, // Filename of the package
          skipFeatureDeployment: skipFeatureDeployment, // Do you want to skip the feature deployment (SharePoint Framework)
          verbose: true, // Do you want to show logging during the deployment
        });
      }
    });

Special mentions to the packages [gulp-spsync-creds](https://www.npmjs.com/package/gulp-spsync-creds) and [node-sppkg-deploy](https://www.npmjs.com/package/node-sppkg-deploy) for making uploading and deploying from gulp a breeze.

Once deployed you can check your App Catalog to see if they've been added correctly.

![](__GHOST_URL__/content/images/2021/05/image-2.png)

Next add the App to your site using the New App dropdown.

![](__GHOST_URL__/content/images/2021/05/image-3.png)

Your app should appear in the app list, otherwise you have either failed to deploy it or the app has already been added.

Next create a new page and open the Webpart dropdown. You should see your app listed here.

![](__GHOST_URL__/content/images/2021/05/image-4.png)

Finally add it in to see if it all works. After I confirmed that it's rendering correctly I named the page, published and set is as my home page.

![](__GHOST_URL__/content/images/2021/05/image-5.png)