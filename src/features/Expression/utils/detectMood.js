export const detectMood = (blendshapes) => {
  const getScore = (name) =>
    blendshapes.find(
      (item) => item.categoryName === name
    )?.score || 0;

  const smileLeft = getScore("mouthSmileLeft");
  const smileRight = getScore("mouthSmileRight");

  const jawOpen = getScore("jawOpen");
  const browUp = getScore("browInnerUp");

  const frownLeft = getScore("mouthFrownLeft");
  const frownRight = getScore("mouthFrownRight");

  const browDownLeft = getScore("browDownLeft");
  const browDownRight = getScore("browDownRight");

  if (smileLeft > 0.4 && smileRight > 0.4) {
    return "Happy";
  }

  if (jawOpen > 0.55 && browUp > 0.4) {
    return "Surprised";
  }

  if (frownLeft > 0.3 && frownRight > 0.3) {
    return "Sad";
  }

  if (browDownLeft > 0.4 && browDownRight > 0.4) {
    return "Angry";
  }

  return "Neutral";
};