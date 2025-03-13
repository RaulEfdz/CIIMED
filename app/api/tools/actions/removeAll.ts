// app/actions/removeAll.ts
import { createClient } from "@/utils/supabase/client";

export async function removeAll(tableName: string, idsToDelete: (string | number)[]): Promise<boolean> {
    const supabase = createClient();
  
    const { error } = await supabase
      .from(tableName)
      .delete()
      .in('id', idsToDelete); // Utiliza 'in' para eliminar múltiples IDs
  
    if (error) {
      console.error(error.message);
      return false;
    }
    return true;
  }