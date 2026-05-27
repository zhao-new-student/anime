// app/components/PreferenceSelector.tsx
"use client";

import { useState } from "react";
import { UserPreferences } from "@/lib/recommend";

interface Props {
    onStart: (prefs: UserPreferences) => void;
}

export default function PreferenceSelector({ onStart }: Props) {
    const [emotion, setEmotion] = useState("热血");
    const [genre, setGenre] = useState("战斗");
    const [quality, setQuality] = useState("剧情");

    const emotions = ["热血", "治愈", "致郁", "搞笑"];
    const genres = ["校园", "奇幻", "战斗", "日常"];
    const qualities = ["剧情", "作画", "音乐"];

    const handleSubmit = () => {
        onStart({ emotion, genre, quality });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
                告诉我你想看什么样的番剧
            </h2>

            {/* 情感选项 */}
            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">
                    你现在的情绪？
                </label>
                <div className="flex flex-wrap gap-3">
                    {emotions.map((e) => (
                        <button
                            key={e}
                            onClick={() => setEmotion(e)}
                            className={`px-4 py-2 rounded-full transition ${
                                emotion === e
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            {/* 类型选项 */}
            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">
                    喜欢的类型？
                </label>
                <div className="flex flex-wrap gap-3">
                    {genres.map((g) => (
                        <button
                            key={g}
                            onClick={() => setGenre(g)}
                            className={`px-4 py-2 rounded-full transition ${
                                genre === g
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* 质量侧重 */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                    你最看重作品的哪个方面？
                </label>
                <div className="flex flex-wrap gap-3">
                    {qualities.map((q) => (
                        <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className={`px-4 py-2 rounded-full transition ${
                                quality === q
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
                开始推荐 →
            </button>
        </div>
    );
}
