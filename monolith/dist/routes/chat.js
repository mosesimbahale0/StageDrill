// import express from 'express';
// import { sendToGemini } from '../services/geminiService.js';
// const router = express.Router();
// router.post('/', async (req, res) => {
//   const { message, history } = req.body;
//   try {
//     const { reply, newHistory } = await sendToGemini(message, history || []);
//     res.json({ reply, history: newHistory });
//   } catch (error) {
//     res.status(500).json({ detail: error.message });
//   }
// });
// export default router;
import express from 'express';
import { sendToGemini } from '../services/geminiService.js';
const router = express.Router();
router.post('/', async (req, res) => {
    console.log('--- New Chat Request ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    const { message, history } = req.body;
    if (!message) {
        console.error('Error: Message is undefined or missing in request body.');
        return res.status(400).json({ detail: 'Message is required.' });
    }
    console.log(`Received message: "${message}"`);
    console.log('Received history:', JSON.stringify(history, null, 2));
    try {
        console.log('Calling sendToGemini service...');
        const { reply, newHistory } = await sendToGemini(message, history || []);
        console.log('Successfully received response from sendToGemini.');
        console.log('Reply to send to client:', reply);
        console.log('New history to send to client:', JSON.stringify(newHistory, null, 2));
        res.json({ reply, history: newHistory });
    }
    catch (error) {
        console.error('--- ERROR in Chat Route ---');
        console.error('Timestamp:', new Date().toISOString());
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        console.error('Full Error Object:', JSON.stringify(error, null, 2)); // Log the full error object
        res.status(500).json({
            detail: error.message,
            // Consider sending a less detailed error message to the client in production
            // error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});
export default router;
