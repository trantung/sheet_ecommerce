const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL_API;

export interface CartProduct {
    product_id: number;
    variant_id: number | null;
    sku: string;
    name: string;
    price: string;
    quantity: number;
    thumbnail?: string;
}

export interface CartData {
    items: CartProduct[];
    subtotal: number;
    count: number;
    updated_at: string;
}

export interface CartApiResponse {
    success: boolean;
    status: number;
    message: string | null;
    data: CartData;
}

class CartApi {
    private baseUrl: string;

    constructor() {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }
        this.baseUrl = API_BASE_URL as string;
    }

    // Add product to cart
    async addToCart(productId: number, variantId: number | null, qty: number): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/add`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: productId,
                    variant_id: variantId,
                    qty
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Add to cart failed:', error);
            throw error;
        }
    }

    // Remove product from cart
    async removeFromCart(productId: number, variantId: number | null): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/remove`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: productId,
                    variant_id: variantId
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Remove from cart failed:', error);
            throw error;
        }
    }

    // Update cart product quantity
    async updateCart(productId: number, variantId: number | null, qty: number): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: productId,
                    variant_id: variantId,
                    qty
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update cart failed:', error);
            throw error;
        }
    }

    // Get current cart
    async getCart(): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get cart failed:', error);
            throw error;
        }
    }

    // Clear cart
    async clearCart(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/clear`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Clear cart failed:', error);
            throw error;
        }
    }
}

export const cartApi = new CartApi();
