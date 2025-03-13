import { createClient } from "@/utils/supabase/client";

export async function remove(tableName: string, idToDelete: string | number): Promise<boolean> {
    const supabase = createClient();
  
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', idToDelete); // Asumiendo que tu tabla tiene una columna 'id'
  
    if (error) {
      console.error(error.message);
      return false;
    }
    return true;
  }