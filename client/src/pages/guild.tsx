import { useState } from "react";
import { useRouter } from "next/router";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth_context";

export default function GuildPage() {
  const [guildName, setGuildName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { accessToken } = useAuth();

  const handleCreate = async () => {
    if (!guildName) {
      alert("Vui lòng nhập tên guild");
      return;
    }


    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.guilds.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          guild_name: guildName,
          description, // gửi lên description thay vì email
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Tạo guild thất bại");
      }

      // Điều hướng sang trang chi tiết guild
      router.push(`/${guildName}`);
    } catch (err: any) {
      console.error("Lỗi tạo guild:", err);
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] flex items-center justify-center text-white">
      <div className="bg-[#2c2c35] w-[400px] p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Begin your guild</h2>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#3a3a48] rounded-full flex items-center justify-center">
            🖼️
          </div>
        </div>
        <label className="block mb-2">Guild name</label>
        <input
          className="w-full px-4 py-2 mb-4 rounded-md bg-[#1f1f29] border border-[#3a3a48]"
          placeholder="your guild name"
          value={guildName}
          onChange={(e) => setGuildName(e.target.value)}
        />
        <label className="block mb-2">Description</label>
        <textarea
          className="w-full px-4 py-2 mb-6 rounded-md bg-[#1f1f29] border border-[#3a3a48] resize-none"
          placeholder="describe your guild"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-md font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create guild"}
        </button>

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
