---
layout: "../../layouts/BlogPost.astro"
title: "Creating a GUI form builder and renderer"
description: "The steps I took in making this"
pubDate: "Oct 06 2024"
heroImage: "/images/blog/dribl-scrape/hero.png"
---

MVP:

GUI with all form elements
Draggable area
Editable attributes
Validation
Array structure transformed into strings

Enhancement 1 - Load JSON into vue component
Load JSON schema into form in Vue
Validation included
Load existing data into form

Enhancement 2 - Conditional validation
Add validation into form builder
Convert form builder to show actual elements
Add validation to form loader


Code structure

Lib:
Builders
Builder types and attributes

Form loader
Each builder has a loader
Loader conditional render

Form builder:



Builder class - has element and also attributes for the form builder

Element interface {
  name: string;
  label: string;
  type: string <- keyof typeof enum for all types of inputs
  outputType: string <- keyof typeof enum for outputs
  dependencies: Dependencies[]
}

Each element with extend and add their own attributes

Select interface extends Element {
  options: array
}

Dependencies array type {
  rules: Rule []
  groups: Dependencies[]
  id: string
}

Rule type {
  field: string;
  operator: keyof typeof enum for operator types
  value: string
}

