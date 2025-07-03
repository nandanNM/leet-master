import OpenAI from "openai";
import {asyncHandler} from "../utils/async-handler";
import {ApiResponse} from "../utils/responses";

export const getCodeReview = asyncHandler(async (req, res) => {
  const {code, language, problemTitle} = req.body;

  const systemPrompt = `You are a senior code reviewer and expert programming mentor specializing in ${language}. 
Your job is to analyze submitted code for coding interview problems and provide structured feedback.

Analysis Framework:
1. **Correctness**: Identify bugs, logic errors, and missed edge cases
2. **Performance**: Analyze time/space complexity and suggest optimizations
3. **Code Quality**: Review readability, naming conventions, and best practices
4. **Edge Cases**: Point out potential issues with boundary conditions

Response Format:
- Use clear, bullet-pointed feedback
- Keep explanations concise but helpful
- Rate overall code quality (1-5 stars)
- Focus on actionable improvements
- Be encouraging but honest

${problemTitle ? `Problem Context: ${problemTitle}` : ""}`;

  const client = new OpenAI();
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {role: "system", content: systemPrompt},
      {
        role: "user",
        content: `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
    max_tokens: 800,
    temperature: 0.3,
  });

  const review = completion.choices[0].message.content;
  const response = {
    success: true,
    data: {
      review,
      language,
      timestamp: new Date().toISOString(),
      tokensUsed: completion.usage?.total_tokens || 0,
    },
  };

  console.log(
    `Code review generated - Language: ${language}, Tokens: ${completion.usage?.total_tokens}`,
  );

  new ApiResponse(200, "Code review generated", response).send(res);
});
