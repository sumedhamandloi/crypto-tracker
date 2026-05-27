"use client";

import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Portfolio from "./Portfolio";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
};

export default function TabView({ coins }: { coins: Coin[] }) {
  const [activeTab, setActiveTab] = useState<"market" | "portfolio">("market");

  return (
    <div className="mt-6">
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("market")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "market"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "portfolio"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Portfolio
        </button>
      </div>

      {activeTab === "market" && <SearchBar coins={coins} />}
      {activeTab === "portfolio" && <Portfolio coins={coins} />}
    </div>
  );
}