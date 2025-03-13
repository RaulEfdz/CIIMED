// utils/supabase/checkItemExists.ts
'use client';

import { createClient } from '@/utils/supabase/client';

export const checkItemExists = async ( // Function name changed to checkItemExists, and added generic type <T> (though not strictly needed for existence check itself, it's good practice for potential future enhancements)
  tableName: string,
  filterProperty: string, // Renamed from eventId to filterProperty for more generic use
  filterValue: string | number | boolean | null | undefined // Renamed from eventId to filterValue and kept flexible type
): Promise<boolean> => {
  const supabase = createClient();

  if (!filterProperty) { // Added check for filterProperty to ensure it's provided
    console.warn("checkItemExists: filterProperty is empty or undefined. Please provide a property to filter by.");
    return false;
  }

  if (filterValue === undefined) { // Added check for undefined filterValue. Null is acceptable as a value to filter for, but undefined might be an oversight.
    console.warn("checkItemExists: filterValue is undefined. Filtering with an undefined value might not yield the expected results.");
    // It's up to you whether to return false here or proceed with undefined filter value. Proceeding for now.
    // You could decide to return false if undefined is not a valid use case for your filters.
  }


  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id') // Still efficient, only selecting 'id'
      .eq(filterProperty, filterValue) // Using dynamic filterProperty and filterValue
      .limit(1); // Limit 1 is still relevant for efficiency

    if (error) {
      console.error(`Error checking item existence in table '${tableName}' with filter '${filterProperty} = ${filterValue}':`, error);
      return false;
    }

    return data !== null && data.length > 0;

  } catch (error) {
    console.error(`Exception in checkItemExists for table '${tableName}' and filter '${filterProperty} = ${filterValue}':`, error);
    return false;
  }
};