import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(packageRoot, 'src');
const outputRoot = path.join(packageRoot, 'dist');

async function copyComponentStyles(directory = sourceRoot) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const sourcePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await copyComponentStyles(sourcePath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.css') || path.dirname(sourcePath) === sourceRoot) continue;

    const outputPath = path.join(outputRoot, path.relative(sourceRoot, sourcePath));
    await mkdir(path.dirname(outputPath), { recursive: true });
    await copyFile(sourcePath, outputPath);
  }
}

await copyComponentStyles();
