import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/cydvbllrq/Nuruz/moodify/songs/Sitaare_QTNOnTsFV.mp3?updatedAt=1781810135469",
    posterUrl: "https://ik.imagekit.io/cydvbllrq/Nuruz/moodify/posters/Sitaare_SMde_32Bj.jpeg?updatedAt=1781810099499",
    title: "Sitaare",
    mood: "happy",
  });

  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

  return (
    <SongContext.Provider
     
      value={{ loading, setLoading, song, setSong, recommendations, setRecommendations }}
    >
      {children}
    </SongContext.Provider>
  );
};