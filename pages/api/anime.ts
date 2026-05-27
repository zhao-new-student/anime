// pages/api/anime.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import animeData from '../../data/animeList.json';

// 设置允许跨域（可选，但建议加上）
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 获取番剧ID（如果有）
  const { id, limit = '20' } = req.query;
  
  if (id) {
    // 如果提供了ID，返回单部番剧
    const anime = animeData.find((a) => a.id === parseInt(id as string));
    if (anime) {
      return res.status(200).json(anime);
    }
    return res.status(404).json({ error: '番剧未找到' });
  }
  
  // 否则返回列表（前limit部）
  const limitNum = parseInt(limit as string);
  const result = animeData.slice(0, limitNum);
  return res.status(200).json(result);
}