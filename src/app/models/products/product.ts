import { BADNAME } from "node:dns";
import { Brand } from "./brands/brand";
import { Category } from "./categories/category";

export class Product {
    private id: number;
    private brand: Brand;
    private category: Category;
    private description: string;
    private price: number;
    private stock: number;
    private characteristics: string;
    private model: string;
    private image: string;

	constructor(){
            this.id = 0; // Valor por defecto
            this.brand = Brand.NONE;
            this.category = Category.NONE;
            this.image = "";
            this.description = '';
            this.price = 0;
            this.stock = 0;
            this.characteristics = '';
            this.model = '';
	}

    public getId(): number
    {
        return this.id;
    }

    public setId(id: number) {
        this.id = id;
    }

    public getBrand(): Brand
    {
        return this.brand;
    }

    public setBrand(brand: Brand) {
        this.brand = brand;
    }

    public getCategory(): Category
    {
        return this.category;
    }

    public setCategory(category: Category) {
        this.category = category;
    }

     public getImage(): string
    {
        return this.image;
    }

    public setImage(image: string) {
        this.image = image;
    }  

    public getDescription(): string
 {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getPrice(): number
 {
        return this.price;
    }

    public setPrice(price: number) {
        this.price = price;
    }

    public getStock(): number
 {
        return this.stock;
    }

    public setStock(stock: number) {
        this.stock = stock;
    }

    public getCharacteristics(): string
 {
        return this.characteristics;
    }

    public setCharacteristics(characteristics: string) {
        this.characteristics = characteristics;
    }

    public getModel(): string {
        return this.model;
    }

    public setModel(model: string) {
        this.model = model;
    }

}
