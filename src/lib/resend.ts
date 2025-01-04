import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  verificationCode: string
) {
  try {
    const x = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "",
      react: EmailTemplate({ verify: { email, verificationCode } }),
    });

    return {
      success: true,
      message: "Verification has been send to your email-address",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
