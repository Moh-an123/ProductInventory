export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
