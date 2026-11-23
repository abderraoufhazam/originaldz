/** Send a Telegram message about a new order (feature 9). Free and optional. */
export async function sendTelegram(
  text: string,
  keyboard?: { text: string; callback_data: string }[][],
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' };
    if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
