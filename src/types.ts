export const categories = ["apparel", "print", "stickers", "other"] as const;

export type Category = (typeof categories)[number];

export type Stamp = "burst" | "hex" | "bar" | "circle";

export type Artist = {
  id: string;
  name: string;
  city: string;
  bio: string;
};

export type Product = {
  id: string;
  title: string;
  artistId: string;
  category: Category;
  price: number;
  compareAt?: number;
  stamp: Stamp;
  salePattern?: boolean;
  sizes?: string[];
  description: string;
  image?: string;
  maker?: string;
  featured?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "designer" | "collector";
};

export type CartItem = {
  productId: string;
  qty: number;
  size?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  name: string;
  email: string;
  city: string;
  note: string;
  createdAt: string;
};

export type Filters = {
  min: string;
  max: string;
  categories: Category[];
  sizes: string[];
};

export const emptyFilters: Filters = {
  min: "",
  max: "",
  categories: [],
  sizes: [],
};

export const apparelSizes = ["XS", "S", "M", "L", "XL"];
