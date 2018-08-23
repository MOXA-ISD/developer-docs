# developer-docs

Developer guides for ThingsPro®

## Evnvironment

- node >= 10.7.0
- yarn >= 1.3.2

## Prepare Development Locally

```sh
yarn # Install all dependencies

yarn start # Start development server
```

## How to Write ThingsPro Document

Edge team guys focus on edge documents which path is `docs/edge`.

### Create Document

You need create a **header** first.

```md
---
id: <unique id name>
title: <title name which shows on both sidebar and content>
---

<This is your content>
```

After create document, you have to modify `sidebars.json`.

### Image Assets

Put your image file in the `docs/assets` folder and use relative path in your document.

### Other Document Instractions

Please check [Docusaurus](https://docusaurus.io/docs/en/doc-markdown)

## Release New Document

You must create a new branch which follows git flow named `release/<your-version-name>` from `develop` branch and when system test finish, you have to create new document version using following command:

```sh
yarn create:version <your-version-name>
```

After creating new version, you can compare with `master` branch and make a PR.

## Create PDF Document

```sh
yarn create:edge:pdf
```
