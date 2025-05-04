import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import FormData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
}));

app.use(express.json());

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
});

app.post("/send-email", async (req, res) => {
  const { firstName, lastName, userEmail, phone, contactPref, items, comments } = req.body;

  const isCancellation = !items;

  if (isCancellation) {

  const businessEmailCancelData = {
    from: "Fearless N Focused <postmaster@fearlessnfocused.com>",
    to: "teonvioncollins@gmail.com",
    subject: "Merchandise Cancellation Request",
      html: `
        <div style="background-color: #EFBF04; color: white; text-align: center; padding: 15px;">
        <h2 style="margin: 0; font-size: 22px; text-align: center;">
          Merchandise Cancellation Request
      </h2>
      </div>
        
        <!-- Email Body -->
        <div style="padding: 20px;">
        <p style="font-size: 16px;">A new merchandise cancellation request has been submitted.</p>
  
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid gold;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${userEmail}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            </table>
        </div>
  
        <!-- Footer -->
        <div style="background-color: #EFBF04; color: white; text-align: center; padding: 10px; font-size: 14px;">
          <p style="margin: 0;">Fearless N Focused</p>
          <p style="margin: 0;">Phone: (443)-205-2595</p>
          <p style="margin: 0; color: #FFFFFF">Email: fearlessnfocused410@gmail.com</p>
        </div>
      </div>
      `,
    };

  const userCancelEmailData = {
    from: "Fearless N Focused <postmaster@fearlessnfocused.com>",
    to: userEmail,
    subject: "Merchandise Cancellation Confirmation",
    html: `
      <div style="background-color: #EFBF04; color: white; text-align: center; padding: 15px;">
        <h2 style="margin: 0; font-size: 22px;">
          Merchandise Cancellation Confirmation
      </h2>
      </div>
      
      <!-- Email Body -->
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hi ${firstName},</p>

        <div style="width: 100%; margin-top: 10px; border: 2px solid gold; padding: 10px;">
        
        <p style="font-size: 16px;">Thank you for notifying us of your cancellation. Your order has been cancelled, but feel free to visit again!
        </p>

        <p style="font-size: 16px;">Please contact us if you have any further questions.</p>
        
        <p style="margin-top: 20px; font-size: 16px;">Best,</p>
        <p style="font-size: 16px;">Fearless N Focused</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #EFBF04; color: white; text-align: center; padding: 10px; font-size: 14px;">
        <p style="margin: 0;">Fearless N Focused</p>
        <p style="margin: 0;">Phone: (443)-205-2595</p>
          <p style="margin: 0; color: #FFFFFF">Email: fearlessnfocused410@gmail.com</p>
      </div>
    </div>
    `,
  };

  try {

    await mg.messages.create("fearlessnfocused.com", businessEmailCancelData);
    await mg.messages.create("fearlessnfocused.com", userCancelEmailData);

    res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send emails." });
  }
  } else {
    const itemsHtml = items.map(item => `
      <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.product}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.size}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
      </tr>
    `).join('');

  const businessEmailData = {
    from: "Fearless N Focused <postmaster@fearlessnfocused.com>",
    to: "teonvioncollins@gmail.com",
    subject: "New Merchandise Request Received",
      html: `
        <div style="background-color: #EFBF04; color: white; text-align: center; padding: 15px;">
          <h2 style="margin: 0; font-size: 22px; text-align: center;">
            New Merchandise Request
        </h2>
        </div>
          
          <!-- Email Body -->
          <div style="padding: 20px;">
            <p style="font-size: 16px;">A new merchandise request has been submitted.</p>
    
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid gold;">
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${userEmail}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact Preference:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${contactPref}</td>
              </tr>
              </table>
              <br>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid gold;">
              <tr><th colspan="3" style="background-color: #f2f2f2; padding: 10px; border: 1px solid #ddd; text-align: center;">Item(s)</th>
              </tr>
              <tr>
        <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Product</td>
        <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Size</td>
        <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Quantity</td>
    </tr>
    ${itemsHtml || "N/A"}
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Additional Comments:</td>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd;">${comments || "N/A"}</td>
              </tr>
            </table>
    
            <p style="margin-top: 20px; font-size: 16px;">Please follow up with the customer to confirm the order.</p>
          </div>
    
          <!-- Footer -->
          <div style="background-color: #EFBF04; color: white; text-align: center; padding: 10px; font-size: 14px;">
            <p style="margin: 0;">Fearless N Focused</p>
            <p style="margin: 0;">Phone: (443)-205-2595</p>
            <p style="margin: 0; color: #FFFFFF">Email: fearlessnfocused410@gmail.com</p>
          </div>
        </div>
      `
    };

  const userEmailData = {
    from: "Fearless N Focused <postmaster@fearlessnfocused.com>",
    to: userEmail,
    subject: "Your Merchandise Request Confirmation",
    html: `
      <div style="background-color: #EFBF04; color: white; text-align: center; padding: 15px;">
          <h2 style="margin: 0; font-size: 22px;">
            Merchandise Request Confirmation
        </h2>
        </div>
        
        <!-- Email Body -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Hi ${firstName},</p>
          
          <p style="font-size: 16px;">Thank you for your merchandise request! Here are your order details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid gold;">
              <tr><th colspan="3" style="background-color: #f2f2f2; padding: 10px; border: 1px solid #ddd; text-align: center;">Item(s)</th>
              </tr>
              <tr>
        <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Product</td>
        <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Size</td>
        <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Quantity</td>
    </tr>
    ${itemsHtml || "N/A"}
    </table>
  
          <p style="margin-top: 20px; font-size: 16px;">
            We will contact you shortly via ${contactPref} to confirm your order.
          </p>
  
          <p style="font-size: 16px;">If you have any further questions, feel free to reply to this email.</p>
          
          <p style="margin-top: 20px; font-size: 16px;">Best,</p>
          <p style="font-size: 16px;">Fearless N Focused</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #EFBF04; color: white; text-align: center; padding: 10px; font-size: 14px;">
          <p style="margin: 0;">Fearless N Focused</p>
          <p style="margin: 0;">Phone: (443)-205-2595</p>
            <p style="margin: 0; color: #FFFFFF">Email: fearlessnfocused410@gmail.com</p>
        </div>
      </div>
    `
  };

  try {
    await mg.messages.create("fearlessnfocused.com", businessEmailData);
    await mg.messages.create("fearlessnfocused.com", userEmailData);

    res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send emails." });
  }
}
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
