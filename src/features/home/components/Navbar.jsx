import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = () => {
  const { user, handleLogout, loading } = useAuth();

  async function logoutUser() {
    await handleLogout();
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            M
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Moodify
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />

            <div className="hidden md:block">
              <p className="font-semibold">
                {user?.username || "Guest"}
              </p>
              <p className="text-sm text-gray-500">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            {loading ? "..." : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;