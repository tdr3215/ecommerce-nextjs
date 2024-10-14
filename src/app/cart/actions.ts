"use server"

import { createCart, getCart } from "@/lib/db/cart"
import prisma from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

export const setProductQuantity = async (productId: string, quantity: number) => {
    const cart = await getCart() ?? await createCart()
    const itemInCart = cart.items.find(item => item.productId === productId)

    if (quantity === 0) {
        if (itemInCart) {
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: {
                        delete: { id: itemInCart.id }
                    }
                }
            })
        }
    } else {
        if (itemInCart) {

            await prisma.cart.update({
                where: { id: cart.id }, data: {
                    items: {
                        update: {
                            where: {
                                id: itemInCart.id
                            },
                            data: { quantity }
                        }
                    }
                }
            },)
        } else {
            await prisma.cart.update({
                where: { id: cart.id }, data: {
                    items: {
                        create: {
                            productId,
                            quantity
                        }
                    }
                }
            })



        }
    }

    revalidatePath("/cart")
}