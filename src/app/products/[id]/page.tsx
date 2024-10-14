import PriceTag from "@/components/PriceTag";
import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Cache the product to minimize db operations
const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return product;
});
// MetaData - same props as page for consisitancy

export const generateMetadata = async ({
  params: { id },
}: ProductPageProps): Promise<Metadata> => {
  const product = await getProduct(id);
  return {
    title: product.name + " - Pixazon",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
};
const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const product = await getProduct(id);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />

      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p className="py-6">{product.description}</p>
        <AddToCartButton
          incrementProductQuantity={incrementProductQuantity}
          productId={product.id}
        />
      </div>
    </div>
  );
};

export default ProductPage;
