
const NeutralFace = ({ small = false }) => (
  <div
    className={`relative rounded-full bg-yellow-300 shadow-[0_0_22px_rgba(250,204,21,0.35)] ${
      small ? "h-5 w-5" : "h-28 w-28"
    }`}
  >
    <span
      className={`absolute rounded-full bg-amber-900 ${
        small ? "left-1.5 top-1.5 h-1 w-1" : "left-8 top-10 h-3 w-3"
      }`}
    />
    <span
      className={`absolute rounded-full bg-amber-900 ${
        small ? "right-1.5 top-1.5 h-1 w-1" : "right-8 top-10 h-3 w-3"
      }`}
    />
    <span
      className={`absolute rounded-full bg-amber-900 ${
        small
          ? "bottom-1.5 left-1/2 h-0.5 w-2 -translate-x-1/2"
          : "bottom-8 left-1/2 h-1.5 w-10 -translate-x-1/2"
      }`}
    />
  </div>
);

export default NeutralFace;