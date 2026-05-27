type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
};

export default function CoinTable({ coins }: { coins: Coin[] }) {
  return (
    <div className="mt-8 rounded-xl overflow-hidden border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Coin</th>
            <th className="p-4 text-right">Price</th>
            <th className="p-4 text-right">24h Change</th>
            <th className="p-4 text-right">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr
              key={coin.id}
              className="border-t border-gray-800 hover:bg-gray-900 transition-colors"
            >
              <td className="p-4 flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
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
  );
}
