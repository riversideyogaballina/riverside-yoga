const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error('subscribe: missing MAILERLITE_API_KEY');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server misconfigured' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  const { email, groupId, name, phone, ...rest } = payload;

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'A valid email address is required' })
    };
  }

  if (!groupId || typeof groupId !== 'string') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'groupId is required' })
    };
  }

  const fields = {};
  if (name) fields.name = name;
  if (phone) fields.phone = phone;
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null && value !== '') fields[key] = value;
  }

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        email: email.trim(),
        fields,
        groups: [groupId]
      })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error('subscribe: MailerLite API error', res.status, data);
      return {
        statusCode: res.status === 429 ? 429 : 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Subscription failed',
          detail: data?.message ?? 'MailerLite API error'
        })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('subscribe: request to MailerLite failed', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Subscription failed', detail: err.message })
    };
  }
};
