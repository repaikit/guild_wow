import { useState } from "react";
import { useRouter } from "next/router";

const myGuilds = [
  {
    id: 1,
    name: "My Web3 Crew",
    members: 5,
    image: "🦄",
  },
{
        id: 5,
        name: "Blockchain Devs",
        members: 8,
        image: "👨‍💻",
},
{
        id: 6,
        name: "NFT Collectors",
        members: 15,
        image: "🖼️",
},
];

const exploreGuilds = [
  { id: 2, name: "Crypto Artists", members: 34, image: "🎨" },
  { id: 3, name: "DeFi Ninjas", members: 12, image: "🥷" },
  { id: 4, name: "DAO Builders", members: 21, image: "🏗️" },
];

export default function Dashboard() {
 const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Guilds</h1>
          <button
            onClick={() => router.push("/guild")}
            className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            + Create Guild
          </button>
        </div>

        {/* My Guilds */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-4">Your Guilds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myGuilds.map((guild) => (
              <div
                key={guild.id}
                className="bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl p-4 hover:border-white/30 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{guild.image}</div>
                  <div className="text-lg font-bold">{guild.name}</div>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {guild.members} member{guild.members > 1 ? "s" : ""}
                </p>
                <button className="text-sm bg-white text-black px-4 py-1.5 rounded-md font-semibold hover:bg-gray-300">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Guilds */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Explore Guilds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {exploreGuilds.map((guild) => (
              <div
                key={guild.id}
                className="bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl p-4 hover:border-white/30 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{guild.image}</div>
                  <div className="text-lg font-bold">{guild.name}</div>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {guild.members} member{guild.members > 1 ? "s" : ""}
                </p>
                <button className="text-sm bg-white text-black px-4 py-1.5 rounded-md font-semibold hover:bg-gray-300">
                  View
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
