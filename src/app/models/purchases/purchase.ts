

export interface Purchase {
  purchaseId: number; 
  clienteId: string | null;
  productos: {
    id: string;
    quantity: number;
    price: number;
    brand: string;
    model: string;
  }[];
  fecha: Date;
  total: number;
  productosCargados?: { cantidad: number; precio: number; brand: string }[];
  
}
