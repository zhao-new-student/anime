// lib/recommend.ts

export interface Anime {
  id: number;
  title: string;
  cover: string;
  description: string;
  tags: string[];
  rating: number;
  reputationType: string;
  sentimentTrend: number[];
}

// 用户偏好接口
export interface UserPreferences {
  emotion: string;    // 热血/治愈/致郁/搞笑
  genre: string;      // 校园/奇幻/战斗/日常
  quality: string;    // 剧情/作画/音乐
}

// 根据用户偏好对番剧列表进行排序和筛选（模拟推荐）
export function getRecommendedAnime(
  animeList: Anime[],
  preferences: UserPreferences,
  excludedIds: number[] = []  // 已收藏的ID，未来去重用
): Anime[] {
  // 1. 先过滤掉排除的ID
  const filtered = animeList.filter(anime => !excludedIds.includes(anime.id));
  
  // 2. 为每部番剧计算匹配分数
  const scored = filtered.map(anime => {
    let score = 0;
    
    // 基础分：评分（0-10分）* 0.5
    score += (anime.rating / 10) * 5;
    
    // 情感匹配：如果番剧标签中包含用户选择的情绪词，加2分
    if (anime.tags.some(tag => tag.includes(preferences.emotion))) {
      score += 2;
    }
    // 类型匹配：类似
    if (anime.tags.some(tag => tag.includes(preferences.genre))) {
      score += 2;
    }
    // 口碑类型加分（模拟时序口碑特征）
    if (anime.reputationType === '历久弥新') score += 1.5;
    if (anime.reputationType === '口碑逆袭') score += 1;
    if (anime.reputationType === '口碑稳定') score += 0.5;
    if (anime.reputationType === '高开低走') score -= 0.5;
    
    return { anime, score };
  });
  
  // 3. 按分数降序排序
  scored.sort((a, b) => b.score - a.score);
  
  // 4. 返回前10个
  return scored.slice(0, 10).map(item => item.anime);
}