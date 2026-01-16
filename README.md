# Getting Started

- NOTE: This might require that you have to install postgres / docker for it to work.

## 1. Setup + run

```bash
npm install
# npx prisma db create
# npx prisma generate
# npx prisma migrate dev
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
