import axios from 'axios';

const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL!;

interface AlertOptions {
  title: string; // Bold main title
  labelsAndMessages: Record<string, string>; // e.g. { "Service": "API down", "Env": "Prod" }
}

export async function sendGoogleChatAlert({
  title,
  labelsAndMessages,
}: AlertOptions) {
  const lines = [`*${title}*\n`];

  for (const [label, message] of Object.entries(labelsAndMessages)) {
    lines.push(`*${label}:* ${message}`);
  }

  const text = lines.join('\n');

  try {
    const res = await axios.post(
      webhookUrl,
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data;
  } catch (err: any) {
    console.error(
      'Google Chat alert failed:',
      err.response?.data || err.message,
    );
  }
}
