// Test script to trigger password reset email
import { auth } from "@/lib/shared/kliv-auth.js";

async function testPasswordReset() {
  try {
    console.log("Testing AliazaStore password reset...");
    console.log("Requesting password reset for: samdiaz894@gmail.com");
    
    const result = await auth.requestPasswordReset("samdiaz894@gmail.com");
    console.log("Password reset request result:", result);
    console.log("✅ Password reset email should be sent to samdiaz894@gmail.com");
    console.log("📧 Check your email inbox for the AliazaStore password reset link");
  } catch (error) {
    console.error("❌ Password reset error:", error);
    console.error("Error details:", error.message);
  }
}

// Run the test
testPasswordReset();
