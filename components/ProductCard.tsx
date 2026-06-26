import type { Product } from '@/lib/product-search';

function formatPrice(price?: number | null) {
  if (!price) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export default function ProductCard({ product }: { product: Product }) {
  const price = product.salePrice || product.price || product.regularPrice;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
            No image
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
              {product.sku}
            </span>
            {product.brand && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                {product.brand}
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{product.category || 'Chưa phân loại'}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-emerald-700">{formatPrice(price)}</p>
            <p className="text-xs text-slate-500">{product.inStock ? 'Còn hàng' : 'Liên hệ tồn kho'}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
