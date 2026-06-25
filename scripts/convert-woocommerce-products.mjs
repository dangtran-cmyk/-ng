import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
const outputPath = process.argv[3] || 'data/products.json';

if (!inputPath) {
  console.error('Usage: node scripts/convert-woocommerce-products.mjs <woocommerce-export.csv> [output.json]');
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function stripHtml(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function toNumber(value) {
  if (!value) return null;
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(number) ? number : null;
}

function inferBrand(name, sku, category, tags) {
  const text = `${name} ${sku} ${category} ${tags}`.toUpperCase();
  for (const brand of ['TOTAL', 'INGCO', 'WADFOW']) {
    if (text.includes(brand)) return brand;
  }
  if (sku?.startsWith('T')) return 'TOTAL';
  return null;
}

const csv = fs.readFileSync(inputPath, 'utf8');
const rows = parseCsv(csv).filter((row) => row.length > 1);
const headers = rows[0];
const records = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])));

const products = records
  .filter((record) => record.SKU && record.Name)
  .map((record) => {
    const sku = record.SKU.trim();
    const name = record.Name.trim();
    const category = stripHtml(record.Categories || '');
    const tags = stripHtml(record.Tags || '');
    const regularPrice = toNumber(record['Regular price']);
    const salePrice = toNumber(record['Sale price']);
    const image = (record.Images || '').split(',')[0]?.trim() || null;
    const summary = stripHtml(record['Short description'] || record.Description || '').slice(0, 500) || null;

    return {
      sku,
      name,
      brand: inferBrand(name, sku, category, tags),
      category: category || null,
      price: salePrice || regularPrice,
      regularPrice,
      salePrice,
      inStock: record['In stock?'] === '1',
      stock: toNumber(record.Stock),
      tags: tags || null,
      image,
      summary,
    };
  });

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');

console.log(`Converted ${products.length} products to ${outputPath}`);
