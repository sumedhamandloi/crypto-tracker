"use client";

import Image from "next/image";
import { useState } from "react";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
};

type SortKey = "market_cap" | "current_price" | "price_change_percentage_24h";

export default function SearchBar({ coins }: { coins: Coin[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const filtered = coins
    .filter((coin) => coin.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const mult = sortAsc ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mult;
    });

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 text-gray-500">
      {sortKey === k ? (sortAsc ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="Search coins..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
      />
      <div className="mt-4 rounded-xl overflow-hidden border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Coin</th>
              <th
                className="p-4 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort("current_price")}
              >
                Price <SortIcon k="current_price" />
              </th>
              <th
                className="p-4 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort("price_change_percentage_24h")}
              >
                24h Change <SortIcon k="price_change_percentage_24h" />
              </th>
              <th
                className="p-4 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort("market_cap")}
              >
                Market Cap <SortIcon k="market_cap" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((coin) => (
              <tr
                key={coin.id}
                className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
              >
                <td className="p-4 flex items-center gap-3">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-gray-500 uppercase">{coin.symbol}</span>
                </td>
                <td className="p-4 text-right">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td
                  className={`p-4 text-right font-medium ${coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="p-4 text-right text-gray-300">
                  ${(coin.market_cap / 1e9).toFixed(2)}B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}