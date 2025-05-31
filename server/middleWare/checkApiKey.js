import env from "dotenv";
env.config();

export default function checkApiKey(req, res, next) {
  const clientKey = req.headers['x-api-key'];
  if (clientKey !== process.env.API_POST_KEY) {
    console.log(clientKey);
    console.log(process.env.API_POST_KEY);
    return res.status(403).json({ error: 'Invalid API Key' });
  }
  next();
}