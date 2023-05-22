const {TelegramBot} = require('node-telegram-bot-api');
const {qrcode} = require('qrcode');

const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';

const bot = new TelegramBot(TOKEN, { polling: true });

function createQRCode(link: string): Promise<string> {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(link, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = 'Welcome to the QR Code Generator Bot!\n\nPlease send me a list of links separated by newlines.';
  bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/generate/, async (msg) => {
  const chatId = msg.chat.id;
  const links = msg.text.split('\n').slice(1);
  if (links.length === 0) {
    bot.sendMessage(chatId, 'Please provide a list of links.');
    return;
  }
  const qrCodes = [];
  try {
    for (const link of links) {
      const qrCode = await createQRCode(link);
      qrCodes.push(qrCode); // this is causing an erro
    }
    for (const qrCode of qrCodes) {
      bot.sendPhoto(chatId, qrCode);
    }
  } catch (error) {
    console.error('QR Code generation error:', error);
    bot.sendMessage(chatId, 'An error occurred while generating QR codes.');
  }
});


