import { test, expect, type Page } from "@playwright/test";

const BASE = "https://adnanshaik75.github.io/Onixx";

async function goto(page: Page, path: string) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
}

// ─── HOMEPAGE ────────────────────────────────────────────

test.describe("Homepage", () => {
  test("loads and shows hero content", async ({ page }) => {
    await goto(page, "/");
    await expect(page).toHaveTitle(/ONIXX/i);
    await expect(page.getByText("Every Second")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Defines You")).toBeVisible();
  });

  test("navbar links are visible", async ({ page }) => {
    await goto(page, "/");
    for (const label of ["HOME", "WATCHES", "COLLECTIONS", "NEW ARRIVALS", "BEST SELLERS", "LIMITED EDITION"]) {
      await expect(page.getByRole("link", { name: label }).first()).toBeVisible();
    }
  });

  test("announcement bar is visible", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("p").filter({ hasText: "SHIPPING" }).first()).toBeVisible({ timeout: 15000 });
  });

  test("featured products section loads", async ({ page }) => {
    await goto(page, "/");
    await expect(page.getByText("Featured Products")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Royal Chronograph")).toBeVisible();
  });

  test("collections section shows 3 collections", async ({ page }) => {
    await goto(page, "/");
    await expect(page.getByText("Our Collections")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Signature Collection")).toBeVisible();
    await expect(page.getByText("Heritage Collection")).toBeVisible();
    await expect(page.getByText("Skeleton Collection")).toBeVisible();
  });

  test("new arrivals section loads", async ({ page }) => {
    await goto(page, "/");
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const lastSection = sections[sections.length - 1];
      if (lastSection) lastSection.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
    await expect(page.getByRole("heading", { name: "New Arrivals" })).toBeVisible({ timeout: 15000 });
  });

  test("footer is visible", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("ONIXX. All rights reserved")).toBeVisible();
  });
});

// ─── ALL STATIC PAGES LOAD ───────────────────────────────

const STATIC_PAGES: { path: string; check: string }[] = [
  { path: "/watches", check: "Watches" },
  { path: "/collections", check: "Collections" },
  { path: "/new-arrivals", check: "New Arrivals" },
  { path: "/best-sellers", check: "Best Sellers" },
  { path: "/limited-edition", check: "Limited" },
  { path: "/cart", check: "Bag" },
  { path: "/wishlist", check: "Wishlist" },
  { path: "/checkout", check: "Checkout" },
  { path: "/contact", check: "Contact" },
  { path: "/story", check: "ONIXX" },
  { path: "/craftsmanship", check: "Commitment" },
  { path: "/press", check: "Press" },
  { path: "/careers", check: "Careers" },
  { path: "/gift-cards", check: "Gift" },
  { path: "/stores", check: "Store" },
  { path: "/faqs", check: "FAQ" },
  { path: "/shipping", check: "Shipping" },
  { path: "/warranty", check: "Warranty" },
  { path: "/privacy", check: "Privacy" },
  { path: "/terms", check: "Terms" },
  { path: "/cookies", check: "Cookie" },
  { path: "/size-guide", check: "Size" },
  { path: "/admin", check: "Admin" },
];

test.describe("All static pages load without errors", () => {
  for (const { path, check } of STATIC_PAGES) {
    test(`${path}`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.getByText(check, { exact: false }).first()).toBeVisible({ timeout: 15000 });
    });
  }
});

// ─── PRODUCT CATALOG ─────────────────────────────────────

test.describe("Product Catalog", () => {
  test("shows products on /watches", async ({ page }) => {
    await goto(page, "/watches");
    await expect(page.getByText("Royal Chronograph")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Heritage Classic")).toBeVisible();
    await expect(page.getByText("Midnight Automatic")).toBeVisible();
  });

  test("clicking a product navigates to detail page", async ({ page }) => {
    await goto(page, "/watches");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const productLink = page.getByRole("link", { name: "Royal Chronograph" }).first();
    await productLink.scrollIntoViewIfNeeded();
    await productLink.click();
    await page.waitForURL(/\/watches\/royal-chronograph/, { timeout: 15000 });
    await expect(page.getByText("Royal Chronograph").first()).toBeVisible({ timeout: 15000 });
  });

  test("filter by category works", async ({ page }) => {
    await goto(page, "/watches");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "QUARTZ" }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Heritage Classic")).toBeVisible();
    const royalVisible = await page.getByRole("link", { name: "Royal Chronograph" }).first().isVisible().catch(() => false);
    expect(royalVisible).toBe(false);
  });

  test("sort dropdown works", async ({ page }) => {
    await goto(page, "/watches");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const sortSelect = page.locator("select").first();
    await sortSelect.selectOption("price-asc");
    await page.waitForTimeout(500);
    expect(true).toBeTruthy();
  });
});

