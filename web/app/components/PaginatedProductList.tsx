import { Link, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Loader2, PlusCircle } from "lucide-react";

// Define the shape of a single product
type Product = {
  _id: string;
  product_name: string;
  product_cover: string;
  current_bid: number;
  category: string;
};

// Define the props for our component
type PaginatedProductListProps = {
  title: string;
  initialProducts: Product[];
  initialHasMore: boolean;
  initialCursor: string | null;
  intent: string; // The action to perform when loading more
};

export function PaginatedProductList({
  title,
  initialProducts,
  initialHasMore,
  initialCursor,
  intent,
}: PaginatedProductListProps) {
  const fetcher = useFetcher<{ products: Product[], hasMore: boolean, cursor: string | null }>();
  
  // Each list now manages its own state
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState(initialCursor);
  
  const isLoadingMore = fetcher.state === 'loading';

  // This effect ONLY watches this component's own fetcher
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      const newProducts = fetcher.data.products ?? [];
      setProducts((prev) => [...prev, ...newProducts]);
      setHasMore(fetcher.data.hasMore ?? false);
      setCursor(fetcher.data.cursor ?? null);
    }
  }, [fetcher.data, fetcher.state]);

  const loadMore = () => {
    if (!hasMore || !cursor || isLoadingMore) return;
    // We pass the specific 'intent' to the loader
    const url = `/?intent=${intent}&cursor=${cursor}&limit=8`;
    fetcher.load(url);
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-3xl font-semibold text-text tracking-tight mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-48">
              <img
                src={product.product_cover || "https://via.placeholder.com/400?text=No+Image"}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-text1 truncate">
                {product.product_name}
              </h3>
              <p className="text-text2 text-sm mt-1">{product.category || "General"}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-bold text-accent">
                  KES {product.current_bid?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {hasMore && (
        <div className="p-4 flex justify-center mt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="bg-accent text-buttontext px-6 py-2 rounded-full hover:bg-complementary transition-colors disabled:bg-gray-500 font-bold flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
}