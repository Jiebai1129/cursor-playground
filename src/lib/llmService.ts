import { Mistake } from '@/store/mistakeStore';

interface LLMResponse {
  solution: string;
  error?: string;
}

/**
 * 调用大语言模型API解答问题
 * @param question 问题内容
 * @param subject 学科
 * @returns 解答结果
 */
export async function getSolutionFromLLM(question: string, subject: string): Promise<LLMResponse> {
  try {
    // 构建请求体
    const requestBody = {
      model: "THUDM/glm-4-9b-chat", // 使用GLM-4-9B模型
      messages: [
        {
          role: "system",
          content: `你是一位专业的${subject}老师，擅长解答学生的问题。请详细解答以下题目，给出清晰的思路和步骤。`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    // 发送请求到API
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY || ''}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '调用AI服务失败');
    }

    const data = await response.json();
    return {
      solution: data.choices[0].message.content
    };
  } catch (error) {
    console.error('AI解题服务错误:', error);
    return {
      solution: '',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 根据错题内容生成解答
 * @param mistake 错题对象
 * @returns 解答结果
 */
export async function generateSolutionForMistake(mistake: Mistake): Promise<LLMResponse> {
  const question = mistake.content; // 使用题目内容而不是笔记
  const subject = mistake.subject;
  
  return getSolutionFromLLM(question, subject);
} 