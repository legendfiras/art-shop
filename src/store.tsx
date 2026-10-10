import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { artists as seedArtists, seedProducts } from "./data";
import type { CartItem, Order, Product, User } from "./types";

const STORAGE_KEY = "lets-shop-art";

type State = {
  users: User[];
  sessionId: string | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
};

type Store = State & {
  user: User | null;
  artists: typeof seedArtists;
  signIn: (email: string, password: string) => string | null;
  signUp: (user: Omit<User, "id">) => string | null;
  signOut: () => void;
  becomeDesigner: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (productId: string, size?: string) => void;
  setQty: (productId: string, qty: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  placeOrder: (info: { name: string; email: string; city: string; note: string }) => Order | null;
};

const StoreContext = createContext<Store | null>(null);

function load(): State {
  const empty: State = {
    users: [],
    sessionId: null,
    products: seedProducts,
    cart: [],
    orders: [],
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<State>;
    const custom = (parsed.products ?? []).filter(
      (product) => !seedProducts.some((seed) => seed.id === product.id),
    );
    return {
      users: parsed.users ?? [],
      sessionId: parsed.sessionId ?? null,
      products: [...seedProducts, ...custom],
      cart: parsed.cart ?? [],
      orders: parsed.orders ?? [],
    };
  } catch {
    return empty;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<Store>(() => {
    const user = state.users.find((entry) => entry.id === state.sessionId) ?? null;

    return {
      ...state,
      user,
      artists: seedArtists,
      signIn: (email, password) => {
        const match = state.users.find(
          (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
        );
        if (!match) return "No account matches that email and password.";
        setState((current) => ({ ...current, sessionId: match.id }));
        return null;
      },
      signUp: (next) => {
        if (state.users.some((entry) => entry.email.toLowerCase() === next.email.toLowerCase())) {
          return "An account with that email already exists.";
        }
        const created: User = { ...next, id: crypto.randomUUID() };
        setState((current) => ({
          ...current,
          users: [...current.users, created],
          sessionId: created.id,
        }));
        return null;
      },
      signOut: () => setState((current) => ({ ...current, sessionId: null })),
      becomeDesigner: () => {
        setState((current) => ({
          ...current,
          users: current.users.map((entry) =>
            entry.id === current.sessionId ? { ...entry, role: "designer" } : entry,
          ),
        }));
      },
      saveProduct: (product) => {
        setState((current) => {
          const exists = current.products.some((entry) => entry.id === product.id);
          return {
            ...current,
            products: exists
              ? current.products.map((entry) => (entry.id === product.id ? product : entry))
              : [...current.products, product],
          };
        });
      },
      deleteProduct: (id) => {
        setState((current) => ({
          ...current,
          products: current.products.filter((entry) => entry.id !== id),
          cart: current.cart.filter((entry) => entry.productId !== id),
        }));
      },
      addToCart: (productId, size) => {
        setState((current) => {
          const index = current.cart.findIndex(
            (entry) => entry.productId === productId && entry.size === size,
          );
          if (index === -1) {
            return { ...current, cart: [...current.cart, { productId, qty: 1, size }] };
          }
          const cart = current.cart.map((entry, entryIndex) =>
            entryIndex === index ? { ...entry, qty: entry.qty + 1 } : entry,
          );
          return { ...current, cart };
        });
      },
      setQty: (productId, qty, size) => {
        setState((current) => ({
          ...current,
          cart:
            qty <= 0
              ? current.cart.filter((entry) => !(entry.productId === productId && entry.size === size))
              : current.cart.map((entry) =>
                  entry.productId === productId && entry.size === size ? { ...entry, qty } : entry,
                ),
        }));
      },
      removeFromCart: (productId, size) => {
        setState((current) => ({
          ...current,
          cart: current.cart.filter((entry) => !(entry.productId === productId && entry.size === size)),
        }));
      },
      clearCart: () => setState((current) => ({ ...current, cart: [] })),
      placeOrder: (info) => {
        if (!user || state.cart.length === 0) return null;
        const total = state.cart.reduce((sum, item) => {
          const product = state.products.find((entry) => entry.id === item.productId);
          return sum + (product?.price ?? 0) * item.qty;
        }, 0);
        const order: Order = {
          id: crypto.randomUUID(),
          userId: user.id,
          items: state.cart,
          total,
          ...info,
          createdAt: new Date().toISOString(),
        };
        setState((current) => ({
          ...current,
          orders: [order, ...current.orders],
          cart: [],
        }));
        return order;
      },
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within StoreProvider");
  return store;
}
