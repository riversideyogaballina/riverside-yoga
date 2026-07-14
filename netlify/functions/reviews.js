const PLACE_ID = 'ChIJm5QSiymBkGsRQv8PvoV5txk';

exports.handler = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing GOOGLE_PLACES_API_KEY' })
    };
  }

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount'
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Google Places API error', detail: text })
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=21600'
      },
      body: JSON.stringify({
        rating: data.rating ?? null,
        userRatingCount: data.userRatingCount ?? null,
        reviews: (data.reviews ?? [])
          .map(r => ({
            authorName: r.authorAttribution?.displayName ?? 'Anonymous',
            authorPhoto: r.authorAttribution?.photoUri ?? null,
            rating: r.rating ?? null,
            text: r.text?.text ?? r.originalText?.text ?? '',
            relativeTime: r.relativePublishTimeDescription ?? null,
            publishTime: r.publishTime ?? null
          }))
          .sort((a, b) => {
            const ta = a.publishTime ? Date.parse(a.publishTime) : 0;
            const tb = b.publishTime ? Date.parse(b.publishTime) : 0;
            return tb - ta;
          })
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Fetch failed', detail: err.message })
    };
  }
};
