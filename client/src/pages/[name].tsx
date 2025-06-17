import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth_context";

export default function GuildDetailPage() {
  const router = useRouter();
  const { name } = router.query;
  const [error, setError] = useState("");
  const [guild, setGuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const { user, accessToken } = useAuth();

  useEffect(() => {
    if (!name) return;

    const fetchGuild = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.guilds.search(name as string));
        const data = await res.json();
        const exact = data.find((g: any) => g.guild_name === name);
        if (exact) {
          setGuild(exact);
          setIsMember(exact.members?.includes(user?._id));

        } else {
          router.replace("/404");
        }
      } catch (err) {
        console.error("Lỗi khi tải guild:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuild();
  }, [name]);

  const handleJoin = async () => {
  setJoining(true);
  setError("");
  try {
    const res = await fetch(API_ENDPOINTS.guilds.join, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ guild_name: guild.guild_name }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Tham gia thất bại");
    }

    alert(`Đã tham gia guild ${guild.guild_name} thành công!`);

    // ✅ Cập nhật state thay vì reload
    setGuild((prev: any) => ({
      ...prev,
      members: [...prev.members, user?._id],
    }));
    setIsMember(true);

  } catch (err: any) {
    setError(err.message || "Có lỗi xảy ra");
  } finally {
    setJoining(false);
  }
};

  const handleLeave = async () => {
  setLeaving(true);
  setError("");
  try {
    const res = await fetch(API_ENDPOINTS.guilds.leave, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ guild_name: guild.guild_name }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Rời guild thất bại");
    }

    alert(`Đã rời guild ${guild.guild_name} thành công`);

    // ✅ Cập nhật state thay vì reload
    setGuild((prev: any) => ({
      ...prev,
      members: prev.members.filter((id: string) => id !== user?._id),
    }));
    setIsMember(false);

  } catch (err: any) {
    setError(err.message || "Có lỗi xảy ra");
  } finally {
    setLeaving(false);
  }
};


  if (loading) return <div className="text-white p-8">Loading guild info...</div>;
  if (!guild) return <div className="text-white p-8">Không tìm thấy guild</div>;

  return (
    <div className="min-h-screen bg-[#0e0e12] text-white p-6 font-sans">
      <div className="text-4xl font-bold mb-6 flex items-center gap-3">
        🏰 <span>{guild.guild_name}</span>
      </div>

      <p className="text-sm text-gray-400 mb-6">Chủ guild: {guild.owner_name || "unknown"}</p>

      <div className="flex gap-6">
        <div className="w-1/3 bg-[#2c2c35] p-4 rounded-xl">
          <p className="text-lg mb-2 font-semibold">Create page</p>
          <button
            onClick={() => alert("This feature is under development.")}
            className="px-4 py-2 bg-[#1f1f29] border border-[#3a3a48] rounded-lg"
          >
            + Create page
          </button>
        </div>

        <div className="w-2/3 bg-[#2c2c35] p-4 rounded-xl flex justify-between items-start">
          <div>
            <p className="text-lg font-bold mb-2">👾 Member</p>
            <p className="text-sm text-gray-400">{guild.members?.length || 0} member(s)</p>
          </div>

          <div className="text-right space-y-2">
            <p className="text-sm text-green-400">✅ Open access</p>
            <p className="text-sm text-gray-400">Anyone can join</p>

            {!isMember ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {joining ? "Joining..." : "Join guild"}
              </button>
            ) : (
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {leaving ? "Leaving..." : "Leave guild"}
              </button>
            )}

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
