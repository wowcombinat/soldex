// Это заглушка. В реальном приложении здесь будут API-запросы к источнику данных о токенах
export const getTokenPrice = async (fromTokenAddress, toTokenAddress) => {
  // Имитация получения курса обмена
  return Math.random() * 10;
};

export const getTop100Tokens = async () => {
  // Имитация получения топ-100 токенов
  return [
    { address: "SOL", symbol: "SOL", name: "Solana", logoURI: "https://cryptologos.cc/logos/solana-sol-logo.png" },
    { address: "USDC", symbol: "USDC", name: "USD Coin", logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
    // Добавьте больше токенов здесь...
  ];
};
