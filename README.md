# Getting Started

- ~~NOTE: This might require that you have to install postgres / docker for it to work.~~ converterd to SQLite due to prisma not being properly updated for Postgres + courseplace security measures creating issues with thirdpart api usage.

- NOTE: For those reading this project, in this project i use the value "id" only to name elements and give sections a title.
  i.e.:
  - this:

    ```tsx
      <form className="_someTailwind_">
    ```

  - is writting like this:

    ```tsx
    <form id="login-form" className="_someTailwind_">
    ```

    - (or potentially like this):

      ```tsx
      <form id="login-form form login" className="_someTailwind_">
      ```

      _although i prefer to keep it as simple as possible for readability sake, i only use this to keep each id unique, or if elment has similar children related to same title e.g: login-form[login-button] bad example but you get the picture._

  I do this for **readability**, they also has a secondary functionality as a
  'file navigation tool', meaning they work as search tags:
  _"Need to quickly find the login form? ctrl+f "login-form" -> boom, you're there._

## 1. Setup + run

```bash
npm install
npx prisma db create
npx prisma generate
npx prisma migrate dev
# npx tsx prisma/import.ts
npx tsx script.ts
npm run dev:all
```

## 2. Open Prisma Studio (DB interface)

```bash
npx prisma studio
```

<br>
<br>
<br>
<br>

# How to import and export demo-db

The provided JSON dataset (`./export.json`) is located in project root.

**Insert the dataset**

```bash
npx tsx prisma/import.ts
```

_(Or, if using JavaScript: `node prisma/import.js`)_

This will import the demo dataset into your database and clear any existing dataset:

- `node prisma/import.js` => `./export.json` -> db

**Export the dataset**

```bash
npx tsx prisma/export.ts
```

This will export your current todo-dataset and save it as export.json:

- `node prisma/import.js` => db -> `./export.json`
