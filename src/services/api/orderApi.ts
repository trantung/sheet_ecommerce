const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL_API;

export interface OrderProduct {
    sku: string;
    name: string;
    price: string;
    quantity: number;
    id: number;
}

export interface OrderData {
    order_no: string;
    name: string;
    email: string;
    phone: string;
    note: string;
    address: string;
    discount_coupon: string;
    currency: string;
    discount: string;
    subtotal: string;
    shipping: string;
    total: string;
    method: string;
    status: number;
    products: OrderProduct[];
    created_at: string;
    updated_at: string;
    id: number;
}

export interface OrderApiResponse {
    success: boolean;
    status: number;
    message: string | null;
    data: OrderData;
}

export interface CreateOrderRequest {
    cart_token?: string;
    name: string;
    email: string;
    phone: string;
    note: string;
    address: string;
    currency: string;
    shipping: number;
    discount: number;
    discount_coupon: string;
    method: string;
}

class OrderApi {
    private baseUrl: string;

    constructor() {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }
        this.baseUrl = API_BASE_URL as string;
    }

    // Create order
    async createOrder(orderData: CreateOrderRequest): Promise<OrderApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/order/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: OrderApiResponse = await response.json();
            return result;
        } catch (error) {
            console.error('Create order failed:', error);
            throw error;
        }
    }
}

export const orderApi = new OrderApi();