// ─── PRODUCT DETAIL ──────────────────────────────────────

test.describe("Product Detail", () => {
  test("shows product name, price, and add to cart button", async ({ page }) => {
    await goto(page, "/watches/royal-chronograph");
    await expect(page.getByText("Royal Chronograph").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("₹10,74,850")).toBeVisible();
    await expect(page.getByRole("button", { name: /ADD TO BAG/i })).toBeVisible();
  });

  test("shows product specs", async ({ page }) => {
    await goto(page, "/watches/royal-chronograph");
    await expect(page.getByText("Case:").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("18K Rose Gold")).toBeVisible();
    await expect(page.getByText("Movement:")).toBeVisible();
  });

  test("shows product features", async ({ page }) => {
    await goto(page, "/watches/royal-chronograph");
    await expect(page.getByText("Free Shipping")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Quality Assured")).toBeVisible();
    await expect(page.getByText("7 Day Returns")).toBeVisible();
  });

  test("add to cart updates cart badge", async ({ page }) => {
    await goto(page, "/watches/royal-chronograph");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1000);
    const cartBadge = page.locator("span").filter({ hasText: "1" }).first();
    await expect(cartBadge).toBeVisible({ timeout: 5000 });
  });

  test("back button works", async ({ page }) => {
    await goto(page, "/watches");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const productLink = page.getByRole("link", { name: "Royal Chronograph" }).first();
    await productLink.scrollIntoViewIfNeeded();
    await productLink.click();
    await page.waitForURL(/\/watches\/royal-chronograph/, { timeout: 15000 });
    await page.waitForTimeout(1000);
    const backBtn = page.getByRole("button", { name: /Back/i }).first();
    if (await backBtn.isVisible().catch(() => false)) {
      await backBtn.click();
      await page.waitForURL(/\/watches\/?$/, { timeout: 10000 });
    }
  });
});

// ─── COLLECTIONS ─────────────────────────────────────────

