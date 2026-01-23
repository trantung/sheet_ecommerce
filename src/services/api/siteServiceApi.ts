const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL_API;

export interface SiteInformation {
    property: string;
    value: string;
    code: string;
}

export interface Config {
    dark_mode: number;
    hide_header: number;
    hide_footer: number;
    disable_hero: number;
    collect_email: number;
    about_us: number;
    disable_auto_sync: number;
    feedback_form: number;
    text_center: number;
    small_hero: number;
    grid_content: number;
    pagination_size: number;
    font_family: string;
    published: number;
}

export interface CategoryRelate {
    category_id: number;
    category_name: string;
}

export interface Product {
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    author: string;
    content: string;
    published_date: string;
    status: string;
    price?: string;
    old_price?: string;
    best_selling?: number;
    new_arrival?: number;
    categories_relate: CategoryRelate[];
}

export interface Category {
    category_id: number;
    category_name: string;
    products: Product[];
}

export interface NavbarItem {
    title: string;
    link: string;
    icon?: string;
    target: number;
    nav_bar_id: number;
}

export interface PageItem {
    title: string;
    content: string;
    page_address: string;
    page_width: string;
    menu_title: string;
    menu_type: number;
    target: number;
    show_in_header: number;
    meta_title: string;
    meta_description: string;
    image_share_url: string;
    show_in_search: number;
}

export interface Header {
    nar_bars: NavbarItem[];
    pages: PageItem[];
}

export interface SiteData {
    site_informations: SiteInformation[];
    configs: Config;
    categories: Category[];
    header: Header;
}

export interface ApiResponse {
    status: boolean;
    data: SiteData;
}

class SiteServiceApi {
    private baseUrl: string;

    constructor() {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }
        this.baseUrl = API_BASE_URL as string;
    }

    getSiteInfoByCode(siteInfos: SiteInformation[] | undefined, code: string): string {
        if (!siteInfos || !Array.isArray(siteInfos)) return "";
        const info = siteInfos.find((item) => item.code === code);
        return info?.value || "";
    }

    async get(endpoint = ""): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("GET request failed:", error);
            throw error;
        }
    }

    async post<T = unknown, R = ApiResponse>(endpoint = "", data?: T): Promise<R> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("POST request failed:", error);
            throw error;
        }
    }

    async put<T = unknown, R = ApiResponse>(endpoint: string, data: T): Promise<R> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("PUT request failed:", error);
            throw error;
        }
    }

    async delete<R = ApiResponse>(endpoint: string): Promise<R> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("DELETE request failed:", error);
            throw error;
        }
    }

    async getSiteData(): Promise<ApiResponse> {
        return this.post("/site/index");
    }
}

export const siteServiceApi = new SiteServiceApi();

