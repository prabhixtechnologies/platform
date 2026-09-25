import { chromium } from "playwright";

const BASE = process.env.SITE_URL || "http://localhost:3002";
const TOKEN = process.env.OWNER_TOKEN;
const API = "http://localhost:8080";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let trackingKey = "";

  page.on("request", (req) => {
    if (req.url().includes("ingest") && req.postData()) {
      try {
        const body = JSON.parse(req.postData());
        if (body.visitorKey) trackingKey = body.visitorKey;
      } catch {
        /* ignore */
      }
    }
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Accept all" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("navigation").getByRole("link", { name: "Pricing" }).click();
  await page.waitForURL("**/pricing");
  await page.waitForTimeout(3000);
  await page.getByRole("link", { name: "Start Growth" }).click();
  await page.waitForURL("**/contact**");
  await page.waitForTimeout(2000);
  await page.getByRole("contentinfo").getByRole("link", { name: "MobiStack" }).click();
  await page.waitForURL("**/products/mobistack");
  await page.waitForTimeout(4000);

  await page.getByRole("button", { name: "Open chat" }).click();
  await page.locator("#chat-name").fill("Final Verify");
  await page.locator("#chat-email").fill("final-verify@prabhixtest.in");
  await page.getByRole("button", { name: "Start chat" }).click();
  await page.waitForTimeout(2000);
  await page.locator("#chat-message").fill("Final verification message");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.waitForTimeout(3000);

  await browser.close();

  if (!TOKEN) {
    console.log("TRACKING_KEY:", trackingKey);
    return;
  }

  const headers = { Authorization: `Bearer ${TOKEN}` };
  await new Promise((r) => setTimeout(r, 1500));

  const live = await fetch(`${API}/api/v1/oneops/visitors/live`, { headers }).then((r) => r.json());
  console.log("LIVE_VISITORS:", JSON.stringify(live, null, 2));

  const visitors = await fetch(`${API}/api/v1/oneops/visitors`, { headers }).then((r) => r.json());
  const tracked = visitors.items?.find((v) => v.externalKey === trackingKey);
  console.log("TRACKING_KEY:", trackingKey);
  console.log("TRACKED_VISITOR:", JSON.stringify(tracked, null, 2));

  if (tracked?.id) {
    const pvs = await fetch(`${API}/api/v1/oneops/visitors/page-views?id=${tracked.id}`, { headers }).then((r) => r.json());
    const events = await fetch(`${API}/api/v1/oneops/visitors/events?id=${tracked.id}`, { headers }).then((r) => r.json());
    console.log("PAGE_VIEWS:", JSON.stringify(pvs, null, 2));
    console.log("EVENTS:", JSON.stringify(events, null, 2));
  }

  const chats = await fetch(`${API}/api/v1/oneops/chat/conversations?queue=unassigned`, { headers }).then((r) => r.json());
  const chat = chats.items?.find((c) => c.visitorEmail === "final-verify@prabhixtest.in");
  console.log("CHAT:", JSON.stringify(chat, null, 2));

  if (chat?.id) {
    await fetch(`${API}/api/v1/oneops/chat/conversations/messages?id=${chat.id}`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ body: "Agent reply — verification complete" }),
    });
    console.log("AGENT_REPLY_SENT");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
