import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = () => {
  const { user, handleLogout, loading } = useAuth();

  async function logoutUser() {
    await handleLogout();
  }

  return (
    <nav className="border-b border-white/10 bg-[#0b1128]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-5">
        
  
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-end justify-center gap-0.5 rounded-lg bg-violet-500/10 p-1.5 text-cyan-200">
            <span className="h-3 w-1 rounded-full bg-violet-400" />
            <span className="h-5 w-1 rounded-full bg-cyan-300" />
            <span className="h-4 w-1 rounded-full bg-blue-300" />
          </div>

          <h1 className="text-2xl font-black text-violet-200">
            Moodify
          </h1>
        </div>

      
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden md:block">
              <p className="font-black leading-tight text-white">
                {user?.username || "Guest"}
              </p>
              
              
              {user ? (
                <button
                  onClick={logoutUser}
                  disabled={loading}
                  className="text-sm font-bold leading-tight text-cyan-200 transition hover:text-cyan-100 disabled:opacity-50"
                >
                  {loading ? "..." : "logout"}
                </button>
              ) : (
                <span className="text-sm font-bold leading-tight text-slate-500">
                  Not logged in
                </span>
                
              )}
            </div>
            
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.username || "Guest"
              }&background=0b1128&color=a5b4fc&bold=true`}
              alt="profile"
              className="h-12 w-12 rounded-full border-2 border-cyan-200/30 object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;