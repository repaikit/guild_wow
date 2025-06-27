import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Guild } from '../types/guild';
import { fetchGuildByName, joinGuild, leaveGuild, createGuild } from '../services/guild-service';
import { useToast } from '../components/Toast';

interface UseGuildState {
  guild: Guild | null;
  loading: boolean;
  error: string | null;
}

export function useGuild() {
  const [state, setState] = useState<UseGuildState>({
    guild: null,
    loading: false,
    error: null,
  });
  const router = useRouter();
  const { showToast } = useToast();

  const fetchGuild = useCallback(async (guildName: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const guild = await fetchGuildByName(guildName);
      setState({ guild, loading: false, error: null });
      return guild;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch guild';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, []);

  const handleJoinGuild = useCallback(async (guildId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required to join guild');
      }
      const result = await joinGuild(guildId, token);
      if (!result.success) {
        throw new Error(result.message || 'Failed to join guild');
      }
      // Refresh guild data after joining
      const updatedGuild = await fetchGuildByName(guildId);
      setState(prev => ({ ...prev, guild: updatedGuild, loading: false }));
      showToast(`Successfully joined guild`, 'success');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join guild';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      showToast(errorMessage, 'error');
      return false;
    }
  }, [showToast]);

  const handleLeaveGuild = useCallback(async (guildId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required to leave guild');
      }
      const result = await leaveGuild(guildId, token);
      if (!result.success) {
        throw new Error(result.message || 'Failed to leave guild');
      }
      setState(prev => ({ ...prev, guild: null, loading: false }));
      showToast(`Successfully left guild`, 'success');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave guild';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      showToast(errorMessage, 'error');
      return false;
    }
  }, [showToast]);

  const handleCreateGuild = useCallback(async (guildName: string, description: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required to create guild');
      }
      const result = await createGuild(guildName, description, token);
      if (!result.success) {
        throw new Error(result.message || 'Failed to create guild');
      }
      setState(prev => ({ ...prev, loading: false }));
      showToast(`Guild "${guildName}" created successfully`, 'success');
      router.push(`/guild/${guildName}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create guild';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      showToast(errorMessage, 'error');
      return false;
    }
  }, [router, showToast]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchGuild,
    handleJoinGuild,
    handleLeaveGuild,
    handleCreateGuild,
    clearError,
  };
}