const fetch = require("node-fetch");
const url = require("url");

exports.handler = async (event, context) => {
  try {
    const { page = 1, size = 6 } = event.queryStringParameters;

    const response = await fetch(
      `https://api.thenewsapi.net/crypto?apikey=${process.env.REACT_APP_NEWS_API_KEY}&page=${page}&size=${size}`
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch news" }),
      };
    }

    const apiData = await response.json();
 
    // Extract pagination info
    const parsePage = (link) => {
      if (!link) return null;
      const query = new url.URL(link).searchParams;
      return {
        page: query.get("page"),
        size: query.get("size"),
      };
    };

    const data = {
      count: apiData.data.count,
      results: apiData.data.results,
      next: parsePage(apiData.data.next),       
      previous: parsePage(apiData.data.previous),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
