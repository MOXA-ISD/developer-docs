---
id: ui-app-dev
title: Development
---

After setting up the develop environment, you now have a skeleton to create a application UI. The following section provides a basic folder structure and develop progress in order for you to prepare your application.

## APP UI starter Directory Structure

```sh
.
├── apps
│   └── app
│       ├── browserslist
│       ├── karma.conf.js
│       ├── src
│       │   ├── app
│       │   │   ├── app-routing.module.ts
│       │   │   ├── app.component.css
│       │   │   ├── app.component.html
│       │   │   ├── app.component.spec.ts
│       │   │   ├── app.component.ts
│       │   │   └── app.module.ts
│       │   ├── assets
│       │   │   └── app.resource.json
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
├── libs
│   └── custom
│       ├── karma.conf.js
│       ├── ng-package.json
│       ├── ng-package.prod.json
│       ├── package.json
│       ├── src
│       │   ├── index.ts
│       │   ├── lib
│       │   │   ├── components
│       │   │   │   ├── custom.component.html
│       │   │   │   └── custom.component.ts
│       │   │   ├── custom.module.spec.ts
│       │   │   ├── custom.module.ts
│       │   │   ├── custom.service.ts
│       │   │   └── store
│       │   │       ├── custom.actions.ts
│       │   │       ├── custom.effects.ts
│       │   │       ├── custom.reducer.ts
│       │   │       └── custom.selectors.ts
│       │   └── test.ts
│       ├── tsconfig.lib.json
│       ├── tsconfig.spec.json
│       └── tslint.json
├── nx.json
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
   When build app finished, you can put all files which in the `dist/apps/app/*` into following path `src/templates/` which is introduced in [STEP: 3 Build App](./edge-appdev-app/#step-3-build-app).
