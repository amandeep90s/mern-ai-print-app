import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import bannerImage from '@/assets/banner.png';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getListingQueryFn, getProducts } from '@/lib/api';
import { PROTECTED_ROUTES } from '@/routes/routes';

export default function HomePage() {
  const { data: productData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: listingData, isLoading: isListingLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: getListingQueryFn,
  });

  const listings = listingData?.listings ?? [];
  const catalogProducts = productData?.products?.catalog || [];
  const featuredProducts = productData?.products?.featured || [];

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-3 pb-10 xl:p-0">
        {/* Hero / Banner Section */}
        <section className="bg-muted mb-5 overflow-hidden">
          <div
            className="block h-50 flex-1 rounded-lg"
            style={{ background: `url(${bannerImage}) center/cover no-repeat` }}
          />
        </section>

        {/* Starter Essentials Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Starter Essentials</h2>
              <p className="text-muted-foreground text-sm">
                Kickstart your business with these handpicked products that are
                ideal for new sellers.
              </p>
            </div>
            <span className="cursor-pointer text-sm font-medium underline">
              View all
            </span>
          </div>

          {/* Large Card Grid */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-xl"
                  />
                ))
              : catalogProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="ring=0 group aspect-5/6 cursor-pointer rounded-xl border-none! p-0 shadow-lg"
                  >
                    <Link
                      to={PROTECTED_ROUTES.DESIGN.replace(
                        ':product_id',
                        product._id,
                      )}
                      className="relative h-full overflow-hidden rounded-xl"
                    >
                      <img
                        src={product.displayUrl}
                        alt={product.name}
                        className="object-fit h-full w-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  </Card>
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
