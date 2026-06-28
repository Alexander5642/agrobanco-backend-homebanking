const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 'usr-alexander', email: '74975772@continental.edu.pe', rol: 'CLIENTE' }, 'supersecreto123', { expiresIn: '1d' });

async function testFetch() {
  const apiUrl = 'https://agrobanco-backend-homebanking.onrender.com/api'; // Or just local if the backend is the same

  try {
    const res = await fetch(`${apiUrl}/creditos/mis-creditos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e);
  }
}

testFetch();
