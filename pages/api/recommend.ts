// pages/api/recommend.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import animeData from '../../data/animeList.json';

// 番剧类型定义
type Anime = {
  id: number;
  title: string;
  cover: string;
  description: string;
  tags: string[];
  rating: number;
  reputationType: string;
  sentimentTrend: number[];
};

// 口碑类型到加分权重（用于推荐排序）
const reputationBonus: Record<string, number> = {
  '历久弥新': 0.8,
  '口碑逆袭': 0.5,
  '口碑稳定': 0.1,
  '高开低走': -0.5,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只接受 POST 请求（因为要接收用户偏好数据）
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 获取用户偏好参数
  const { emotion, genre, quality, likedIds = [] } = req.body;

  // 1. 根据用户偏好构建一个“偏好标签集合”
  //    例如：用户选择“热血+战斗”，则偏好标签为 ['热血','战斗']
  const preferenceTags: string[] = [];
  if (emotion) preferenceTags.push(emotion);
  if (genre) preferenceTags.push(genre);
  // quality 可以后面再处理，这里先简单加一个标签“作画精良”之类的
  if (quality === '作画') preferenceTags.push('作画精良');
  if (quality === '剧情') preferenceTags.push('剧情神展开');
  // 如果都没选，默认给一个空数组

  // 2. 对每部番剧计算得分
  const scoredAnime = (animeData as Anime[]).map(anime => {
    const score = 0;
    
    // 2.1 标签匹配分：计算偏好标签与番剧标签的交集数量
    const matchedTags = anime.tags.filter(tag => preferenceTags.includes(tag));
    const tagMatchScore = matchedTags.length / Math.max(preferenceTags.length, 1); // 归一化0-1
    
    // 2.2 口碑类型加分
    const reputationScore = reputationBonus[anime.reputationType] || 0;
    
    // 2.3 评分归一化（0-1）
    const ratingScore = anime.rating / 10;
    
    // 2.4 最终得分 = 标签匹配分 * 0.5 + 口碑分 * 0.2 + 评分分 * 0.3
    const finalScore = tagMatchScore * 0.5 + reputationScore * 0.2 + ratingScore * 0.3;
    
    return { ...anime, score: finalScore };
  });

  // 3. 按得分降序排序
  scoredAnime.sort((a, b) => b.score - a.score);

  // 4. 排除用户已收藏的番剧（likedIds）
  const filtered = scoredAnime.filter(anime => !likedIds.includes(anime.id));

  // 5. 取前10条作为推荐结果
  const recommendations = filtered.slice(0, 10);

  // 6. 返回推荐列表
  return res.status(200).json({
    success: true,
    data: recommendations,
    total: recommendations.length,
  });
}