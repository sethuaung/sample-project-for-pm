### Vite dev setup and ZIP packaging

Below are step-by-step files and commands to add a simple Vite dev workflow (fast dev server, ES module handling, hot reload) and a script to create a ZIP of the project for distribution.

---

### 1. Add package.json

Create package.json in the project root:

```json
{
  "name": "pm-demo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5174",
    "zip": "node ./scripts/make-zip.js"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

### 2. Add Vite config (optional, minimal)

Create vite.config.js in the project root:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
```

---

### 3. Add ZIP script

Create folder scripts and file scripts/make-zip.js:

```js
import { createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import archiver from 'archiver';
import { readdirSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'pm-demo.zip');

const output = createWriteStream(out);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Wrote ${archive.pointer()} total bytes to ${out}`);
});
archive.on('warning', err => { if (err.code !== 'ENOENT') throw err; });
archive.on('error', err => { throw err; });

archive.pipe(output);

// include files and folders (adjust if you have build artifacts to exclude)
const entries = [
  'index.html',
  'src',
  'assets',
  'README.md',
  'package.json'
];
for (const e of entries) {
  const full = path.join(root, e);
  try {
    const stat = await Promise.resolve().then(() => import('node:fs')).then(fs => fs.statSync(full));
    if (stat.isDirectory()) archive.directory(full, e);
    else archive.file(full, { name: e });
  } catch (err) {
    // skip missing items
  }
}

await archive.finalize();
```

Note: this script uses the archiver package. Install it as a dev dependency if you run the zip script:

- npm install --save-dev archiver

Then run:

- npm run zip

This will create pm-demo.zip in the project root.

---

### 4. Dev workflow commands

- Install dev dependencies:

  - npm install

- Start dev server with Vite (fast HMR and ES module support):

  - npm run dev

- Build production bundle:

  - npm run build

- Preview production build:

  - npm run preview

- Create ZIP of project:

  - npm run zip

---

### 5. Small README additions (append to README.md)

Add this short snippet under "Quick start" or "Developer notes":

- Dev with Vite: after npm install run npm run dev to get HMR and module imports served over HTTP.
- Packaging: npm run zip will produce pm-demo.zip (requires dev dep archiver).
- Compatibility: Vite handles ES modules; if you prefer no dev deps, open index.html directly or use python -m http.server.

---

### 6. Optional: Git ignore

Create .gitignore:

```
node_modules/
dist/
pm-demo.zip
.vscode/
```

---
