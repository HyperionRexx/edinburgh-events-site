const fetch = require("node-fetch");

exports.handler = async function (event) {
  const { type, date, price } = event.queryStringParameters;
  const apiKey = "SBO6YLP2F9tkYK3KRZKca6ORfdLRVYgS";
  const keywordMap = {
    music: "music",
    exhibition: "exhibition",
    theatre: "theatre",
    workshop: "workshop",
  };

  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=Edinburgh&countryCode=GB&size=12`;

  if (type && type !== "all") url += `&keyword=${keywordMap[type]}`;
  if (date) {
    const startISO = new Date(date + "T00:00:00Z").toISOString();
    const endISO = new Date(date + "T23:59:59Z").toISOString();
    url += `&startDateTime=${startISO}&endDateTime=${endISO}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("API fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch events" }),
    };
  }
};
