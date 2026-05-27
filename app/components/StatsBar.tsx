type Coin = {
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
};

export default function StatsBar({ coins }: { coins: Coin[] }) {
  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const best = coins.reduce((a, b) =>
    a.price_change_percentage_24h > b.price_change_percentage_24h ? a : b,
  );
  const worst = coins.reduce((a, b) =>
    a.price_change_percentage_24h < b.price_change_percentage_24h ? a : b,
  );

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-gray-400 text-xs uppercase tracking-wide">
          Total Market Cap
        </p>
        <p className="text-white text-xl font-bold mt-1">
          ${(totalMarketCap / 1e12).toFixed(2)}T
        </p>
      </div>
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-gray-400 text-xs uppercase tracking-wide">
          Best 24h
        </p>
        <p className="text-green-400 text-xl font-bold mt-1">{best.name}</p>
        <p className="text-green-300 text-sm">
          +{best.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-gray-400 text-xs uppercase tracking-wide">
          Worst 24h
        </p>
        <p className="text-red-400 text-xl font-bold mt-1">{worst.name}</p>
        <p className="text-red-300 text-sm">
          {worst.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
