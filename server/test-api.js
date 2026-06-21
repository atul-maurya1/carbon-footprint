// server/test-api.js
/**
 * CarbonTrace Integration Test Suite
 * Run with: node test-api.js [API_URL]
 */

const API_BASE = process.argv[2] || 'http://localhost:3001/api/v1';
const HEALTH_URL = API_BASE.replace('/api/v1', '/health');

const testUser = {
  email: `test_warrior_${Date.now()}@example.com`,
  password: 'Password123!',
  displayName: 'Test Eco Warrior'
};

let authToken = '';

async function runTests() {
  console.log('🌿 Starting CarbonTrace API Integration Tests...');
  console.log(`🌐 Target Endpoint: ${API_BASE}`);
  console.log(`🏥 Health Check: ${HEALTH_URL}\n`);

  try {
    // 1. Health Check
    await assertGet(HEALTH_URL, 'Health Check Endpoint', (data) => {
      return data.status === 'ok';
    });

    // 2. Register New User
    const regRes = await assertPost(`${API_BASE}/auth/register`, 'User Registration', testUser, (data) => {
      const isOk = data.success === true && data.data?.token && data.data?.user?.email === testUser.email;
      if (isOk) authToken = data.data.token;
      return isOk;
    });

    // 3. User Login
    await assertPost(`${API_BASE}/auth/login`, 'User Login', {
      email: testUser.email,
      password: testUser.password
    }, (data) => {
      return data.success === true && data.data?.token !== undefined;
    });

    // 4. Authenticated /me Profile Retrieval
    await assertGet(`${API_BASE}/auth/me`, 'Get Profile (/auth/me)', (data) => {
      return data.success === true && data.data?.displayName === testUser.displayName;
    }, authToken);

    // 5. Fetch AI Recommendations
    await assertGet(`${API_BASE}/ai/recommendations`, 'Get AI Recommendations', (data) => {
      return data.success === true && Array.isArray(data.data) && data.data.length > 0;
    }, authToken);

    // 6. Test Chatbot Endpoint
    await assertPost(`${API_BASE}/ai/chat`, 'AI Coach Chat', {
      message: 'Hello Eco! How can I save carbon on transport?',
      history: []
    }, (data) => {
      return data.success === true && typeof data.data?.reply === 'string' && data.data?.reply.length > 0;
    }, authToken);

    // 7. Post Activity Log
    let activityId = '';
    await assertPost(`${API_BASE}/activities`, 'Post Activity Log (Transport)', {
      category: 'transport',
      subcategory: 'car_gasoline',
      quantity: 15,
      unit: 'km',
      date: new Date().toISOString(),
      description: 'Drove to the grocery store'
    }, (data) => {
      const isOk = data.success === true && data.data?._id !== undefined && data.data?.co2Equivalent > 0;
      if (isOk) activityId = data.data._id;
      return isOk;
    }, authToken);

    // 8. Retrieve Activities List
    await assertGet(`${API_BASE}/activities`, 'Retrieve Activities List', (data) => {
      return data.success === true && Array.isArray(data.data) && data.data.length > 0;
    }, authToken);

    // 9. Delete Activity Log
    if (activityId) {
      await assertDelete(`${API_BASE}/activities/${activityId}`, 'Delete Activity Log', (data) => {
        return data.success === true && data.data?.message === 'Deleted';
      }, authToken);
    } else {
      console.warn('⚠️ Skipping delete test: no activity logged.');
    }

    console.log('\n✅ All integration tests completed successfully! 🎉');
  } catch (err) {
    console.error('\n❌ Test Suite failed:', err.message);
    process.exit(1);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────

async function assertGet(url, name, assertion, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  process.stdout.write(`👉 Testing: ${name}... `);
  const res = await fetch(url, { headers });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${name} failed with HTTP ${res.status}: ${text}`);
  }
  
  const data = await res.json();
  if (assertion(data)) {
    console.log('PASS');
    return data;
  } else {
    throw new Error(`${name} assertion failed. Response payload: ${JSON.stringify(data)}`);
  }
}

async function assertPost(url, name, body, assertion, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  process.stdout.write(`👉 Testing: ${name}... `);
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${name} failed with HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (assertion(data)) {
    console.log('PASS');
    return data;
  } else {
    throw new Error(`${name} assertion failed. Response payload: ${JSON.stringify(data)}`);
  }
}

async function assertDelete(url, name, assertion, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  process.stdout.write(`👉 Testing: ${name}... `);
  const res = await fetch(url, {
    method: 'DELETE',
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${name} failed with HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (assertion(data)) {
    console.log('PASS');
    return data;
  } else {
    throw new Error(`${name} assertion failed. Response payload: ${JSON.stringify(data)}`);
  }
}

runTests();
