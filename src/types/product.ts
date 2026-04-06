import type { IngredientRecived, IngredientSent } from "./ingredients";

export type Product = {
  _id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  ingredients: IngredientRecived[];
};
export type NewProduct = {
  name: string;
  image: string;
  category: string;
  items: IngredientSent[];
  ingredients: IngredientSent[];
};
