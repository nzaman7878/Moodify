export const updateTimelineNote = async (timelineId, noteText) => {
  console.log("Sending request to:", `http://localhost:3000/api/timeline/${timelineId}`); // Check the browser console!
  
  const response = await fetch(`http://localhost:3000/api/timeline/${timelineId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteText }),
    credentials: 'include' 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Server responded with:", errorData);
    throw new Error(`Failed to update note: ${response.statusText}`);
  }

  return response.json();
};