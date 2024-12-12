import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, niche, goal, platform, tone, postIdea } = req.body;

    let prompt;
    if (type === 'idea') {
      let promptPrefix = '';
      
      // Special handling for educational content
      if (goal === 'educational') {
        promptPrefix = `Generate 3 educational and informative social media post ideas for the ${niche} industry. Each post must:
        1. Start with one of these prefixes: "Did you know🤔? ", "Fact ⚠️: ", or "Insight 💡: "
        2. Share valuable industry insights or technical information
        3. Include practical implications
        4. Add relevant hashtags
        5. Be formatted for ${platform}
        `;
      }
    
      prompt = `${promptPrefix}Generate 3 detailed and creative social media post ideas for the ${niche} industry, focused on ${goal === 'educational' ? 'educating your audience' : goal}. Each idea should be formatted as follows:
    
    IDEA 1:
    [Title] A catchy title that highlights the main point
    [Visual Content] Describe an engaging visual (chart, infographic, or image)
    [Caption] Write a ${tone} tone caption with hashtags
    [Call to Action] Add an engaging call to action
    
    IDEA 2:
    [Title] Another engaging title
    [Visual Content] Suggest visual content
    [Caption] Write a ${tone} caption with hashtags
    [Call to Action] Include a call to action
    
    IDEA 3:
    [Title] Third compelling title
    [Visual Content] Recommend visual elements
    [Caption] Provide a ${tone} caption with hashtags
    [Call to Action] Suggest a call to action`;
    } else if (type === 'caption') {
      prompt = `Create a highly engaging ${tone} caption for ${platform} about: '${postIdea}'. 
      Include these elements:
      1. An attention-grabbing opening
      2. Key facts or insights
      3. Industry-specific hashtags for ${niche}
      4. A clear call-to-action
      
      If this is educational content, start with "Did you know🤔? ", "Fact ⚠️: ", or "Insight 💡: "
      Format it specifically for ${platform}'s best practices.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional social media content creator specializing in educational and engaging content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}