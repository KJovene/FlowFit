// Script de test pour vérifier l'authentification
// Exécuter avec: node test-auth.js

const API_URL = "http://localhost:4000/api";

async function testRegister() {
  console.log("\n🧪 Test 1: Register");
  console.log("=".repeat(50));

  const userData = {
    username: "testuser" + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: "Test123456",
    passwordConfirm: "Test123456",
  };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("✅ Register réussi!");
      return { token: data.token, user: data.user };
    } else {
      console.log("❌ Register échoué:", data.message);
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log("\n🧪 Test 2: Login");
  console.log("=".repeat(50));

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("✅ Login réussi!");
      return data.token;
    } else {
      console.log("❌ Login échoué:", data.message);
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    return null;
  }
}

async function testGetMe(token) {
  console.log("\n🧪 Test 3: Get Me (Protected Route)");
  console.log("=".repeat(50));

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("✅ GetMe réussi!");
    } else {
      console.log("❌ GetMe échoué:", data.message);
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

async function runTests() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Test de l'API d'authentification FlowFit");
  console.log("=".repeat(50));

  // Test 1: Register
  const registerResult = await testRegister();
  if (!registerResult) {
    console.log("\n❌ Arrêt des tests: Register a échoué");
    return;
  }

  // Attendre un peu
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 2: Login avec le même utilisateur
  const token = await testLogin(registerResult.user.email, "Test123456");
  if (!token) {
    console.log("\n❌ Arrêt des tests: Login a échoué");
    return;
  }

  // Attendre un peu
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 3: GetMe avec le token
  await testGetMe(token);

  console.log("\n" + "=".repeat(50));
  console.log("✅ Tous les tests terminés!");
  console.log("=".repeat(50) + "\n");
}

// Exécuter les tests
runTests().catch((error) => {
  console.error("Erreur globale:", error);
  process.exit(1);
});
