import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const inputPath = process.argv[2];
const outputPath = process.argv[3] || 'data/products.json';

if (!inputPath) {
  console.error('Usage: npm run sync:products -- <woocommerce-export.csv>');
  process.exit(1);
}

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

run('node', ['scripts/convert-woocommerce-products.mjs', inputPath, outputPath]);

if (!fs.existsSync(outputPath)) {
  console.error(`Output not found: ${outputPath}`);
  process.exit(1);
}

run('git', ['add', outputPath]);

try {
  run('git', ['diff', '--cached', '--quiet']);
  console.log('No product changes to commit.');
  process.exit(0);
} catch {
  // git diff --quiet exits 1 when changes exist
}

const now = new Date().toISOString().slice(0, 10);
run('git', ['commit', '-m', `Update product data ${now}`]);
run('git', ['push']);

console.log(`Product data synced to repo: ${outputPath}`);
