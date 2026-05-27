"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
};

type Holding = {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  quantity: number;
  buyPrice: number;
  buyDate: string;
};

export default function Portfolio({ coins }: { coins: Coin[] }) {
  const { data: session } = useSession();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState(coins[0]?.id || "");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDate, setBuyDate] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (!session?.user?.email) return;
    const saved = localStorage.getItem(`portfolio_${session.user.email}`);
    if (saved) setHoldings(JSON.parse(saved));
    setLoaded(true);
  }, [session?.user?.email]);

  // Save to localStorage whenever holdings change
  useEffect(() => {
    if (!loaded || !session?.user?.email) return;
    localStorage.setItem(
      `portfolio_${session.user.email}`,
      JSON.stringify(holdings),
    );
  }, [holdings, loaded, session?.user?.email]);

  const addHolding = () => {
    if (!quantity || !buyPrice || !buyDate) {
      setError("Please fill in all fields.");
      return;
    }
    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    if (Number(buyPrice) <= 0) {
      setError("Buy price must be greater than 0.");
      return;
    }
    setError("");

    const coin = coins.find((c) => c.id === selectedCoinId);
    if (!coin) return;

    const newHolding: Holding = {
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      buyDate,
    };

    setHoldings([...holdings, newHolding]);
    setQuantity("");
    setBuyPrice("");
    setBuyDate("");
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const getGainLoss = (holding: Holding) => {
    const currentPrice =
      coins.find((c) => c.id === holding.coinId)?.current_price || 0;
    const currentValue = currentPrice * holding.quantity;
    const costBasis = holding.buyPrice * holding.quantity;
    return currentValue - costBasis;
  };

  const isLongTerm = (buyDate: string) => {
    const buy = new Date(buyDate);
    const now = new Date();
    const diffMs = now.getTime() - buy.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 365;
  };

  const totalValue = holdings.reduce((sum, h) => {
    const currentPrice =
      coins.find((c) => c.id === h.coinId)?.current_price || 0;
    return sum + currentPrice * h.quantity;
  }, 0);

  const totalCost = holdings.reduce(
    (sum, h) => sum + h.buyPrice * h.quantity,
    0,
  );

  const totalGainLoss = totalValue - totalCost;

  const shortTermGains = holdings
    .filter((h) => !isLongTerm(h.buyDate))
    .reduce((sum, h) => sum + getGainLoss(h), 0);

  const longTermGains = holdings
    .filter((h) => isLongTerm(h.buyDate))
    .reduce((sum, h) => sum + getGainLoss(h), 0);

  const fetchHistoricalPrice = async (coinId: string, date: string) => {
    if (!coinId || !date) return;
    const [year, month, day] = date.split("-");
    const formatted = `${day}-${month}-${year}`;

    setFetching(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${formatted}`,
      );
      if (!res.ok) {
        setError("Could not fetch historical price. Enter it manually.");
        return;
      }
      const data = await res.json();
      const price = data?.market_data?.current_price?.usd;
      if (price) {
        setBuyPrice(String(price));
        setError("");
      } else {
        setError("No price data for this date. Enter it manually.");
      }
    } catch {
      setError("Could not fetch historical price. Enter it manually.");
    } finally {
      setFetching(false);
    }
  };

  if (!session) {
    return (
      <div className="mt-8 text-center text-gray-500 py-16 border border-gray-800 rounded-xl">
        Please sign in to track your portfolio.
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Add Holding Form */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Add Holding</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <select
            value={selectedCoinId}
            onChange={(e) => {
              setSelectedCoinId(e.target.value);
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-400"
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-400"
          />
          <input
            type="number"
            min="0"
            placeholder="Buy Price (USD)"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-400"
          />
          <input
            type="date"
            value={buyDate}
            onChange={(e) => {
              setBuyDate(e.target.value);
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-400"
          />
        </div>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}

        <button
          onClick={() => fetchHistoricalPrice(selectedCoinId, buyDate)}
          disabled={fetching}
          className="mt-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors mr-2"
        >
          {fetching ? "Fetching..." : "Fetch Historical Price"}
        </button>

        <button
          onClick={addHolding}
          className="mt-4 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Add to Portfolio
        </button>
      </div>

      {/* Summary Cards */}
      {holdings.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Total Value
              </p>
              <p className="text-white text-xl font-bold mt-1">
                $
                {totalValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Total Cost
              </p>
              <p className="text-white text-xl font-bold mt-1">
                $
                {totalCost.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Short Term P&L
              </p>
              <p
                className={`text-xl font-bold mt-1 ${shortTermGains >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {shortTermGains >= 0 ? "+" : ""}$
                {shortTermGains.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Long Term P&L
              </p>
              <p
                className={`text-xl font-bold mt-1 ${longTermGains >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {longTermGains >= 0 ? "+" : ""}$
                {longTermGains.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="mt-6 rounded-xl overflow-hidden border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">Coin</th>
                  <th className="p-4 text-right">Quantity</th>
                  <th className="p-4 text-right">Buy Price</th>
                  <th className="p-4 text-right">Current Price</th>
                  <th className="p-4 text-right">P&L</th>
                  <th className="p-4 text-right">Term</th>
                  <th className="p-4 text-right">Remove</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => {
                  const gainLoss = getGainLoss(holding);
                  const currentPrice =
                    coins.find((c) => c.id === holding.coinId)?.current_price ||
                    0;
                  return (
                    <tr
                      key={index}
                      className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <Image
                          src={holding.image}
                          alt={holding.name}
                          width={24}
                          height={24}
                        />
                        <span className="font-medium">{holding.name}</span>
                        <span className="text-gray-500 uppercase">
                          {holding.symbol}
                        </span>
                      </td>
                      <td className="p-4 text-right">{holding.quantity}</td>
                      <td className="p-4 text-right">
                        ${holding.buyPrice.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        ${currentPrice.toLocaleString()}
                      </td>
                      <td
                        className={`p-4 text-right font-medium ${gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {gainLoss >= 0 ? "+" : ""}$
                        {gainLoss.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${isLongTerm(holding.buyDate) ? "bg-blue-900 text-blue-300" : "bg-yellow-900 text-yellow-300"}`}
                        >
                          {isLongTerm(holding.buyDate) ? "Long" : "Short"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => removeHolding(index)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {holdings.length === 0 && (
        <div className="mt-8 text-center text-gray-500 py-16 border border-gray-800 rounded-xl">
          No holdings yet. Add a coin above to get started.
        </div>
      )}
    </div>
  );
}
