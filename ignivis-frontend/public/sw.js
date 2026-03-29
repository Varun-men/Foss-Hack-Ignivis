const HEALTH_TIPS = [
  { title: "💧 Time to Hydrate!", body: "Drink a glass of water to stay ahead of heat stress.", tag: "hydrate" },
  { title: "🌡️ Check Your Heat Risk", body: "It's been a while since your last scan. Run a quick analysis.", tag: "scan" },
  { title: "😴 Rest Reminder", body: "Take a short break if you've been active. Your body needs recovery.", tag: "rest" },
  { title: "☀️ Sun Safety Check", body: "If you're outdoors, seek shade and reapply sunscreen.", tag: "sun" },
  { title: "❤️ Heart Rate Check", body: "Feeling your pulse racing? Slow down and breathe deeply.", tag: "heart" },
  { title: "🧊 Cool Down Alert", body: "Splash some cold water on your wrists and neck to cool down fast.", tag: "cool" },
  { title: "🥗 Nutrition Reminder", body: "Eat water-rich fruits like watermelon or cucumber to stay cool.", tag: "nutrition" },
  { title: "🏠 Environment Check", body: "Make sure your indoor space is well-ventilated and cool.", tag: "environment" },
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const tip = event.data.tip || HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
    self.registration.showNotification(tip.title, {
      body: tip.body,
      icon: "/icon.png",
      badge: "/icon.png",
      tag: tip.tag || "ignivis-health",
      renotify: true,
      vibrate: [100, 50, 100],
      data: { url: "/analysis" },
      actions: [
        { action: "scan", title: "Scan Now" },
        { action: "dismiss", title: "Dismiss" },
      ],
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate("/analysis");
          return;
        }
      }
      return self.clients.openWindow("/analysis");
    })
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
