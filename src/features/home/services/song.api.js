import axios from "axios";

// Your existing Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Your existing getSong function
export async function getSong({ mood }) {
  const response = await api.get("/api/songs?mood=" + mood);
  return response.data;
}

// THE NEW FUNCTION:
export async function getRecommendations({ mood }) {
  // If a mood is provided, pass it as a query parameter. Otherwise, just call the base route.
  const url = mood 
    ? "/api/songs/recommendations?mood=" + mood 
    : "/api/songs/recommendations";

  const response = await api.get(url);
  return response.data;
}

// ADD THESE TO THE BOTTOM OF YOUR API FILE:

export async function getMoodHistory() {
  const response = await api.get("/api/history");
  return response.data;
}

export async function saveMoodHistory({ mood }) {
  const response = await api.post("/api/history", { mood });
  return response.data;
}