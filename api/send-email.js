import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { firstName, lastName, userEmail, phone, contactPref, items, comments } = req.body;

  const isCancellation = !items || items.length === 0;

  const domain = "fearlessnfocused.com";

  const businessEmail = {
    from: "Fearless N Focused <postmaster@fearlessnfocused.com>",
    to: "teonvioncollins@gmail.com",
    subject: isCancellation ? "Merchandise Cancellation Request" : "New Merchandise Request Received",
    html: isCancellation
      ? `<div><p>Cancellation request from ${firstName} ${lastName} (${userEmail})</p></div>`
      : `<div><p>Merchandise request from ${firstName} ${lastName}</p><p>Items: ${items.map(i => i.product).join(", ")}</p></div>`,
  };

  const userEmailData = {
    from: "Fearless N Focused <postmaster@fearlessnfocused.com>",
    to: userEmail,
    subject: isCancellation ? "Cancellation Confirmation" : "Merchandise Request Confirmation",
    html: `<div><p>Hi ${firstName},<br>Your ${isCancellation ? "cancellation" : "order"} has been received.</p></div>`,
  };

  try {
    await mg.messages.create(domain, businessEmail);
    await mg.messages.create(domain, userEmailData);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).json({ success: false, error: "Mailgun error" });
  }
}
