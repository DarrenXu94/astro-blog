---
layout: "../../layouts/BlogPost.astro"
title: "Client side configuration"
description: "Configuring your SharePoint site client side."
pubDate: "Jun 20 2021"
---

Sometimes it is necessary is use client side js to configure a SharePoint site. This may be due to lack of access to the PNP Powershell cmdlet or environmental constraints. Configuring via client side isn't my method of choice as it's not as reliable as the supported cmdlet, doesn't cover all deployment options and also requires the extra steps of having to build the features into an SPFX solution just to run a few times. However, if you are in a constrained environment, PNPjs can get you most of the way there.

For my project I would like to set up a SharePoint list, a content type to attach to that list and fields added to the content type. All the commands I will be using are documented on the [PNPjs documentation](https://pnp.github.io/pnpjs/sp/lists/) website.

### List

Adding a new SharePoint list is very straightforward.
```ts
await sp.web.lists.add(name);
```

### Content Types

Adding a new content type is not. The document states you should be able to do something like this:
```ts
sp.web.contentTypes.add("0x01008D19F38845B0884EBEBE239FDF359184", "My Content Type");
```  

However I tried to do this but the content type ID was different. According to this [Github issue](https://github.com/pnp/pnpjs/issues/457) there is a bug in specifying IDs and parent IDs with the issue being closed with the "no plans to update the SP api to support this" comment. Basically if I wanted to use this content type I would have to query all content types and filter the Name field for the key I wanted.

```ts
return await sp.web.contentTypes.get();
``` 

### Columns

Adding a new column can be done in many ways put I personally prefer to add via XML schema as there are more options and more documentation. I have listed one example of a field below.
```ts
const xml = `<Field Group="Sample" DisplayName="SampleContent" IsolateStyles="FALSE" Name="SampleContent" RichText="TRUE" RichTextMode="FullHtml" Title="SampleContent" Type="Note" ID="{b1858e4e-cf1e-4c9f-84fd-680bda2258ff}" StaticName="SampleContent" />`

return await sp.web.fields.createFieldAsXml(xml);
```
    

### Adding Columns to Content Types

Unfortunately there are no easy ways to do with with PNPjs and it looks like it isn't on their [radar](https://github.com/SharePoint/PnP-JS-Core/issues/290). One way to still do it programatically is using PNP Powershell.

```
Add-PnPFieldToContentType -Field "Project_Name" -ContentType "Project Document"
```

The alternative is to just use the SharePoint GUI and add the columns to the content type manually.