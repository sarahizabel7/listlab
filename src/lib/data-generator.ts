import type { ListItem, ThemeName } from '@/types';
import { mulberry32, pick, pickN } from './seeded-random';
import { THEME_CONFIGS } from './themes';

/**
 * Generate a deterministic list item based on its index and theme.
 * Same (index, theme) always returns the same item — no memory allocation needed.
 */
export function generateItem(index: number, theme: ThemeName): ListItem {
  const config = THEME_CONFIGS[theme];
  const rng = mulberry32(index * 7919 + theme.charCodeAt(0));

  const title = pick(config.titles, rng);
  const subtitle = pick(config.subtitles, rng);
  const category = pick(config.categories, rng);
  const tagCount = 1 + Math.floor(rng() * 3);
  const tags = pickN(config.tags, tagCount, rng);
  const value = Math.floor(rng() * 10000) / 100;
  const timestamp = Date.now() - Math.floor(rng() * 86400000 * 30);

  return {
    id: index,
    title,
    subtitle,
    category,
    tags,
    value,
    timestamp,
    avatar: config.avatarPrefix,
  };
}

/** Generate a batch of items */
export function generateBatch(
  startIndex: number,
  count: number,
  theme: ThemeName,
): ListItem[] {
  const items: ListItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push(generateItem(startIndex + i, theme));
  }
  return items;
}
