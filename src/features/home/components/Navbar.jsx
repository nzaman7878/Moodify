import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = () => {
  const { user, handleLogout, loading } = useAuth();

  async function logoutUser() {
    await handleLogout();
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-4">
        
        {/* BRANDING: Logo & Animated Bars */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex h-10 w-10 items-end justify-center gap-1 rounded-xl bg-white/5 p-2 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
            <span className="h-3 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
            <span className="h-5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="h-4 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-200 to-white drop-shadow-lg">
            Moodify
          </h1>
        </div>

        {/* USER PROFILE: Glassmorphic Pill */}
        <div className="flex items-center">
          <div className="flex items-center gap-4 rounded-full bg-white/5 pl-5 pr-2 py-2 ring-1 ring-white/10 transition-colors hover:bg-white/10 shadow-inner">
            
            <div className="hidden md:flex flex-col items-end justify-center">
              <p className="text-sm font-black tracking-wide text-white drop-shadow-md">
                {user?.username || "Guest"}
              </p>
              
              {user ? (
                <button
                  onClick={logoutUser}
                  disabled={loading}
                  className="mt-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 transition-colors hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              ) : (
                <span className="mt-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Not logged in
                </span>
              )}
            </div>
            
            {/* Avatar with glowing ring */}
            <div className="relative shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${
                  user?.username || "Guest"
                }&background=0b1128&color=22d3ee&bold=true`}
                alt="profile"
                className="h-10 w-10 rounded-full border border-cyan-400/50 object-cover shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              />
              {/* Online Indicator */}
              {user && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1120] bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              )}
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;