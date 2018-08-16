---
id: ui-app-dev
title: Development
---

After preparing develop environment, you now have a skeleton to work from for your specific web application UI. The following discusses the rest of the app ui starter structure and develop progress in order for you to prepare your application.

## Directory Structure

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

We use angular to build this app UI starter if you are not familiar with angular or UI development, we provide you to generate web UI by config.

> The `apps/tp-app/src/assets/tp-app.resource.json` file is a config which can generate a form automatically by following [config instruction](./ui-app-component-config.md).
