/**
 * Keep-alive pour éviter que Render mette le service en veille
 * Ping automatique toutes les 14 minutes
 */

export const startKeepAlive = (url) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("⏭️  Keep-alive désactivé en développement");
    return;
  }

  const INTERVAL = 14 * 60 * 1000; // 14 minutes

  setInterval(async () => {
    try {
      const response = await fetch(url);
      console.log(`🏓 Keep-alive ping: ${response.status}`);
    } catch (error) {
      console.error("❌ Keep-alive ping failed:", error.message);
    }
  }, INTERVAL);

  console.log(`✅ Keep-alive activé: ping toutes les 14 minutes sur ${url}`);
};
