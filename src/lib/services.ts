import type { Service } from '../types/service';
import { supabase } from './superbase';

type ServiceRecord = {
  id: number | string;
  title?: string | null;
  category?: string | null;
  price?: number | string | null;
  photo?: string | null;
  description?: string | null;
  user_id?: string | null;
};

const publicProfiles = new Map<string, { name: string; avatar: string }>();
const SERVICE_TABLES = ['services', 'service'];
async function loadPublicProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,name,avatar');
  if (error || !data) return;
  publicProfiles.clear();
  for (const profile of data) {
    publicProfiles.set(String(profile.id), {
      name: String(profile.name || 'Vizinho'),
      avatar: String(profile.avatar || ''),
    });
  }
}
export async function getActiveServiceTable() {
  for (const table of SERVICE_TABLES) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (!error) {
      await loadPublicProfiles();
      return table;
    }
    if (error.code && ['42P01', '42703'].includes(error.code)) continue;
    return table;
  }
  return 'services';
}
export function mapDbService(row: ServiceRecord, fallbackName = 'Vizinho', fallbackAvatar = ''): Service {
  const ownerProfile = row.user_id ? publicProfiles.get(String(row.user_id)) : undefined;
  return {
    id: Number(row.id),
    title: String(row.title || 'Serviço'),
    category: String(row.category || 'Reformas'),
    price: Number(row.price || 0),
    rating: 0,
    reviews: 0,
    photo: String(row.photo || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85'),
    name: ownerProfile?.name || (row.user_id ? 'Vizinho' : fallbackName),
    avatar: ownerProfile?.avatar || (row.user_id ? '' : fallbackAvatar),
    condo: 'Meu condomínio',
    bio: 'Profissional da comunidade.',
    description: String(row.description || ''),
    whatsapp: '',
  };
}
