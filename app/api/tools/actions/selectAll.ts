// utils/supabase/selectAll.ts
'use client';

import { createClient } from '@/utils/supabase/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAll = async <T = any>(nameTable: string): Promise<Partial<T>[]> => { // ✅ Modified return type to Promise<Partial<T>[]>
  const supabase = createClient();
  const { data, error } = await supabase.from(nameTable).select('*');
  if (error) {
    console.error('Error fetching events:', error);
    return []; // Return an empty array in case of error
  }
  return (data as Partial<T>[]) || []; // ✅ Cast data to Partial<T>[]
};