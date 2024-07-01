import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getTokenPrice = async (fromTokenAddress, toTokenAddress) => {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: `${fromTokenAddress},${toTokenAddress}`,
        vs_currencies: 'usd'
      }
    });
    const fromPrice = response.data[fromTokenAddress].usd;
    const toPrice = response.data[toTokenAddress].usd;
    return fromPrice / toPrice;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
};

export const getTop100Tokens = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });
    return response.data.map(token => ({
      address: token.id,
      symbol: token.symbol.toUpperCase(),
      name: token.name,
      logoURI: token.image
    }));
  } catch (error) {
    console.error('Error fetching top tokens:', error);
    return [];
  }
};
