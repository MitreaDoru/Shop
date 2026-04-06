import type { IngredientRecived } from "./ingredients";

export interface OrderItem {
  _id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  ingredients: IngredientRecived[];
}
export type Order = {
  _id: string;
  email: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
};
