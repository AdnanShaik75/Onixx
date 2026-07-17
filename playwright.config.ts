import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://adnanshaik75.github.io/Onixx";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { browserName: "chromium" },
    },
  ],
});
