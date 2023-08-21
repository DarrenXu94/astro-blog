---
layout: "../../layouts/BlogPost.astro"
title: "Using generics in Vue components"
description: ""
pubDate: "Aug 21 2023"
heroImage: "/images/blog/web-workers/hero.png"
---

Vue Generics is a relatively new feature in Vue.js that empowers developers to create more reusable and type-safe components. 

To define a component with Vue Generics, the script setup block is utilized. You can specify the generic type using the generic attribute. Here's an example of how to define a generic component using TypeScript:

```html
<script setup lang="ts" generic="T extends Record<string, any>">
import { defineProps } from 'vue';

const { fields, items } = defineProps<VueTableProps<T>>();

```

In this code snippet, the generic type T extends Record<string, any>, indicating that it can be used to represent any object with string keys.

The true power of Vue Generics becomes apparent when working with props. Consider a scenario where you're building a dynamic table component that can display different types of data. The VueTableProps<T> interface is a prime example of utilizing Vue Generics to create type-safe props:

```ts
export interface Field {
  key: string;
  value: string;
}

export interface VueTableProps<T> {
  fields: Field[];
  items: T[];
}
```

Within the component you can expose the data through slots:

```html
<tr v-for="item of items">
  <td v-for="heading of fields">
    <slot
      :name="`cell(${heading.key})`"
      v-bind:data="item[heading.key]"
      v-bind:item="item"
    >
      {{ item[heading.key] }}
    </slot>
  </td>
</tr>
```

A consuming component will have the type of items. `item` here will have the correct keys for intellisense.

```html
<template #cell(surname)="{ item }"> {{ item.surname }} is my surname </template>

```