/* =========================================================
   Donation configuration
   ---------------------------------------------------------
   Edit the addresses below. Leave "address" empty ("") to
   show a "coming soon" note until a wallet is available.
   For Telegram Stars, fill "link" instead of "address".
   ========================================================= */
window.DONATE_CONFIG = {
  btc: {
    name: "Bitcoin",
    network: "Bitcoin (BTC)",
    icon: "₿",
    color: "#f7931a",
    address: "", // TODO: add Bitcoin address
    link: ""
  },
  ton: {
    name: "Toncoin (TON)",
    network: "TON — The Open Network",
    icon: "💎",
    color: "#087ff5",
    address: "UQB4K1nzUFXzzge5F9kzPXq5FuuhHgEBzKG-FZ9qsSDovOPv",
    link: ""
  },
  usdt: {
    name: "Tether (TRC20)",
    network: "USDT on TRON (TRC20)",
    icon: "₮",
    color: "#26a17b",
    address: "TSp9wjbTbW8XLqGU1FWkx7bVM9sBpWX39w",
    link: ""
  },
  pol: {
    name: "Polygon (POL)",
    network: "Polygon PoS",
    icon: "⬡",
    color: "#8247e5",
    address: "0x64C1233B9bE8140b4B0Bf1275FE3B4c4433f0E34",
    link: ""
  },
  stars: {
    name: "Telegram Stars",
    network: "Donate via Telegram",
    icon: "★",
    color: "#f5a623",
    address: "",
    link: "https://t.me/omidlabs"
  }
};