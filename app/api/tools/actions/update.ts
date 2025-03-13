// app/modules/actions/update.ts
import { createClient } from '@/utils/supabase/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateProps<T extends Record<string, any>> = {
  nameTable: string;
  id: string;
  dataToUpdate: Partial<T>; // Correctly using Partial<T> for dataToUpdate
  onSuccess?: (updatedData: T) => void;
  onError?: (errorMessage: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const update = async <T extends Record<string, any>>({ // Correct function signature
  nameTable,
  id,
  dataToUpdate,
  onSuccess,
  onError
}: UpdateProps<T>) => { // Correctly applying UpdateProps<T> to the parameters
  const supabase = createClient();
  const { data, error } = await supabase
    .from(nameTable)
    .update(dataToUpdate) // No need to change dataToUpdate here, it's already Partial<T>
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating record in table "${nameTable}" with id "${id}":`, error);
    onError?.(error.message);
    return { error: error.message };
  }

  if (data && data.length > 0) {
    const updatedRecord = data[0] as T;
    onSuccess?.(updatedRecord);
    return { data: updatedRecord };
  } else {
    onSuccess?.(dataToUpdate as T); // Keep the cast for onSuccess callback to maintain type consistency
    return { data: dataToUpdate as T }; // Keep the cast for return type consistency
  }
};