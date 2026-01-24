"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, type CartData, type CartProduct } from '@/services/api/cartApi';

interface CartContextType {
    cart: CartData | null;
    loading: boolean;
    addToCart: (sku: string, quantity: number) => Promise<void>;
    removeFromCart: (sku: string) => Promise<void>;
    updateCart: (sku: string, quantity: number) => Promise<void>;
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

    const addToCart = async (sku: string, quantity: number) => {
        try {
            setLoading(true);
            const response = await cartApi.addToCart(sku, quantity);
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

    const removeFromCart = async (sku: string) => {
        try {
            setLoading(true);
            const response = await cartApi.removeFromCart(sku);
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

    const updateCart = async (sku: string, quantity: number) => {
        try {
            setLoading(true);
            const response = await cartApi.updateCart(sku, quantity);
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

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateCart,
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
