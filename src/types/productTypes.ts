export interface Item {
  id: number;
  label: string;
  value: number;
  multiplier: number;
}

export interface ProductRequest {
  name: string;
  id: string;
  price: number;
  quantity: number;
  image: string;
  items: Item[];
  ingredients: Item[];
}
