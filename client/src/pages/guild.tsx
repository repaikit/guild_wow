import { useState } from "react";

export default function GuildPage() {
  const [guildName, setGuildName] = useState("");
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!guildName || !email) return alert("Vui lòng nhập đầy đủ");
    setCreated(true); // hiển thị giao diện guild sau khi tạo
  };

  if (!created) {
    // Giao diện form tạo guild
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
          <label className="block mb-2">Your e-mail</label>
          <input
            className="w-full px-4 py-2 mb-6 rounded-md bg-[#1f1f29] border border-[#3a3a48]"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-md font-semibold"
          >
            Create guild
          </button>
        </div>
      </div>
    );
  }

  // Giao diện sau khi đã tạo guild
  return (
    <div className="min-h-screen bg-[#0e0e12] text-white p-6 font-sans">
      <div className="text-4xl font-bold mb-6 flex items-center gap-3">
        🍸 <span>{guildName}</span>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3 bg-[#2c2c35] p-4 rounded-xl">
          <p className="text-lg mb-2 font-semibold">Create page</p>
          <button className="px-4 py-2 bg-[#1f1f29] border border-[#3a3a48] rounded-lg">
            + Create page
          </button>
        </div>

        <div className="w-2/3 bg-[#2c2c35] p-4 rounded-xl flex justify-between">
          <div>
            <p className="text-lg font-bold mb-2">👾 Member</p>
            <p className="text-sm text-gray-400">1 member</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-400">✅ You have access</p>
            <p className="text-sm text-gray-400 mt-1">Open access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