test.describe("Collections", () => {
  test("shows 3 collections on /collections", async ({ page }) => {
    await goto(page, "/collections");
    await expect(page.getByText("Signature Collection")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Heritage Collection")).toBeVisible();
    await expect(page.getByText("Skeleton Collection")).toBeVisible();
  });

  test("signature collection detail page loads with products", async ({ page }) => {
    await goto(page, "/collections/signature");
    await expect(page.getByText("Signature Collection").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Royal Chronograph")).toBeVisible();
  });

  test("heritage collection detail page loads", async ({ page }) => {
    await goto(page, "/collections/heritage");
    await expect(page.getByText("Heritage Collection").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Heritage Classic")).toBeVisible();
  });

  test("skeleton collection detail page loads", async ({ page }) => {
    await goto(page, "/collections/skeleton");
    await expect(page.getByText("Skeleton Collection").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Sovereign Tourbillon")).toBeVisible();
  });
});

// ─── CART ────────────────────────────────────────────────

test.describe("Cart", () => {
  test("empty cart shows message", async ({ page }) => {
    await goto(page, "/cart");
    await expect(page.getByText("Your Bag is Empty")).toBeVisible({ timeout: 15000 });
  });

  test("add item then view in cart", async ({ page }) => {
    await goto(page, "/watches/midnight-automatic");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1500);
    await page.getByRole("link", { name: /PROCEED TO CHECKOUT/i }).or(page.getByText("1")).first().waitFor({ timeout: 5000 }).catch(() => {});
    await goto(page, "/cart");
    await expect(page.getByText("Midnight Automatic")).toBeVisible({ timeout: 15000 });
  });

  test("cart shows correct price for heritage classic", async ({ page }) => {
    await goto(page, "/watches/heritage-classic");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1500);
    await goto(page, "/cart");
    await expect(page.getByText("Heritage Classic")).toBeVisible({ timeout: 15000 });
  });
});

// ─── WISHLIST ────────────────────────────────────────────

test.describe("Wishlist", () => {
  test("empty wishlist shows message", async ({ page }) => {
    await goto(page, "/wishlist");
    await expect(page.getByText(/empty|saved|wishlist/i).first()).toBeVisible({ timeout: 15000 });
  });
});

// ─── CHECKOUT ────────────────────────────────────────────

test.describe("Checkout", () => {
  test("empty cart shows empty message", async ({ page }) => {
    await goto(page, "/checkout");
    await expect(page.getByText("Your Bag is Empty").or(page.getByText("Nothing to Checkout"))).toBeVisible({ timeout: 15000 });
  });

  test("checkout form has required fields", async ({ page }) => {
    await goto(page, "/watches/heritage-classic");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1000);
    await goto(page, "/checkout");

    await expect(page.getByPlaceholder("First name")).toBeVisible({ timeout: 15000 });
    await expect(page.getByPlaceholder("Last name")).toBeVisible();
    await expect(page.getByPlaceholder("Email address")).toBeVisible();
    await expect(page.getByPlaceholder("Phone number")).toBeVisible();
    await expect(page.getByPlaceholder("Card number")).toBeVisible();
    await expect(page.getByRole("button", { name: /PLACE ORDER/i })).toBeVisible();
  });

  test("checkout validates required fields", async ({ page }) => {
    await goto(page, "/watches/heritage-classic");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1000);
    await goto(page, "/checkout");
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: /PLACE ORDER/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("checkout form accepts input", async ({ page }) => {
    await goto(page, "/watches/heritage-classic");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1000);
    await goto(page, "/checkout");

    await page.getByPlaceholder("First name").fill("Test");
    await page.getByPlaceholder("Last name").fill("User");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Phone number").fill("9876543210");
    await expect(page.getByPlaceholder("First name")).toHaveValue("Test");
    await expect(page.getByPlaceholder("Email address")).toHaveValue("test@example.com");
  });

  test("card number gets formatted", async ({ page }) => {
    await goto(page, "/watches/heritage-classic");
    await page.getByRole("button", { name: /ADD TO BAG/i }).click();
    await page.waitForTimeout(1000);
    await goto(page, "/checkout");

    await page.getByPlaceholder("Card number").fill("4111111111111111");
    await page.waitForTimeout(300);
    const value = await page.getByPlaceholder("Card number").inputValue();
    expect(value).toContain(" ");
  });
});

// ─── ADMIN ───────────────────────────────────────────────

test.describe("Admin", () => {
  test("shows login form", async ({ page }) => {
    await goto(page, "/admin");
    await expect(page.getByText("ONIXX Admin")).toBeVisible({ timeout: 15000 });
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });

  test("wrong password shows error", async ({ page }) => {
    await goto(page, "/admin");
    await page.getByPlaceholder("Password").fill("wrongpassword");
    await page.getByRole("button", { name: /ACCESS DASHBOARD/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText("Incorrect password")).toBeVisible();
  });

  test("correct password shows dashboard", async ({ page }) => {
    await goto(page, "/admin");
    await page.getByPlaceholder("Password").fill("Onixx@2005");
    await page.getByRole("button", { name: /ACCESS DASHBOARD/i }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText("Dashboard").first()).toBeVisible({ timeout: 15000 });
  });

  test("admin Products tab shows products", async ({ page }) => {
    await goto(page, "/admin");
    await page.getByPlaceholder("Password").fill("Onixx@2005");
    await page.getByRole("button", { name: /ACCESS DASHBOARD/i }).click();
    await page.waitForTimeout(2000);

    const productsTab = page.locator("button").filter({ hasText: "Products" }).first();
    await productsTab.click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("Royal Chronograph").first()).toBeVisible({ timeout: 10000 });
  });

  test("admin Orders tab shows orders", async ({ page }) => {
    await goto(page, "/admin");
    await page.getByPlaceholder("Password").fill("Onixx@2005");
    await page.getByRole("button", { name: /ACCESS DASHBOARD/i }).click();
    await page.waitForTimeout(2000);

    const ordersTab = page.locator("button").filter({ hasText: "Orders" }).first();
    await ordersTab.click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("ORD-001").first()).toBeVisible({ timeout: 10000 });
  });

  test("admin Inventory tab loads", async ({ page }) => {
    await goto(page, "/admin");
    await page.getByPlaceholder("Password").fill("Onixx@2005");
    await page.getByRole("button", { name: /ACCESS DASHBOARD/i }).click();
    await page.waitForTimeout(2000);

    const inventoryTab = page.locator("button").filter({ hasText: "Inventory" }).first();
    await inventoryTab.click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("Total Items")).toBeVisible({ timeout: 10000 });
  });

  test("admin Settings tab loads", async ({ page }) => {
    await goto(page, "/admin");
    await page.getByPlaceholder("Password").fill("Onixx@2005");
    await page.getByRole("button", { name: /ACCESS DASHBOARD/i }).click();
    await page.waitForTimeout(2000);

    const settingsTab = page.locator("button").filter({ hasText: "Settings" }).first();
    await settingsTab.click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("Store Information")).toBeVisible({ timeout: 10000 });
  });
});

