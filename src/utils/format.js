// Format large numbers like 1,234,567 → 1.23M
export const formatNumber = (num) => {
    if (!num && num !== 0) return "-";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  };
  
  // Format percentage with 2 decimals
  export const formatPercent = (num) => {
    if (num === null || num === undefined) return "-";
    return `${num.toFixed(2)}%`;
  };
  
  // Format currency to USD (default) or other
  export const formatCurrency = (num, currency = "USD") => {
    if (!num && num !== 0) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(num);
  };
  