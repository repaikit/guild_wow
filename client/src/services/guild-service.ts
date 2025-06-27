import { API_ENDPOINTS } from "@/config/api";
import { Guild } from "@/types/guild";

/**
 * Fetches a guild by its name
 */
export async function fetchGuildByName(name: string): Promise<Guild | null> {
  try {
    const res = await fetch(API_ENDPOINTS.guilds.search(name));
    const data = await res.json();
    const exact = data.find((g: Guild) => g.guild_name === name);
    return exact || null;
  } catch (error) {
    console.error("Error fetching guild:", error);
    return null;
  }
}

/**
 * Joins a guild
 */
export async function joinGuild(guildName: string, accessToken: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(API_ENDPOINTS.guilds.join, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ guild_name: guildName }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.detail || "Failed to join guild" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error joining guild:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Leaves a guild
 */
export async function leaveGuild(guildName: string, accessToken: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(API_ENDPOINTS.guilds.leave, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ guild_name: guildName }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.detail || "Failed to leave guild" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error leaving guild:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Creates a new guild
 */
export async function createGuild(
  guildName: string, 
  description: string, 
  accessToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(API_ENDPOINTS.guilds.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        guild_name: guildName,
        description,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.detail || "Failed to create guild" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating guild:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}