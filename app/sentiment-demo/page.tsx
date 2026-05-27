// app/sentiment-demo/page.tsx
'use client';
import { useState } from 'react';

// 强类型定义接口
interface SentimentSuccessResponse {
  success: true;
  sentiment: 'positive' | 'negative' | 'neutral' | string;
  confidence: number;
  mode: 'mock' | 'api';
}

interface SentimentErrorResponse {
  success: false;
  error: string;
}

// 联合类型
type SentimentResponse = SentimentSuccessResponse | SentimentErrorResponse;

export default function SentimentDemo() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
        setResult({
        success: false,
        error: '网络异常或服务错误，请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-6">番剧评论情感分析演示</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <textarea
            className="w-full border rounded-lg p-3 mb-4"
            rows={4}
            placeholder="输入一句番剧评论，例如：这部番的战斗场面太燃了！"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={analyze}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '分析中...' : '分析情感'}
          </button>
          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h2 className="font-semibold">分析结果：</h2>
              {result.success ? (
                <>
                  <p>情感极性：<span className="font-bold">{result.sentiment}</span></p>
                  <p>置信度：{(result.confidence * 100).toFixed(2)}%</p>
                  <p className="text-xs text-gray-500 mt-2">{result.mode === 'mock' ? '（演示模式，未配置真实API密钥）' : '（百度NLP API）'}</p>
                </>
              ) : (
                <p className="text-red-500">{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}