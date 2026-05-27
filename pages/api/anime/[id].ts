// pages/api/anime/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import animeData from '../../../data/animeList.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const animeId = parseInt(id as string);
  
  const anime = animeData.find((a) => a.id === animeId);
  
  if (!anime) {
    return res.status(404).json({ error: 'Anime not found' });
  }
  
  return res.status(200).json(anime);
}