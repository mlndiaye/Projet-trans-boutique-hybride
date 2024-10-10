export interface DashboardStats {
    global_stats: {
      total_products: number;
      total_sales: number;
      low_stock_products: number;
    };
    sales_by_category: Array<{
      name_category: string;
      total_sales: number;
    }>;
    monthly_sales: Array<{
      month: string;
      sales: number;
    }>;
  }