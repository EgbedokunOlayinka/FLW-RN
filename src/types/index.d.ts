export interface IInventoryItem {
  name: string;
  price: number;
  totalStock: number;
  description: string;
  user: string;
  id: string;
}

export interface IUser {
  email: string;
  password: string;
}
