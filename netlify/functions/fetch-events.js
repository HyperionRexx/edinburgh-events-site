const fetch = require("node-fetch");

exports.handler = async function (event) {
  const { type, date, price } = event.queryStringParameters || {};
  const apiKey = "SBO6YLP2F9tkYK3KRZKca6ORfdLRVYgS";

  const classificationMap = {
    music: "Music",
    exhibition: "Exhibition",
    theatre: "Theatre",
    workshop: "Workshop",
  };

  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=Edinburgh&countryCode=GB&size=20`;

  if (type && type !== "all" && classificationMap[type]) {
    url += `&classificationName=${classificationMap[type]}`;
  }

  if (date) {
    const startISO = new Date(date + "T00:00:00Z").toISOString();
    const endISO = new Date(date + "T23:59:59Z").toISOString();
    url += `&startDateTime=${startISO}&endDateTime=${endISO}`;
  }

  console.log("Fetching URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("API response:", data);

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
