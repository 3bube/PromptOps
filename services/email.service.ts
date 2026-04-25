export class EmailService {
  async sendWelcomeEmail(email: string, fullName?: string): Promise<boolean> {
    try {
      const response = await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName }),
      });

      if (!response.ok) {
        console.error("Failed to send welcome email:", response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return false;
    }
  }
}