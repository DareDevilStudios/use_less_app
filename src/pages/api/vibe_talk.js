// pages/api/vibe_talk.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    // Check if the request method is POST
    if (req.method === 'POST') {
        const { prompt } = req.body;
        console.log('Received prompt:', prompt);

        // Validate the prompt
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        try {
            // Get the generative model
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            // Send the prompt to the Gemini model and get a response
            const result = await model.generateContent(prompt);
            const response = result.response;
            
            const text = response.text();
            console.log('Generated text data:', text);

            // Send the generated text as the response
            res.status(200).json({ text });
        } catch (error) {
            console.error('Error generating content:', error);
            res.status(500).json({ error: 'An error occurred while generating content' });
        }
    } else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
