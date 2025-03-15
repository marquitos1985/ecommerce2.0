import { GeneralCharacteristics } from "./characteristics/general-characteristics";

export interface ProductInterface2 {
    id: string;
    brand: string;
    category: string;
    urlImage: string;
    description: string;
    price: number;
    stock: number;
    model: string;
    quantity: number;
    characteristics: GeneralCharacteristics;
    
    
}
