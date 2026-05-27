// // app/anime/[id]/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import { Anime } from '@/lib/recommend';

// export default function AnimeDetailPage() {
//   const { id } = useParams();
//   const [anime, setAnime] = useState<Anime | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     fetch(`/api/anime?id=${id}`)
//       .then(res => res.json())
//       .then(data => {
//         setAnime(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
//   if (!anime) return <div className="text-center mt-20">番剧不存在</div>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <Link href="/" className="text-blue-600 hover:underline">← 返回首页</Link>
//         </div>
//       </header>
//       <main className="max-w-4xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {/* <img src={anime.cover} alt={anime.title} className="w-full h-64 object-cover" /> */}
//           <div>图片</div>
//           <div className="p-6">
//             <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
//             <div className="flex flex-wrap gap-2 mb-4">
//               {anime.tags.map(tag => (
//                 <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
//               ))}
//             </div>
//             <p className="text-gray-700 mb-4">{anime.description}</p>
//             <div className="flex items-center justify-between border-t pt-4">
//               <span className="text-2xl text-yellow-500">⭐ {anime.rating}</span>
//               <span className="text-gray-500">口碑类型: {anime.reputationType}</span>
//             </div>
//             {/* 这里可以加上口碑趋势图，后续再完善 */}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// app/anime/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

export default function AnimeDetailPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/anime/${id}`)
      .then(res => res.json())
      .then(data => {
        setAnime(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10">加载中...</div>;
  if (!anime) return <div className="text-center py-10">番剧不存在</div>;

  // 构造趋势图数据
  const trendData = anime.sentimentTrend.map((value, index) => ({
    name: `${index + 1}阶段`,
    情感值: value,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{anime.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{anime.description}</p>
          <div className="flex items-center gap-6">
            <span className="text-yellow-500 text-xl">⭐ {anime.rating}</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              {anime.reputationType}
            </span>
          </div>
        </div>

        {/* 口碑趋势图 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">口碑情感演变趋势</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="情感值" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-gray-500 text-sm mt-4">
            * 数值越高代表观众情感越正面，本图展示从完结初到长期沉淀的口碑变化。
          </p>
        </div>

        {/* 口碑解析 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">口碑解析</h2>
          {anime.reputationType === '历久弥新' && (
            <p className="text-gray-700">这是一部经得起时间考验的经典作品，长期口碑持续走高，被观众誉为神作。</p>
          )}
          {anime.reputationType === '口碑逆袭' && (
            <p className="text-gray-700">这部作品前期可能不被看好，但随着剧情展开，长期评价远超初期，是典型的“慢热神作”。</p>
          )}
          {anime.reputationType === '高开低走' && (
            <p className="text-gray-700">初期惊艳，但后期质量下滑，长期口碑不如预期，适合降低期待观看。</p>
          )}
          {anime.reputationType === '口碑稳定' && (
            <p className="text-gray-700">口碑保持平稳，没有太大波动，属于稳定发挥的作品。</p>
          )}
        </div>
      </div>
    </div>
  );
}