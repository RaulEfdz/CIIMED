// utils/supabase/selectSingle.ts
'use client';

import { createClient } from '@/utils/supabase/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectSingle = async <T = any>(
  tableName: string,
  propertyName: string,
  propertyValue: string | number | boolean | null | undefined //  Allow common property value types
): Promise<T | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq(propertyName, propertyValue) //  🔑 Filter by propertyName and propertyValue
    .single(); // 🔑 Use .single() to get a single record

  if (error) {
    console.error(`Error fetching single item from ${tableName} with ${propertyName} = ${propertyValue}:`, error);
    return null; // Return null in case of error
  }

  return data as T || null; // Return the single item or null if not found
};