import { useContext, useCallback } from "react";
import { SongContext } from "../song.context";
import { getSong, getRecommendations } from "../services/song.api"; 

export const useSong = () => {
  const context = useContext(SongContext);

 
  const { loading, setLoading, song, setSong, recommendations, setRecommendations } = context;

  const handleGetSong = useCallback(async ({ mood }) => {
    setLoading(true);

    try {
      const data = await getSong({ mood });
      setSong(data.song);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSong]); 
 
  const handleGetRecommendations = useCallback(async ({ mood }) => {
    try {
      const data = await getRecommendations({ mood }); 
      setRecommendations(data.recommendations || data.songs || []);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
      throw error; 
    }
  }, [setRecommendations]);
 
  function handleSelectSong(selectedSong) {
    setSong(selectedSong);
  }

  return {
    loading,
    song,
    recommendations,           
    handleGetSong,
    handleGetRecommendations,  
    handleSelectSong,          
  };
};