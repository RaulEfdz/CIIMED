import { createClient } from "@/utils/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function create(data: any, tableName: string): Promise<boolean> {
  const supabase = createClient();

  const user =  (await supabase.auth.getUser()).data.user
console.log("idUser", user)


  const { error } = await supabase.from(tableName).insert([
    {
      ...data,
      user_id: user?.id
    }
  ]);

  if (error) {
    return false;
  }
  return true;
}


