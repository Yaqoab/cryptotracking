import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

// --- Axios instance with retry + timeout ---
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout
});

// Retry failed requests up to 3 times
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!err.config.__retryCount) err.config.__retryCount = 0;

    if (err.config.__retryCount < 3) {
      err.config.__retryCount += 1;
      console.warn(`Retrying request... attempt ${err.config.__retryCount}`);
      return api(err.config);
    }

    return Promise.reject(err);
  }
);

// --- LocalStorage cache helpers ---
const setCache = (key, data, ttl = 60000) => {
  const record = { data, expiry: Date.now() + ttl };
  localStorage.setItem(key, JSON.stringify(record));
};

const getCache = (key) => {
  const record = localStorage.getItem(key);
  if (!record) return null;

  const parsed = JSON.parse(record);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return parsed.data;
};

// --- Helper: handle API errors ---
const handleError = (error, context = "API") => {
  if (error.response) {
    console.error(`${context} Error:`, error.response.status, error.response.data);
  } else if (error.request) {
    console.error(`${context} No response:`, error.request);
  } else {
    console.error(`${context} Setup Error:`, error.message);
  }
  return [];
};

// --- Coins list ---
export const getCoins = async (page = 1, perPage = 50, forceRefresh = false) => {
  const cacheKey = `coins_${page}_${perPage}`;

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await api.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: perPage,
        page,
        price_change_percentage: "1h,24h,7d,30d,1y",
      },
    });

    const formatted = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      market_cap: coin.market_cap ?? 0,
      volume_24h: coin.total_volume ?? 0,
      price_change_percentage_1h: coin.price_change_percentage_1h_in_currency ?? 0,
      price_change_percentage_24h: coin.price_change_percentage_24h_in_currency ?? 0,
      price_change_percentage_7d: coin.price_change_percentage_7d_in_currency ?? 0,
      price_change_percentage_30d: coin.price_change_percentage_30d_in_currency ?? 0,
      price_change_percentage_1y: coin.price_change_percentage_1y_in_currency ?? 0,
    }));

    setCache(cacheKey, formatted, 60000); // 1 min cache
    return formatted;
  } catch (error) {
    return handleError(error, "getCoins");
  }
};

// --- Coin details ---
export const getCoinById = async (id, forceRefresh = false) => {
  const cacheKey = `coin_${id}`;

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await api.get(`/coins/${id}`);
    setCache(cacheKey, data, 60000);
    return data;
  } catch (error) {
    return handleError(error, "getCoinById");
  }
};

// --- Search coins ---
export const searchCoins = async (query, forceRefresh = false) => {
  const cacheKey = `search_${query}`;

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await api.get("/search", { params: { query } });
    const formatted = data.coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.thumb,
    }));

    setCache(cacheKey, formatted, 60000);
    return formatted;
  } catch (error) {
    return handleError(error, "searchCoins");
  }
};

// --- Global stats ---
export const getGlobalStats = async (forceRefresh = false) => {
  const cacheKey = "global_stats";

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await api.get("/global");
    setCache(cacheKey, data.data, 60000);
    return data.data;
  } catch (error) {
    return handleError(error, "getGlobalStats");
  }
};

// --- Trending coins ---
export const getTrending = async (forceRefresh = false) => {
  const cacheKey = "trending";

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await api.get("/search/trending");
    const ids = data.coins.map(({ item }) => item.id).join(",");

    const { data: coins } = await api.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        ids,
        price_change_percentage: "1h,24h,7d,30d,1y",
      },
    });

    const formatted = coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      price_change_percentage_1h: coin.price_change_percentage_1h_in_currency ?? 0,
      price_change_percentage_24h: coin.price_change_percentage_24h_in_currency ?? 0,
      price_change_percentage_7d: coin.price_change_percentage_7d_in_currency ?? 0,
      price_change_percentage_30d: coin.price_change_percentage_30d_in_currency ?? 0,
      price_change_percentage_1y: coin.price_change_percentage_1y_in_currency ?? 0,
      market_cap: coin.market_cap ?? 0,
      volume_24h: coin.total_volume ?? 0,
    }));

    setCache(cacheKey, formatted, 60000);
    return formatted;
  } catch (error) {
    return handleError(error, "getTrending");
  }
};

// --- Top gainers ---
export const getTopGainers = async (forceRefresh = false) => {
  const cacheKey = "top_gainers";

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const coins = await getCoins(1, 100, forceRefresh);
    const top = coins
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 10);

    setCache(cacheKey, top, 60000);
    return top;
  } catch (error) {
    return handleError(error, "getTopGainers");
  }
};

// --- Top losers ---
export const getTopLosers = async (forceRefresh = false) => {
  const cacheKey = "top_losers";

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const coins = await getCoins(1, 100, forceRefresh);
    const losers = coins
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 10);

    setCache(cacheKey, losers, 60000);
    return losers;
  } catch (error) {
    return handleError(error, "getTopLosers");
  }
};

// --- NEW: Coin details (alias) ---
export const getCoinDetails = getCoinById;

// --- NEW: Coin market chart ---
export const getCoinMarketChart = async (id, days = 7, forceRefresh = false) => {
  const cacheKey = `chart_${id}_${days}`;

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await api.get(`/coins/${id}/market_chart`, {
      params: { vs_currency: "usd", days },
    });

    setCache(cacheKey, data, 60000);
    return data;
  } catch (error) {
    return handleError(error, "getCoinMarketChart");
  }
};
