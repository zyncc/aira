import "server-only";

export async function sendPhoneOTP(phoneNumber: string, code: string) {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `+91${phoneNumber}`,
        type: "template",
        template: {
          name: "login_otp",
          language: {
            code: "en",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: code,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: code,
                },
              ],
            },
          ],
        },
      }),
    },
  );
  const data = await response.json();
  console.log(data);
}
