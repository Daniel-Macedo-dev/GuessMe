import { test, expect } from "@playwright/test";

test.describe("PWA metadata", () => {
  test("manifest link is present in document head", async ({ page }) => {
    await page.goto("/");
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute("href", /manifest\.webmanifest/);
  });

  test("theme-color meta is set to obsidian", async ({ page }) => {
    await page.goto("/");
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute("content", "#070b0f");
  });

  test("apple-touch-icon link is present", async ({ page }) => {
    await page.goto("/");
    const touchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(touchIcon).toHaveCount(1);
  });

  test("Open Graph title matches app identity", async ({ page }) => {
    await page.goto("/");
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", "GuessMe — Dossiê Digital");
  });

  test("description meta is present", async ({ page }) => {
    await page.goto("/");
    const description = page.locator('meta[name="description"]');
    const content = await description.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(20);
  });

  test("page title is set", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GuessMe/);
  });

  test("favicon svg is served", async ({ page }) => {
    const response = await page.request.get("/favicon.svg");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/svg/);
  });

  test("PWA icons are served at required sizes", async ({ page }) => {
    const icon192 = await page.request.get("/icons/icon-192.png");
    expect(icon192.status()).toBe(200);
    expect(icon192.headers()["content-type"]).toMatch(/png/);

    const icon512 = await page.request.get("/icons/icon-512.png");
    expect(icon512.status()).toBe(200);

    const maskable = await page.request.get("/icons/maskable-512.png");
    expect(maskable.status()).toBe(200);
  });

  test("offline fallback page is served", async ({ page }) => {
    const response = await page.request.get("/offline.html");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Você está offline");
    expect(body).toContain("histórico local");
  });
});

test.describe("Offline banner", () => {
  test("banner is not visible when online", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByTestId("offline-banner");
    await expect(banner).not.toBeVisible();
  });

  test("banner appears when browser goes offline", async ({ page }) => {
    await page.goto("/");
    // Simulate offline via Playwright's network emulation
    await page.context().setOffline(true);
    // Trigger the offline event in the page
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    const banner = page.getByTestId("offline-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Offline");
    await expect(banner).toContainText("histórico local");
  });

  test("banner disappears when browser comes back online", async ({ page }) => {
    await page.goto("/");
    await page.context().setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    const banner = page.getByTestId("offline-banner");
    await expect(banner).toBeVisible();

    await page.context().setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await expect(banner).not.toBeVisible();
  });

  test("banner has role=status for screen readers", async ({ page }) => {
    await page.goto("/");
    await page.context().setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    const banner = page.getByTestId("offline-banner");
    await expect(banner).toHaveAttribute("role", "status");
  });

  test("offline banner does not appear at all routes when online", async ({ page }) => {
    for (const route of ["/", "/how-it-works", "/stats"]) {
      await page.goto(route);
      const banner = page.getByTestId("offline-banner");
      await expect(banner).not.toBeVisible();
    }
  });

  test("no horizontal overflow with offline banner visible at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.context().setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    await expect(page.getByTestId("offline-banner")).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });
});

test.describe("Install prompt", () => {
  test("install prompt is not visible without beforeinstallprompt event", async ({ page }) => {
    await page.goto("/");
    const prompt = page.getByTestId("install-prompt");
    await expect(prompt).not.toBeVisible();
  });

  test("install prompt appears after beforeinstallprompt event is fired", async ({ page }) => {
    await page.goto("/");
    // Simulate the browser firing beforeinstallprompt
    await page.evaluate(() => {
      const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt = () => Promise.resolve();
      evt.userChoice = Promise.resolve({ outcome: "dismissed" });
      window.dispatchEvent(evt);
    });
    const prompt = page.getByTestId("install-prompt");
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText("Instalar GuessMe");
  });

  test("dismiss button hides install prompt", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt = () => Promise.resolve();
      evt.userChoice = Promise.resolve({ outcome: "dismissed" });
      window.dispatchEvent(evt);
    });
    const prompt = page.getByTestId("install-prompt");
    await expect(prompt).toBeVisible();
    await page.getByTestId("install-prompt-dismiss").click();
    await expect(prompt).not.toBeVisible();
  });

  test("dismiss button is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt = () => Promise.resolve();
      evt.userChoice = Promise.resolve({ outcome: "dismissed" });
      window.dispatchEvent(evt);
    });
    await expect(page.getByTestId("install-prompt")).toBeVisible();
    await page.getByTestId("install-prompt-dismiss").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("install-prompt")).not.toBeVisible();
  });

  test("install prompt has dialog role", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt = () => Promise.resolve();
      evt.userChoice = Promise.resolve({ outcome: "dismissed" });
      window.dispatchEvent(evt);
    });
    const prompt = page.getByTestId("install-prompt");
    await expect(prompt).toHaveAttribute("role", "dialog");
    await expect(prompt).not.toHaveAttribute("aria-modal");
    await expect(prompt).toHaveAttribute("aria-describedby", "install-prompt-description");
  });

  test("Escape dismisses the prompt while focus is inside it", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt = () => Promise.resolve();
      evt.userChoice = Promise.resolve({ outcome: "dismissed" });
      window.dispatchEvent(evt);
    });
    await page.getByTestId("install-prompt-dismiss").focus();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("install-prompt")).not.toBeVisible();
  });

  test("no horizontal overflow with install prompt visible at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.evaluate(() => {
      const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt = () => Promise.resolve();
      evt.userChoice = Promise.resolve({ outcome: "dismissed" });
      window.dispatchEvent(evt);
    });
    await expect(page.getByTestId("install-prompt")).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });
});
