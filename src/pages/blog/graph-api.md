---
layout: "../../layouts/BlogPost.astro"
title: "Using the Graph API"
description: "How to use the Graph API in your SPFX solution."
pubDate: "July 3 2021"
heroImage: "/images/blog/graph-api/hero.png"
---

The GraphAPI has a plethora of useful features that integrate seamlessly in all Microsoft products. In this blog I will demonstrate how to connect your SPFX solution to use the GraphAPI.

### Grab the client provider

To do authenticated calls you need to use the [aadHttpClientFactory](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient) which is provided in the Webpart context. I set this in a global store when my app initialises so I can access it from anywhere.

```ts
const getClient = async () => {
  webpartContext.aadHttpClientFactory
    .getClient("https://graph.microsoft.com")
    .then(async (client) => {
      dispatch({ type: ACTION_TYPES.SetGraphClient, value: client });
    });
};
```

### Consume a GraphAPI endpoint

To choose and test and end point I like to use the online [Graph explorer](https://developer.microsoft.com/en-us/graph/graph-explorer). The Graph explorer has a bunch of pre-loaded routes but there are also plenty more to be found if you dig further into the Microsoft Graph documentation.

In my app I would like to use the Calender end point to fetch all my events. On the Graph explorer website I browsed to the Calendar drop down and selected the endpoint for "Get all events in my calendar".

When this panel opens up I selected the "Modify permissions" tab to see what permissions are required for the call.

Then in my project I navigated to the package-solution.json in the config folder. I added the following block under the isDomainIsolated key.

```json
"webApiPermissionRequests": [
      {
        "resource": "Microsoft Graph",
        "scope": "Calendars.Read"
      }
    ],
```

Add a call into your solution that uses the same URL generated in the Graph explorer. Make sure the Graph configurations match up with the API (some calls are in Beta and some are in v1).

```ts
const getAllCalendarEvents = async () => {
  return (
    await graphClient.get(
      "https://graph.microsoft.com/v1.0/me/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location",
      AadHttpClient.configurations.v1
    )
  ).json();
};
```
    

Next I had to deploy my app to get the permissions registering for SharePoint. Once the app has been deployed you should visit this link: [https://<your-site>-admin.sharepoint.com/\_layouts/15/online/AdminHome.aspx#/webApiPermissionManagement](https://darrenxu-admin.sharepoint.com/_layouts/15/online/AdminHome.aspx#/webApiPermissionManagement). Click into advanced, API access and you should see a pending request.

Accept this permission if you have access, otherwise you may need to contact a SharePoint admin. If the access has been allowed it should look like this.

Finally, run your code again to see if it works. Make sure you don't do the call until the Graph client has been initialised.

```ts
const getCalendarEvents = async () => {
  const res = await getAllCalendarEvents();
  console.log({ res });
};

useEffect(() => {
  if (graphClient) {
    getCalendarEvents();
  }
}, [graphClient]);
```

Success, we can see the calendar events from the SPFX component!