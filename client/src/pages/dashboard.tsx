import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Guild } from "@/types/guild";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth_context";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const [myGuilds, setMyGuilds] = useState<Guild[]>([]);
  const [exploreGuilds, setExploreGuilds] = useState<Guild[]>([]);
  const [rawExploreGuilds, setRawExploreGuilds] = useState<Guild[]>([]);

  // Fetch explore guilds (public)
  // Fetch explore guilds (public)
  useEffect(() => {
    const fetchExploreGuilds = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.guilds.explore}?min_members=1`);
        const data = await res.json();

        if (Array.isArray(data)) {
          // setExploreGuilds(data); // ✅ đúng: lưu vào exploreGuilds
          setRawExploreGuilds(data); // ✅ đúng: lưu vào rawExploreGuilds
        } else {
          console.error("Explore guilds không phải mảng:", data);
          setRawExploreGuilds([]); // fallback
        }
      } catch (err) {
        console.error("Lỗi khi tải explore guilds:", err);
        setRawExploreGuilds([]);
      }
    };

    fetchExploreGuilds();
  }, []);

  // Fetch my guilds nếu đã đăng nhập
  const fetchMyGuilds = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_ENDPOINTS.guilds.me}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("✅ myGuilds response:", data);

      if (Array.isArray(data)) {
        setMyGuilds(data);
      } else {
        console.warn("⚠️ Không phải array:", data);
        setMyGuilds([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải my guilds:", err);
    }
  };

  // Gọi khi isAuthenticated = true
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyGuilds();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!rawExploreGuilds.length) return;

    if (!isAuthenticated || myGuilds.length === 0) {
      setExploreGuilds(rawExploreGuilds); // nếu chưa login thì show hết
      return;
    }

    const myGuildNames = new Set(myGuilds.map((g) => g.guild_name));
    const filtered = rawExploreGuilds.filter((g) => !myGuildNames.has(g.guild_name));
    setExploreGuilds(filtered);
  }, [isAuthenticated, myGuilds, rawExploreGuilds]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Guilds</h1>
          <div className="flex gap-3">
            {!isAuthenticated && (
              <button
                onClick={() => router.push("/login")}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Login
              </button>
            )}


            {isAuthenticated && (
              <>
                <button
                  onClick={() => router.push("/guild")}
                  className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  + Create Guild
                </button>
                <button
                  onClick={() => logout()}
                  className="bg-red-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>

        {/* My Guilds */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-4">Your Guilds</h2>

          {!isAuthenticated ? (
            <p className="text-gray-400 italic">Please log in to view your guilds.</p>
          ) : myGuilds.length === 0 ? (
            <p className="text-gray-400 italic">
              You haven&apos;t joined any guilds. Please join or create one.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myGuilds.map((guild) => (
                <div
                  onClick={() => router.push(`/${guild.guild_name}`)}
                  key={guild.id}
                  className="bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl p-4 hover:border-white/30 transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🏰</div>
                    <div className="text-lg font-bold">{guild.guild_name}</div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {guild.members.length} member{guild.members.length > 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Explore Guilds */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Explore Guilds</h2>
          {exploreGuilds.length === 0 ? (
            <p className="text-gray-500 italic">No public guilds to explore.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {exploreGuilds.map((guild) => (
                <div
                  key={guild.id}
                  onClick={() => router.push(`/${guild.guild_name}`)}
                  className="cursor-pointer bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl p-4 hover:border-white/30 transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🏰</div>
                    <div className="text-lg font-bold">{guild.guild_name}</div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {guild.members.length} member{guild.members.length > 1 ? "s" : ""}
                  </p>
                  {guild.description && (
                    <p className="text-sm text-gray-500 italic mb-3">{guild.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
