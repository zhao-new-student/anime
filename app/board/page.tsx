// app/board/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Anime = {
  id: number;
  title: string;
  cover: string;
  rating: number;
  reputationType: string;
};

export default function BoardPage() {
  const [timelessList, setTimelessList] = useState<Anime[]>([]);
  const [comebackList, setComebackList] = useState<Anime[]>([]);

  useEffect(() => {
    fetch('/api/anime?limit=100')
      .then(res => res.json())
      .then(data => {
        const timeless = data.filter((a: Anime) => a.reputationType === '历久弥新');
        const comeback = data.filter((a: Anime) => a.reputationType === '口碑逆袭');
        setTimelessList(timeless.slice(0, 10));
        setComebackList(comeback.slice(0, 10));
      });
  }, []);

  const renderList = (title: string, list: Anime[]) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {list.map(anime => (
          <Link key={anime.id} href={`/anime/${anime.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
            <img src={anime.cover} alt={anime.title} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{anime.title}</div>
              <div className="text-sm text-gray-500">⭐ {anime.rating}</div>
            </div>
          </Link>
        ))}
        {list.length === 0 && <div className="text-gray-400">暂无数据</div>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-6">番剧口碑看板</h1>
        {renderList('🏆 历久弥新榜（经得起时间考验的经典）', timelessList)}
        {renderList('📈 口碑逆袭榜（后期发力的黑马）', comebackList)}
      </div>
    </div>
  );
}