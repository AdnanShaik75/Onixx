import { useCartStore } from "@/store/cart";
import { ALL_PRODUCTS } from "@/lib/data";

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("Cart Store", () => {
  it("adds an item to the cart", () => {
    const { addItem } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(ALL_PRODUCTS[0].id);
    expect(items[0].quantity).toBe(1);
  });

  it("increments quantity for duplicate items", () => {
    const { addItem } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);
    addItem(ALL_PRODUCTS[0]);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("removes an item", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);
    removeItem(ALL_PRODUCTS[0].id);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("updates quantity", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);
    updateQuantity(ALL_PRODUCTS[0].id, 5);

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
  });

  it("removes item when quantity is 0", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);
    updateQuantity(ALL_PRODUCTS[0].id, 0);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("clears the cart", () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);
    addItem(ALL_PRODUCTS[1]);
    clearCart();

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("calculates total items", () => {
    const { addItem } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);
    addItem(ALL_PRODUCTS[0]);
    addItem(ALL_PRODUCTS[1]);

    const total = useCartStore.getState().totalItems();
    expect(total).toBe(3);
  });

  it("calculates total price", () => {
    const { addItem } = useCartStore.getState();
    addItem(ALL_PRODUCTS[0]);

    const total = useCartStore.getState().totalPrice();
    expect(total).toBe(ALL_PRODUCTS[0].price);
  });

  it("toggles cart open/close", () => {
    const { openCart, closeCart } = useCartStore.getState();
    openCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
