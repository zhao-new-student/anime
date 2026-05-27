// pages/api/sentiment.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface SentimentResult {
  items?: Array<{
    sentiment: number;
    confidence: number;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: '请提供评论内容' });
  }

  // 获取百度API密钥（从环境变量读取，安全）
  const API_KEY = process.env.BAIDU_API_KEY;
  const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

  if (!API_KEY || !SECRET_KEY) {
    // 演示模式：返回模拟结果
    return res.status(200).json({
      success: true,
      sentiment: '正面',
      confidence: 0.85,
      mode: 'mock',
    });
  }

  try {
    // 获取access_token
    const tokenRes = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`, {
      method: 'POST',
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    
    

    // 调用情感分析接口
    const sentRes = await fetch(`https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const result = await sentRes.json() as SentimentResult;
    
    if (result.items && result.items[0]) {
      const item = result.items[0];
      const sentimentMap: Record<number, string> = { 0: '负面', 1: '中性', 2: '正面' };
      const sentiment = sentimentMap[item.sentiment] || '未知';
      return res.status(200).json({
        success: true,
        sentiment,
        confidence: item.confidence,
        mode: 'api',
      });
    } else {
      throw new Error('分析失败');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '情感分析失败' });
  }
}