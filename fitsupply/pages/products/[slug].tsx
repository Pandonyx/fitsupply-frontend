import { useRouter } from "next/router";
import useSWR from "swr";
import api from "@/lib/apiClient";
import Image from "next/image";
import { Product } from "@/types";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function ProductDetail() {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data: product, error } = useSWR<Product>(
    () => (slug ? `/products?slug=${slug}` : null),
    fetcher
  );

  if (!product) return <div className='p-6'>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  return (
    <main className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <div className='w-full h-96 relative'>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <p className='text-xl font-semibold mt-2'>
            ${product.price.toFixed(2)}
          </p>
          <p className='mt-4 text-gray-700'>{product.description}</p>
          <div className='mt-6'>
            <button className='bg-black text-white px-4 py-2 rounded'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
