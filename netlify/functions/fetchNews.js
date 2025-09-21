export async function handler(event, context) {
  try {
    // Get query params (page, size) from frontend request
    const { page = 1, size = 10 } = event.queryStringParameters;

    const url = `https://api.thenewsapi.net/crypto?apikey=${process.env.REACT_APP_NEWS_API_KEY}&page=${page}&size=${size}`;

    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
