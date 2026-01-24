const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL_API;

export interface CartProduct {
    sku: string;
    name: string;
    price: string;
    quantity: number;
    product_id: number;
    thumbnail?: string;
}

export interface CartData {
    products: CartProduct[];
    subtotal: number;
    count: number;
    cart_id: string;
}

export interface CartApiResponse {
    success: boolean;
    status: number;
    message: string | null;
    data: CartData;
}

class CartApi {
    private baseUrl: string;
    private cartIdKey = 'cart_id';

    constructor() {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }
        this.baseUrl = API_BASE_URL as string;
    }

    // Get cart ID from localStorage
    private getCartId(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.cartIdKey);
    }

    // Save cart ID to localStorage
    private saveCartId(cartId: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.cartIdKey, cartId);
    }

    // Add product to cart
    async addToCart(sku: string, quantity: number): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/add`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sku, quantity }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: CartApiResponse = await response.json();

            // Save cart ID
            if (result.success && result.data.cart_id) {
                this.saveCartId(result.data.cart_id);
            }

            return result;
        } catch (error) {
            console.error('Add to cart failed:', error);
            throw error;
        }
    }

    // Remove product from cart
    async removeFromCart(sku: string): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/remove`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sku }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: CartApiResponse = await response.json();

            // Update cart ID
            if (result.success && result.data.cart_id) {
                this.saveCartId(result.data.cart_id);
            }

            return result;
        } catch (error) {
            console.error('Remove from cart failed:', error);
            throw error;
        }
    }

    // Update cart product quantity
    async updateCart(sku: string, quantity: number): Promise<CartApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/cart/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sku, quantity }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: CartApiResponse = await response.json();

            // Update cart ID
            if (result.success && result.data.cart_id) {
                this.saveCartId(result.data.cart_id);
            }

            return result;
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
                body: '',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: CartApiResponse = await response.json();

            // Update cart ID
            if (result.success && result.data.cart_id) {
                this.saveCartId(result.data.cart_id);
            }

            return result;
        } catch (error) {
            console.error('Get cart failed:', error);
            throw error;
        }
    }
}

export const cartApi = new CartApi();
