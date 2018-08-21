---
id: ui-app-dev
title: Development
---

After preparing develop environment, you now have a skeleton to work from for your specific APP application UI. The following discusses the rest of the app ui starter structure and develop progress in order for you to prepare your application.

## APP UI starter Directory Structure

```sh
.
├── apps
│   └── tp-app
│       ├── src
│       │   ├── app
│       │   │   ├── app.component.css
│       │   │   ├── app.component.html
│       │   │   ├── app.component.spec.ts
│       │   │   ├── app.component.ts
│       │   │   ├── app.module.ts
│       │   │   ├── components
│       │   │   │   ├── tp-app.component.html
│       │   │   │   └── tp-app.component.ts
│       │   │   ├── services
│       │   │   │   └── tp-app.service.ts
│       │   │   └── store
│       │   │       ├── tp-app.actions.ts
│       │   │       ├── tp-app.effects.ts
│       │   │       ├── tp-app.reducer.ts
│       │   │       └── tp-app.selectors.ts
│       │   ├── assets
│       │   │   └── tp-app.resource.json
│       │   ├── environments
│       │   │   ├── environment.prod.ts
│       │   │   └── environment.ts
│       │   ├── favicon.ico
│       │   ├── index.html
│       │   ├── main.ts
│       │   ├── polyfills.ts
│       │   ├── styles.scss
│       │   └── test.ts
│       ├── tsconfig.app.json
│       ├── tsconfig.spec.json
│       └── tslint.json
├── package.json
```

We use angular to build this app UI starter if you are not familiar with angular or UI development, we provide you to generate APP web UI by config.

> The `apps/tp-app/src/assets/tp-app.resource.json` file is a config which can generate a form automatically by following [config instruction](./ui-app-component-config.md).

## Getting Started

1. Import Project
   ![Import Project](assets/ui/import-project.gif)

2. Start Development Server
   ![start dev server](assets/ui/start-dev-server.gif)

3. Development with Config
   ![modify ui config](assets/ui/dev-with-config.gif)

4. Build App UI
   ![Build app ui](assets/ui/build-app-ui.gif)

5. Pack App with UI
   When build app finished, you can put all files which in the `dist/apps/app/*` into following path `src/templates/` which is introduced in [STEP: 3 Build App](edge-appdev-app/#step-3-build-app).
