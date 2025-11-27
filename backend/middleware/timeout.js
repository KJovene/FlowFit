/**
 * Middleware de timeout pour éviter les requêtes qui traînent en production
 */
export const requestTimeout = (timeout = 25000) => {
  return (req, res, next) => {
    // Timeout de 25 secondes par défaut (Render free tier timeout = 30s)
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        console.error(`⏱️ Request timeout: ${req.method} ${req.path}`);
        res.status(503).json({
          success: false,
          message: "La requête a pris trop de temps. Veuillez réessayer.",
        });
      }
    }, timeout);

    // Nettoyer le timeout quand la réponse est envoyée
    res.on("finish", () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};

/**
 * Middleware de gestion d'erreurs globale
 */
export const errorHandler = (err, req, res, next) => {
  console.error("💥 Error:", err);

  // Erreurs de connexion DB
  if (
    err.name === "SequelizeConnectionError" ||
    err.name === "SequelizeConnectionRefusedError" ||
    err.parent?.code === "ETIMEDOUT" ||
    err.parent?.code === "ECONNREFUSED"
  ) {
    return res.status(503).json({
      success: false,
      message: "Service temporairement indisponible. Veuillez réessayer.",
    });
  }

  // Erreurs de validation
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: err.errors?.map((e) => e.message),
    });
  }

  // Erreur par défaut
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Une erreur est survenue"
        : err.message,
  });
};
