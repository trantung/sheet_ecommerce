"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, type CartData, type CartProduct } from '@/services/api/cartApi';

interface CartContextType {
    cart: CartData | null;
    loading: boolean;
    addToCart: (productId: number, variantId: number | null, quantity: number) => Promise<void>;
    removeFromCart: (productId: number, variantId: number | null) => Promise<void>;
    updateCart: (productId: number, variantId: number | null, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch cart on mount
    const refreshCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cartApi.getCart();
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId: number, variantId: number | null, quantity: number) => {
        try {
            setLoading(true);
            const response = await cartApi.addToCart(productId, variantId, quantity);
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId: number, variantId: number | null) => {
        try {
            setLoading(true);
            const response = await cartApi.removeFromCart(productId, variantId);
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateCart = async (productId: number, variantId: number | null, quantity: number) => {
        try {
            setLoading(true);
            const response = await cartApi.updateCart(productId, variantId, quantity);
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Failed to update cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            const response = await cartApi.clearCart();
            if (response.success) {
                setCart(null);
            }
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateCart,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
