// app/recommend/page.tsx
"use client"; // 因为使用了 useState, useEffect

import { useState, useEffect } from "react";
import Link from "next/link";

type Anime = {
    id: number;
    title: string;
    cover: string;
    description: string;
    tags: string[];
    rating: number;
    reputationType: string;
    sentimentTrend: number[];
    score?: number;
};

export default function RecommendPage() {
    // 从 localStorage 或 sessionStorage 读取用户偏好（第二天应该已经存了）
    const [preferences, setPreferences] = useState<null | {
        emotion: string;
        genre: string;
        quality: string;
    }>(null);
    const [recommendations, setRecommendations] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedIds, setLikedIds] = useState<number[]>([]);

    // 加载用户偏好和收藏列表
    useEffect(() => {
        const savedPref = localStorage.getItem("userPreferences");
        const savedLiked = localStorage.getItem("likedAnimeIds");

        // 用异步微任务包裹 setState，避免同步调用
        queueMicrotask(() => {
            if (savedPref) {
                setPreferences(JSON.parse(savedPref));
            }
            if (savedLiked) {
                setLikedIds(JSON.parse(savedLiked));
            }
        });
    }, []);

    // 当偏好加载完成后，调用推荐API
    useEffect(() => {
        if (!preferences) return;

        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/recommend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        emotion: preferences.emotion,
                        genre: preferences.genre,
                        quality: preferences.quality,
                        likedIds: likedIds,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setRecommendations(data.data);
                } else {
                    console.error("推荐失败", data);
                }
            } catch (error) {
                console.error("请求错误", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [preferences, likedIds]);

    if (!preferences) {
        return <div className="text-center py-10">请先返回首页选择偏好</div>;
    }

    if (loading) {
        return <div className="text-center py-10">加载推荐中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        为您推荐
                    </h1>
                    <Link href="/" className="text-blue-500 hover:underline">
                        重新选择偏好
                    </Link>
                    <Link
                        href="/sentiment-demo"
                        className="text-blue-500 hover:underline ml-4"
                    >
                        情感分析演示
                    </Link>
                    <Link
                        href="/board"
                        className="text-blue-500 hover:underline ml-4"
                    >
                        口碑看板
                    </Link>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((anime) => (
                        <div
                            key={anime.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <img
                                src={anime.cover}
                                alt={anime.title}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "https://picsum.photos/300/200?random=1";
                                }}
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {anime.title}
                                </h2>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {anime.tags.slice(0, 3).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {anime.description}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-yellow-500">
                                        ⭐ {anime.rating}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {anime.reputationType}
                                    </span>
                                    {anime.score && (
                                        <span className="text-xs text-green-500">
                                            匹配度:{" "}
                                            {(anime.score * 100).toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                                <Link
                                    href={`/anime/${anime.id}`}
                                    className="mt-2 inline-block text-blue-500 text-sm hover:underline"
                                >
                                    查看详情 →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                {recommendations.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        没有找到符合您偏好的番剧，请调整筛选条件
                    </div>
                )}
            </main>
        </div>
    );
}
