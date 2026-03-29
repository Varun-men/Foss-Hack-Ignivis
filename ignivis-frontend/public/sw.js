// Ignivis Health Notification Service Worker
// This runs in the background (while browser is open) and handles notification display

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

// Handle notification display requests from the main thread
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

// Handle notification clicks — open the analysis page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  // Open or focus the analysis page
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // If an Ignivis tab is already open, focus it and navigate
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate("/analysis");
          return;
        }
      }
      // Otherwise, open a new tab
      return self.clients.openWindow("/analysis");
    })
  );
});

// Install — activate immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate — claim all clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
