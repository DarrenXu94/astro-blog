---
layout: "../../layouts/BlogPost.astro"
title: "SharePoint protected routes"
description: "Code snippet for SharePoint protected routes with React router."
pubDate: "Jun 08 2021"
heroImage: "/react-router.webp"
---

Below is a code snippet I am using for protected routing in SharePoint. The route looks at a user's SharePoint groups and allows/redirects based on access.

1.  Get a user's SharePoint group. I prefer to save this information in a global store as multiple components may need this.

    const getCurrentUserGroup = async () => {
        return await sp.web.currentUser.groups();
      };

2\. Create the Protected Route component. I have created this component so it will access user groups from the global store but you can change the group input/other validation depending on what you need.

    import React from "react";
    import { Route, Redirect } from "react-router-dom";
    import { useStoreState } from "../../stores/GlobalStore/GlobalStore";
    import { RouterPaths } from "./MainRouter";
    
    export default function ProtectedRoute({ children, groupArray, ...rest }) {
      const { userGroups } = useStoreState();
    
      return (
        <>
          {userGroups ? (
            <Route
              {...rest}
              render={(props) =>
                userGroups.some((group) => groupArray.includes(group.Title)) ? (
                  children
                ) : (
                  <Redirect
                    to={{
                      pathname: RouterPaths.Unauthorized,
                      state: { from: props.location },
                    }}
                  />
                )
              }
            />
          ) : (
            <span>Loading</span>
          )}
        </>
      );
    }
    

3\. Add the Protected Route to the React Router switch component. Then pass in an array of whitelisted SharePoint groups that can access the route. I have enumerated my SharePoint groups as well for future-proofing.

     export enum SP_GROUPS {
      hubOwners = "hub Owners",
    }
    
     <Switch>
         <ProtectedRoute
         groupArray={[SP_GROUPS.hubOwners]}
         path={RouterPaths.Admin}
         >
         <Admin />
         </ProtectedRoute>
         ...
    
    </Switch>

4\. Create an Unauthorized route and also add it into the switch component. This page will be the default for users without access.

    <Route path={RouterPaths.Unauthorized}>
    	<UnAuthorized />
    </Route>