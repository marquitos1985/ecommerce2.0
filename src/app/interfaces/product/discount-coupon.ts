import { Brand } from "../../models/products/brands/brand";
import { Category } from "../../models/products/categories/category";

export interface DiscountCoupon {
    id: string;
    code: string;
    maxMount: number;//Mnto máximo para porcentaje
    discountPercentage: number;
    freeShiping: boolean;
    categoryList: Category[];
    brandList: Brand[];
    startstDate: Date;
    endDate: Date;
    infinitStock: boolean; 
    stock: number;
}
