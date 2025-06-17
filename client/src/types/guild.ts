export interface Guild {
  id: string;
  guild_name: string;
  description?: string | null;
  owner_id: string;
  owner_name?: string;
  members: string[];
  created_at: string;
}