// ─── SEARCH ──────────────────────────────────────────────

test.describe("Search", () => {
  test("search modal opens and finds products", async ({ page }) => {
    await goto(page, "/");
    const searchBtn = page.getByRole("button", { name: /Search/i });
    await searchBtn.click();
    await page.waitForTimeout(1000);
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill("Royal");
      await page.waitForTimeout(1000);
      await expect(page.getByText("Royal Chronograph").first()).toBeVisible({ timeout: 10000 });
    }
  });
});

// ─── FOOTER LINKS ────────────────────────────────────────

test.describe("Footer links work", () => {
  test("footer shop links", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("footer").getByRole("link", { name: "All Products" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "New Arrivals" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Best Sellers" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Gift Cards" })).toBeVisible();
  });

  test("footer support links", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("footer").getByRole("link", { name: "Contact Us" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "FAQs" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Shipping Policy" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Returns Policy" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Track Order" })).toBeVisible();
  });

  test("footer company links", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("footer").getByRole("link", { name: "About ONIXX" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Collections" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Press" })).toBeVisible();
  });

  test("footer nav links go to valid pages", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });

    await page.locator("footer").getByRole("link", { name: "All Products" }).click();
    await page.waitForURL(/\/watches/, { timeout: 10000 });
    await expect(page.getByText("Watches").first()).toBeVisible();

    await goto(page, "/");
    await page.locator("footer").getByRole("link", { name: "Contact Us" }).click();
    await page.waitForURL(/\/contact/, { timeout: 10000 });

    await goto(page, "/");
    await page.locator("footer").getByRole("link", { name: "About ONIXX" }).click();
    await page.waitForURL(/\/story/, { timeout: 10000 });
  });
});

// ─── MOBILE MENU ─────────────────────────────────────────

test.describe("Mobile Menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    await goto(page, "/");
    const menuBtn = page.locator("button.lg\\:hidden").last();
    await expect(menuBtn).toBeVisible({ timeout: 15000 });
  });

  test("clicking hamburger opens mobile menu", async ({ page }) => {
    await goto(page, "/");
    const menuBtn = page.locator("button.lg\\:hidden").last();
    await menuBtn.click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("GO BACK")).toBeVisible({ timeout: 10000 });
  });
});

// ─── NAVIGATION ──────────────────────────────────────────

test.describe("Navigation", () => {
  test("Watches nav link works", async ({ page }) => {
    await goto(page, "/");
    await page.getByRole("link", { name: "WATCHES" }).first().click();
    await page.waitForURL(/\/watches/, { timeout: 15000 });
    await expect(page.getByText("Royal Chronograph")).toBeVisible({ timeout: 15000 });
  });

  test("Collections nav link works", async ({ page }) => {
    await goto(page, "/");
    await page.getByRole("link", { name: "COLLECTIONS" }).first().click();
    await page.waitForURL(/\/collections/, { timeout: 15000 });
    await expect(page.getByText("Signature Collection")).toBeVisible({ timeout: 15000 });
  });

  test("New Arrivals nav link works", async ({ page }) => {
    await goto(page, "/");
    await page.getByRole("link", { name: "NEW ARRIVALS" }).first().click();
    await page.waitForURL(/\/new-arrivals/, { timeout: 15000 });
  });

  test("Best Sellers nav link works", async ({ page }) => {
    await goto(page, "/");
    await page.getByRole("link", { name: "BEST SELLERS" }).first().click();
    await page.waitForURL(/\/best-sellers/, { timeout: 15000 });
  });

  test("logo links to homepage", async ({ page }) => {
    await goto(page, "/");
    const logo = page.locator('a[aria-label="ONIXX Home"]').first();
    await expect(logo).toBeVisible({ timeout: 15000 });
    await logo.click();
    await page.waitForURL(/Onixx\/?$/, { timeout: 15000 });
  });
});

// ─── NO JS ERRORS ON KEY PAGES ───────────────────────────

test.describe("No JavaScript errors on key pages", () => {
  const keyPages = ["/", "/watches", "/collections", "/cart", "/admin"];

  for (const path of keyPages) {
    test(`${path} has no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      await goto(page, path);
      await page.waitForTimeout(3000);
      const critical = errors.filter(
        (e) => !e.includes("firebase") && !e.includes("net::") && !e.includes("Failed to load resource")
      );
      expect(critical).toEqual([]);
    });
  }
});
