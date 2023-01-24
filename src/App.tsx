import React, { useState, useEffect, useMemo } from 'react';

interface Crypto {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const fetchCryptoPrices = async (): Promise<Crypto[]> => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices');
  }
  const data = await response.json() as Crypto[];
  return data;
};

const CryptoTable = (): JSX.Element => {
  const [cryptoPrices, setCryptoPrices] = useState<Crypto[]>([]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const data = await fetchCryptoPrices();
      setCryptoPrices(data);
    }, 120000);
    return () => clearInterval(intervalId);
  }, []);

  const tableData = useMemo(() => {
    return cryptoPrices.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      price: crypto.current_price,
      priceChange24h: crypto.price_change_percentage_24h,
      logo: crypto.image,
    }));
  }, [cryptoPrices]);

  return (
    <table>
      <thead>
        <tr>
          <th>Logo</th>
          <th>Coin</th>
          <th>Price (USD)</th>
          <th>Price Change (24h)</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((crypto) => (
          <tr key={crypto.id}>
            <td>
              <img src={crypto.logo} alt={crypto.name} width={24} height={24} />
            </td>
            <td>{crypto.name}</td>
            <td>{crypto.price}</td>
            <td>{crypto.priceChange24h.toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


const App = () => {
  return (
    <CryptoTable />
  )
};

export default App;

