// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import PreferenceSelector from './components/PreferenceSelector';

export default function Home() {
  const router = useRouter();

interface UserPreferences {
  emotion: string;
  genre: string;
  quality: string;
}


  const handleStart = (prefs: UserPreferences) => {
    // 跳转到推荐页面，同时把偏好通过URL参数传递
    const params = new URLSearchParams({
      emotion: prefs.emotion,
      genre: prefs.genre,
      quality: prefs.quality,
    });
    localStorage.setItem('userPreferences', JSON.stringify(params));
    // router.push(`/recommend?${params.toString()}`);
     router.push('/recommend');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <PreferenceSelector onStart={handleStart} />
    </div>
  );
}