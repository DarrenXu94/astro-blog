---
layout: "../../layouts/BlogPost.astro"
title: "List relationships in SharePoint"
description: "Pros and cons of SharePoint list relationships."
pubDate: "July 28 2021"
heroImage: "/placeholder-hero.jpg"
---

I have been using SharePoint for a while and recently discovered the lookup column linking capability. This seemed like an extremely handy feature but I didn't even realise I was already using it when I added the User column types to my list items. Essentially there is a column in SharePoint that you can specify as a key to another list.

**TLDR: Like a poor man's GraphQL with limited column type support and only one level of nesting**

    <Field ID="{GUID}" Name="Lookup" StaticName="Lookup" DisplayName="Lookup" Type="Lookup" List="{Lookup List GUID}" ShowField="[Lookup Internal Field Name]" />
    

I added in the following column to my list (Users) and linked it to another list (Jobs).

    <Field Group="Sample" ID="{7f51d69e-9cf7-4158-bbd7-0e1347ac73d3}" Name="JobLookup" StaticName="JobLookup" DisplayName="JobLookup" Type="Lookup" List="{14e1c914-bde7-4ffe-ab24-b0babf25c4b8}" ShowField="Title" Mult="TRUE" />

To access a 'deep' key of an object you need to use the expand command in pnpjs.

Firstly I tested the call without expand to see what it would return.

    return await sp.web.lists.getByTitle(list).items.get();
    
    // returns JobLookupId: [3]

Next I tried querying with some default columns.

    return await sp.web.lists
          .getByTitle(list)
          .items.select(
            "Title",
            "JobLookup/Title",
            "JobLookup/Modified"
          )
          .expand("JobLookup");
          
    /* returns JobLookup: Array(1)
    0:
    Modified: "2021-07-28T07:24:45Z"
    Title: "Job info"
    odata.id: "f2d2b5b4-547b-49f2-9ffd-c695d578feef"
    odata.type: "SP.Data.JobsListItem" */

Finally I tried querying with my own custom field. This is where it fell over.

    return await sp.web.lists
          .getByTitle(list)
          .items.select(
            "Title",
            "JobLookup/Title",
            "JobLookup/Modified",
            "JobLookup/JobInfo"
          )
          .expand("JobLookup");
          
    // "message":{"lang":"en-US","value":"The query to field 'JobLookup/JobInfo' is not valid."}      
          

According to official [Microsoft documentation](https://support.microsoft.com/en-us/office/create-list-relationships-by-using-unique-and-lookup-columns-80a3e0a6-8016-41fb-ad09-8bf16d490632?ui=en-us&rs=en-us&ad=us), there are only a few column types that can be expanded. As well as that "You can't index a secondary column or make a secondary column unique."

**Supported Column Types**

- Single line of text
- Choice (single value)
- Number
- Currency
- Date and Time
- Lookup
- Person or Group (single value)

**Unsupported Column Types**

- Multiple lines of text
- Choice (multi-valued)
- Calculated
- Hyperlink or Picture
- Custom columns
- Lookup (multi-valued)
- Person (multi-valued)
- Yes/No

This makes this feature limited but still useful in cases such as querying for a user's name but the lack of nesting objects and column types is still a bit disappointing.