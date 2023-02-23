export function coinFetch() {
  return fetch("https://api.coinpaprika.com/v1/coins").then((res) =>
    res.json()
  );
}

export function coinInfoFetch(coinId: string) {
  return fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`).then((res) =>
    res.json()
  );
}

export function coinPriceInfoFetch(coinId: string) {
  return fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`).then((res) =>
    res.json()
  );
}

export async function coinHistoryPriceInfoFetch(coinId: string) {
  const response = await fetch(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
  );
  if (!response.ok) {
    return null;
  }
  return response.json();
}
