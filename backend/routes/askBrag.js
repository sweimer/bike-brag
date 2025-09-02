import express from 'express';
import fetch from 'node-fetch'; // or use global fetch in Node 18+

const router = express.Router();

router.post('/', async (req, res) => {
  const { question, location, threadId } = req.body;
  try {
    // Example OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `You are an expert on biking in ${location}.` },
          { role: 'user', content: question }
        ]
      }),
    });
    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || 'No response.', threadId });
  } catch (error) {
    console.error('AskBrag error:', error);
    res.status(500).json({ reply: 'Error: Assistant failed to respond.' });
  }
});

export default router;
