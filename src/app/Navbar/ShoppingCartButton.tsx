"use client"
import { ShoppingCart } from "@/lib/db/cart";
import Image from "next/image";
import React from "react";
import shoppingCartIcon from "@/assets/shopping-cart.png";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}
export const ShoppingCartButton = ({ cart }: ShoppingCartButtonProps) => {
  const closeDropdown = () => {
    const el = document.activeElement as HTMLElement;
    if (el) {
      el.blur();
    }
  };
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-circle btn-ghost btn-md">
        <div className="indicator">
          <Image
            src={shoppingCartIcon}
            width={32}
            height={32}
            alt="shopping cart icon"
          />
          <span className="badge indicator-item badge-sm">
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown dropdown-content card-compact z-30 mt-3 w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="text-info">
            Subtotal: {formatPrice(cart?.subtotal || 0)}
          </span>
          <div className="card-actions">
            <Link
              href={"/cart"}
              className="btn btn-primary btn-block"
              onClick={closeDropdown}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
