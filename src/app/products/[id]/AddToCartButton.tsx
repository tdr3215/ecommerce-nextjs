"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import shoppingCartIcon from "@/assets/icons8-add-to-cart-32.png"
interface AddToCartButtonProps {
  productId: string;
  incrementProductQuantity: (id: string) => void;
}
const AddToCartButton = ({
  productId,
  incrementProductQuantity,
}: AddToCartButtonProps) => {

  //`Start transition` work around for passing server action to client component via props
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={() => {
          setSuccess(false);
          startTransition(
            async () => await incrementProductQuantity(productId),
          );
          setSuccess(true);
        }}
      >
        Add to Cart
        <Image
          src={shoppingCartIcon}
          width={32}
          height={32}
          alt="shopping cart icon"
        />
      </button>

      {isPending && (
        <span className="loading loading-spinner loading-md"></span>
      )}
      {!isPending && success && (
        <span className="text-success">Added to cart!</span>
      )}
    </div>
  );
};

export default AddToCartButton;
