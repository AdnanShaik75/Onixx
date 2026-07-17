import { ALL_PRODUCTS, COLLECTIONS, getProduct, getProductsByCollection, getCollection } from "@/lib/data";

describe("Data", () => {
  it("has 12 products", () => {
    expect(ALL_PRODUCTS).toHaveLength(12);
  });

  it("has 3 collections", () => {
    expect(COLLECTIONS).toHaveLength(3);
  });

  it("getProduct returns a product by id", () => {
    const product = getProduct("royal-chronograph");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Royal Chronograph");
  });

  it("getProduct returns undefined for unknown id", () => {
    const product = getProduct("nonexistent");
    expect(product).toBeUndefined();
  });

  it("getProductsByCollection filters correctly", () => {
    const signature = getProductsByCollection("signature");
    expect(signature.length).toBeGreaterThan(0);
    signature.forEach((p) => {
      expect(p.collection).toBe("signature");
    });
  });

  it("getCollection returns a collection by id", () => {
    const collection = getCollection("heritage");
    expect(collection).toBeDefined();
    expect(collection?.title).toBe("Heritage Collection");
  });

  it("getCollection returns undefined for unknown id", () => {
    const collection = getCollection("nonexistent");
    expect(collection).toBeUndefined();
  });

  it("all products have required fields", () => {
    ALL_PRODUCTS.forEach((product) => {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image).toBeTruthy();
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.description).toBeTruthy();
      expect(product.specs.length).toBeGreaterThan(0);
    });
  });
});
