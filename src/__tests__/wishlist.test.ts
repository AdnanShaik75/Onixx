import { useWishlistStore } from "@/store/wishlist";
import { ALL_PRODUCTS } from "@/lib/data";

beforeEach(() => {
  useWishlistStore.setState({ items: [] });
});

describe("Wishlist Store", () => {
  it("adds an item to the wishlist", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(ALL_PRODUCTS[0]);

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(ALL_PRODUCTS[0].id);
  });

  it("does not add duplicate items", () => {
    const { addItem } = useWishlistStore.getState();
    addItem(ALL_PRODUCTS[0]);
    addItem(ALL_PRODUCTS[0]);

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
  });

  it("removes an item", () => {
    const { addItem, removeItem } = useWishlistStore.getState();
    addItem(ALL_PRODUCTS[0]);
    removeItem(ALL_PRODUCTS[0].id);

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(0);
  });

  it("checks if item is in wishlist", () => {
    const { addItem, isInWishlist } = useWishlistStore.getState();
    addItem(ALL_PRODUCTS[0]);

    expect(isInWishlist(ALL_PRODUCTS[0].id)).toBe(true);
    expect(isInWishlist(ALL_PRODUCTS[1].id)).toBe(false);
  });

  it("toggles item in wishlist", () => {
    const { toggleItem } = useWishlistStore.getState();
    toggleItem(ALL_PRODUCTS[0]);
    expect(useWishlistStore.getState().items).toHaveLength(1);

    toggleItem(ALL_PRODUCTS[0]);
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });
});
