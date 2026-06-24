import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getSong({ mood }) {
  const response = await api.get("/api/songs?mood=" + mood);
  return response.data;
}

export async function getRecommendations({ mood }) {
  // If a mood is provided, pass it as a query parameter. Otherwise, just call the base route.
  const url = mood 
    ? "/api/songs/recommendations?mood=" + mood 
    : "/api/songs/recommendations";

  const response = await api.get(url);
  return response.data;
}



export async function getMoodHistory() {
  const response = await api.get("/api/history");
  return response.data;
}

export async function saveMoodHistory({ mood }) {
  const response = await api.post("/api/history", { mood });
  return response.data;
}

export async function fetchWeeklyHistory() {
  const response = await api.get("/api/history/weekly");
  return response.data;
}