interface Category {
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