---
layout: "../../layouts/BlogPost.astro"
title: "Structuring a large React program"
description: "Thoughts and tips and structuring a large scale React application."
pubDate: "May 21 2021"
heroImage: "/images/blog/react-structure/hero.jpeg"
---

During my years as a React developer I have found the language to be very easy to start but gradually bloat and become more difficult to maintain as projects grew larger. In this post I aim to describe what I personally have found to be the best practices for maintaining readability and usability in a React project.

Atomic Design Principles
------------------------

I believe the design principles of the [Atomic design system](https://bradfrost.com/blog/post/atomic-web-design/) fit very closely to how React's component system works, but should be followed only to a reasonable point. Tools such as Storybook allow for components to be developed, tested and changed independently and are useful in creation of the atomic level components (smallest components only consisting of themselves eg buttons, checkboxes, input elements).

### Globals

The first important folder in my project structure is the atomic sized components which sit at the top level. This is because most other components will most likely need access to this from all parts of the project.

    .
    └── root/
        └── atoms

In each component under this folder I will try have the component itself, its styles and a storybook of the component with the various states, inputs and props outlined.

    .
    └── root/
        └── atoms/
            └── button/
                ├── button.tsx
                ├── button.scss
                └── button.stories.tsx

The second folder I include is my molecules folder. This folder includes components that require multiple atoms but are also shared among many components in the project. The same principle is applied to the molecules with a story file and styles next to the component. Separating the molecules and atoms is really just to help with logically finding components and preventing a single folder from containing too many folders.

    .
    └── root/
        ├── atoms
        └── molecules/
            └── navbar/
                ├── navbar.tsx
                ├── navbar.scss
                └── navbar.stories.tsx

A hooks folder will also sit at this level but only contain hooks that are non specific to a page.

    .
    └── root/
        ├── atoms
        ├── molecules
        └── hooks/
            └── useResize.tsx

### Pages (Screens)

The next folder is the _pages_ folder, which is the folder most likely to blow out. This folder is used to hold all the different screens of the website. In the root level of this folder I like to keep files that only need to be used once such as the router and a global store etc.

    .
    └── root/
        ├── atoms
        ├── molecules
        ├── hooks
        └── pages/
            ├── router
            └── global-store

In this _pages_ folder each page will have their own collection of components, stores and services relevant to just that page. It would be preferable if every component could have their own storybook (although sometimes this isn't possible due to constraints of the component eg. using an external component that requires auth outside of storybook).

    .
    └── root/
        ├── atoms
        ├── molecules
        ├── hooks
        └── pages/
            ├── router
            ├── global-store
            └── uploader/
                ├── uploader.tsx
                ├── uploader.stories.tsx
                ├── useUploader.tsx
                └── components/
                    └── uploaderForm/
                        ├── uploaderForm.tsx
                        └── uploaderForm.stories.tsx

I like to keep my contexts (stores) at the root of each of the pages as well so they are easy to find and accessible to everything within the directory. This also applies to sub-routing as it will only affect the components within it's own directory.

    .
    └── root/
        ├── atoms
        ├── molecules
        ├── hooks
        └── pages/
            ├── router
            ├── global-store
            └── uploader/
                ├── UploaderStore // can include props and reducer or you can split it
                ├── UploaderRouter
                └── .../
                    └── ...

Sample sub-router:
```tsx
export default function UploaderRouter() {
  let match = useRouteMatch();

  return <Switch>
        <Route path={`${match.path}/:routeId`}>
          <UserProfile />
        </Route>
        <Route path={match.path}>
          <ProfileLanding />
        </Route>
      </Switch>
}
```
When components need to do an effect such as get or post information, a hook can be parsed in via dependency injection so that the values can be mocked in storybook. This is useful for when components want to use a context to avoid prop drilling. This pattern would preferably only be used for large components (eg layouts) with multiple molecules.

Regular usage:
```tsx
import React from "react";
import { useUploader as useUploaderDI } from "../<path>"

export default function Uploader({useUploader = useUploaderDI}) {
  const {userDetails, content, items} = useUploader()

  return <div>
  <SomeSettingsNav data={userDetails}>{text}</SomeSettingsNav>
  <Body content={content} />
  <RightSettings items={items} />
  </div>
}

<Uploader />
```

Storybook usage:
```tsx
<Uploader useUploader={mockUseUploader} />
```

Disadvantages I've Found
------------------------

One annoying this with this structure is when a component uses or needs to update a value in a store, the whole context needs to be mocked in each story file.
```tsx
// Navbar.stories.tsx

export const decorator = () => (
  <StoreProvider defaultProps={mockProps}>
    <Primary
      menuItems={[
        {
          isActive: true,
          key: "/home",
          text: "Home",
        },
        {
          isActive: false,
          key: "/info",
          text: "Info",
        },
      ]}
    />
  </StoreProvider>
);

// Navbar.tsx

export default function Navbar({ menuItems }: NavbarProps) {
  ...
  const { user } = useStoreState();
  ...
  }
```
    

### Footnotes

This [online tree structure tool](https://github.com/nfriend/tree-online) by Nathan Friend was very useful.

Some code snippets for easy store creation

```tsx
// Makestore.ts - A function for creating more stores

import React, { Dispatch, Reducer, useContext, useReducer } from "react";

function makeStore<A, S>(
  reducer: Reducer<S, A>,
  initialState: S
): [any, () => Dispatch<A>, () => S] {
  const DispatchContext = React.createContext<Dispatch<A>>(() => {});
  const StoreContext = React.createContext<S>(initialState);

  const StoreProvider = ({ children, defaultProps = initialState }) => {
    const [store, dispatch] = useReducer(reducer, defaultProps);

    return (
      <DispatchContext.Provider value={dispatch}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </DispatchContext.Provider>
    );
  };

  const useDispatch = () => useContext(DispatchContext);
  const useStore = () => useContext(StoreContext);

  return [StoreProvider, useDispatch, useStore];
}

export default makeStore;

// Sample usage

// Globalstore.tsx

import makeStore from "../makestore";
import StoreReducer from "./GlobalStoreReducer";
import { IGlobalStoreProps } from "./IGlobalStoreProps";

const defaultProps: IGlobalStoreProps = {
  webpartContext: null,
  user: null,
  userGroups: null,
  graphClient: null,
};

const [StoreProvider, useStoreDispatch, useStoreState] = makeStore(
  StoreReducer,
  defaultProps
);

export { StoreProvider, useStoreState, useStoreDispatch };

// IGlobalStoreProps.ts

export interface UserDetails {
  Email: string;
  Id: number;
  LoginName: string;
  Title: string;
  UserPrincipalName: string;
}

export interface IGlobalStoreProps {
  webpartContext: WebPartContext;
  user: UserDetails;
  userGroups;
  graphClient;
}

// GlobalStoreReducer.tsx

import { IGlobalStoreProps } from "./IGlobalStoreProps";

export enum ACTION_TYPES {
  SetWebpartContext,
  SetUser,
  SetGroups,
  SetGraphClient,
}

export interface IActions {
  type: ACTION_TYPES;
  value: any;
}

function StoreReducer(
  state: IGlobalStoreProps,
  action: IActions
): IGlobalStoreProps {
  const { type, value } = action;
  switch (type) {
    case ACTION_TYPES.SetGraphClient: {
      return {
        ...state,
        graphClient: value,
      };
    }
    case ACTION_TYPES.SetGroups: {
      return {
        ...state,
        userGroups: value,
      };
    }
    case ACTION_TYPES.SetUser: {
      return {
        ...state,
        user: value,
      };
    }
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

export default StoreReducer;

// Wrap the components you want in <StoreProvider>
```