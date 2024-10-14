import { cookies } from "next/headers"
import prisma from "./prisma"
import { Cart, CartItem, Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"


// Import current Cart w/ products
export type CartWithProducts = Prisma.CartGetPayload<{
    include: {
        items: { include: { product: true } }
    }
}>

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: { product: true };

}>;
// ShoppingCart Type

export type ShoppingCart = CartWithProducts &
{
    size: number,
    subtotal: number
}

// GET: Cart
export const getCart = async (): Promise<ShoppingCart | null> => {
    const session = await getServerSession(authOptions)
    let cart: CartWithProducts | null = null
    if (session) {
        cart = await prisma.cart.findFirst({
            where: { userId: session.user.id }, include: {
                items: { include: { product: true } }
            }
        })
    } else {
        const localCartId = cookies().get("localCartId")?.value
        cart = localCartId
            ? await prisma.cart.findUnique({
                where: { id: localCartId }, include: {
                    items: { include: { product: true } }
                }
            })
            : null
    }

    if (!cart) return null

    return {
        ...cart
        ,
        size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0)
    }

}

// POST: Create Cart
export const createCart = async (): Promise<ShoppingCart> => {
    const session = await getServerSession(authOptions)
    let newCart: Cart

    if (session) {
        newCart = await prisma.cart.create({ data: { userId: session.user.id } })
    } else {
        newCart = await prisma.cart.create({
            data: {}
        })
        cookies().set("localCartId", newCart.id)

    }


    // ! Note: needs encryption for deployed server #safety
    return {
        ...newCart,
        size: 0,
        items: [],
        subtotal: 0
    }
}

// DB TRANSACTIONS FOR MERGING GUEST => AUTHENTICATED USER CARTS

export const mergeGuestCartIntoUserCart = async (userId: string) => {
    const localCartId = cookies().get("localCartId")?.value
    const localCart = localCartId
        ? await prisma.cart.findUnique({
            where: { id: localCartId }, include: {
                items: true
            }
        })
        : null

    if (!localCart) return
    const userCart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: true }
    })

    await prisma.$transaction(async (tx) => {
        if (userCart) {
            const mergedCartItems = mergeCartItems(localCart.items, userCart.items)
            await tx.cartItem.deleteMany({ where: { cartId: userCart.id } })
            await tx.cart.update({
                where: {
                    id: userCart.id
                },
                data: {
                    items: {
                        createMany: {
                            data: mergedCartItems.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity
                            }))
                        }
                    }
                }
            })

        } else {
            await tx.cart.create({
                data: {
                    userId,
                    items: {
                        createMany: {
                            data: localCart.items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity
                            }))
                        }
                    }
                }
            })
        }
        await tx.cart.delete({
            where: {
                id: localCart.id
            }
        })

        cookies().set("localCartId", "")
    })
}

function mergeCartItems(...cartsItems: CartItem[][]) {
    return cartsItems.reduce((acc, items) => {
        items.forEach(item => {
            const existingItem = acc.find((i) => i.productId === item.productId)
            if (existingItem) {
                existingItem.quantity += item.quantity
            } else {
                acc.push(item)
            }
        })
        return acc
    }, [] as CartItem[])
}
