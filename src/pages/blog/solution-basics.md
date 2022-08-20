---
layout: "../../layouts/BlogPost.astro"
title: "Setting up the basics"
description: "Setting up to the basics to the solution for a React app."
pubDate: "May 26 2021"
heroImage: "/placeholder-hero.jpg"
---

Now that we've got our environment, deployment and layout configured we can start looking into the React project structure. There are a few basics I like to set up first:

*   React routing with lazy loading
*   Context API
*   Styles
*   SharePoint API
*   Storybook

### React Routing

We will be using the standard [React Router](https://reactrouter.com/web/guides/quick-start) package for this solution but using HashRouter instead of BrowserRouter to prevent navigating away from the SharePoint page. React also comes with its own [lazy loading capabilities](https://reactjs.org/docs/code-splitting.html) which we will be using. A sample of how a router can be set up is shown below.

    import React, { Suspense, lazy } from "react";
    import { HashRouter as Router, Switch, Route } from "react-router-dom";
    
    const Home = lazy(() => import("../Home/Home"));
    const Profiles = lazy(() => import("../../modules/Profiles/Profiles"));
    
    export default function MainRouter() {
      return (
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/profiles">
                <Profiles />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Suspense>
        </Router>
      );
    }
    

### Context API

I prefer using the Context API for store management as it's pretty simple to use and doesn't require any external libraries. I generally set up as many stores as I need per 'module' of my project (basically anything that shares stored information). I have copied in the basics needed for a store.

    import React from "react";
    import { IGlobalStoreProps } from "./IGlobalStoreProps";
    
    const defaultProps: IGlobalStoreProps = {
      webpartContext: null,
    };
    
    const StoreStateContext = React.createContext<IGlobalStoreProps>(defaultProps);
    const StoreDispatchContext = React.createContext<any>({});
    
    export enum ACTION_TYPES {
      SetWebpartContext,
    }
    
    interface IActions {
      type: ACTION_TYPES;
      value: any;
    }
    
    function StoreReducer(state, action: IActions) {
      const { type, value } = action;
      switch (type) {
        case ACTION_TYPES.SetWebpartContext: {
          return {
            ...state,
            webpartContext: value,
          };
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`);
        }
      }
    }
    
    function StoreProvider({ children }) {
      const [state, dispatch] = React.useReducer(StoreReducer, defaultProps);
      return (
        <StoreStateContext.Provider value={state}>
          <StoreDispatchContext.Provider value={dispatch}>
            {children}
          </StoreDispatchContext.Provider>
        </StoreStateContext.Provider>
      );
    }
    function useStoreState() {
      const context = React.useContext(StoreStateContext);
      if (context === undefined) {
        throw new Error("useStoreState must be used within a StoreProvider");
      }
      return context;
    }
    function useStoreDispatch() {
      const context = React.useContext(StoreDispatchContext);
      if (context === undefined) {
        throw new Error("useStoreDispatch must be used within a StoreProvider");
      }
      return context;
    }
    export { StoreProvider, useStoreState, useStoreDispatch };
    

To use the store wrap the main component in the StoreProvider then you can access the store state hook.

      const { webpartContext } = useStoreState();
    

### Styling

The styling I will use for this project is the [Bootstrap grid system](https://getbootstrap.com/docs/5.0/getting-started/download/). This will include all the handy grid and utility classes such as flex and columns but none of the component styling such as buttons. Once I downloaded the latest Bootstrap package I just included the bootstrap-grid.min.css.

### SharePoint API

To communicate with the SharePoint site via API calls we use a tool called [PNPJS](https://pnp.github.io/pnpjs/sp/). To set this up simply add the initialise function to an onInit method of the classes that loads the webpart.

    import { sp } from "@pnp/sp";
    import "@pnp/sp/webs";
    ...
    public onInit(): Promise<void> {
        return super.onInit().then((_) => {
          sp.setup({
            spfxContext: this.context,
          });
        });
      }

Then access the sp object after importing the sp functions with the following for Typescript.

    import { sp } from "@pnp/sp/presets/all";
    

### Storybook

[Storybook](https://www.npmjs.com/package/@storybook/react) is a super handy tool used for component driven design. This allows you to create and view a single component at a time for quick design updates and testing. Storybook can be easily added to your project with one command.

    npx -p @storybook/cli sb init
    

Then create a 'story' for every component you want to see in your book. To view the Storybook with all your components run the npm run storybook command. Using args with Typescript was a bit annoying and I decided to import [this helper](https://github.com/storybookjs/storybook/issues/11916#issuecomment-743077612) to ensure my props were correctly applied to my stories.

    // Helper function
    export const templateForComponent = <P,>(
      Component: (props: P) => StoryFnReactReturnType
    ) => (props: P): Story<P> => {
      const template: Story<P> = (args) => {
        return <Component {...args} />;
      };
      const story = template.bind({});
      story.args = props;
      return story;
    };
    
    // Use in a story
    const template = templateForComponent(SButton);
    
    const meta: Meta = {
      title: "Atoms/Button",
      component: SButton,
    };
    export default meta;
    
    export const Primary = template({
      text: "test",
    });
    

Primary will now show errors if args don't match

Storybook also allows me to introduce [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) in creation of my components. Basically it will allow me to create my smaller pieces of componentry first and gradually create larger designs with them.