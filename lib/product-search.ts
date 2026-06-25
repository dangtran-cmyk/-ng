import products from '@/data/products.json';

export type Product = {
  sku: string;
  name: string;
  brand?: string | null;
  category?: string | null;
  price?: number | null;
  regularPrice?: number | null;
  salePrice?: number | null;
  inStock?: boolean | null;
  stock?: number | null;
  tags?: string | null;
  image?: string | null;
  summary?: string | null;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatPrice(price?: number | null) {
  if (!price) return 'chưa có giá';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function searchProducts(query: string, limit = 6) {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  if (!normalizedQuery) return [];

  const scored = (products as Product[])
    .map((product) => {
      const haystack = normalize(
        [product.sku, product.name, product.brand, product.category, product.tags, product.summary]
          .filter(Boolean)
          .join(' '),
      );

      let score = 0;
      const sku = normalize(product.sku);
      const name = normalize(product.name);

      if (sku === normalizedQuery) score += 100;
      if (sku.includes(normalizedQuery)) score += 60;
      if (name.includes(normalizedQuery)) score += 40;

      for (const token of queryTokens) {
        if (sku.includes(token)) score += 20;
        if (name.includes(token)) score += 10;
        if (haystack.includes(token)) score += 4;
      }

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);

  return scored;
}

export function productsToContext(foundProducts: Product[]) {
  if (!foundProducts.length) {
    return 'Không tìm thấy sản phẩm phù hợp trong dữ liệu hiện có.';
  }

  return foundProducts
    .map((product, index) => {
      return [
        `${index + 1}. SKU: ${product.sku}`,
        `Tên: ${product.name}`,
        `Thương hiệu: ${product.brand || 'chưa rõ'}`,
        `Danh mục: ${product.category || 'chưa rõ'}`,
        `Giá: ${formatPrice(product.salePrice || product.price || product.regularPrice)}`,
        `Tồn kho: ${product.inStock ? 'còn hàng' : 'chưa rõ / hết hàng'}`,
        product.summary ? `Mô tả: ${product.summary}` : null,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
}
