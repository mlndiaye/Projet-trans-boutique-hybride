export interface SaleDetails {
    "product_id": number,
    "product_name": string,
    "category_name": string,
    "quantity_sold": number,
    "unit_price": number,
    "total_sales": number,
    "last_sale_date": string
}

export interface Category {
    id_category: number;
    name_category: string;
    description: string;
}

export interface LowStockProduct {
    id_product: number;
    name_product: string;
    stock: number;
    minimum_stock: number;
    category: Category;
  }

export interface DailySale {
    date: string;
    sales: number;
  }
  
export interface WeeklySale {
    date: string;
    sales: number;
  }
  
export interface MonthlySale {
    month: string;
    sales: number;
  }
  
export interface CategorySale {
    name_category: string;
    total_sales: number;
}
  
export interface GlobalStats {
    total_products: number;
    total_sales: number;
    low_stock_products: number;
}

export interface MostViewedProduct {
    name_product: string;
    views_count: number;
}

export interface DashboardStats {
    global_stats: GlobalStats;
    sales_by_category: CategorySale[];
    daily_sales: DailySale[];
    weekly_sales: WeeklySale[];
    monthly_sales: MonthlySale[];
    most_viewed_products: MostViewedProduct[]; 
}