import { cookies } from 'next/headers';
import en from './locales/en.json';
import es from './locales/es.json';

export type Locale = 'en' | 'es';

const dictionaries = {
  en,
  es,
};

export async function getDictionary() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'es';
  
  return dictionaries[locale] || dictionaries.es;
}

export async function getCurrentLocale() {
  const cookieStore = await cookies();
  return (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'es';
}
