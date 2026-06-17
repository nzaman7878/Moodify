export const initCamera = async (videoRef) => {
  const stream =
    await navigator.mediaDevices.getUserMedia({
      video: true,
    });

  videoRef.current.srcObject = stream;
  await videoRef.current.play();

  return stream;
};