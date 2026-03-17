const path = require('path');
const net = require('net');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const databaseUrl = process.env.DATABASE_URL || '';

const parseHostPort = (urlString) => {
  const url = new URL(urlString);
  return {
    host: url.hostname,
    port: Number(url.port || 5432),
  };
};

const testTcp = ({ host, port }) =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    const finish = (ok, reason) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ ok, reason });
    };

    socket.setTimeout(5000);
    socket.once('connect', () => finish(true, 'connected'));
    socket.once('timeout', () => finish(false, 'timeout'));
    socket.once('error', (error) => finish(false, error.code || error.message));
    socket.connect(port, host);
  });

const run = async () => {
  if (!databaseUrl) {
    console.error('DATABASE_URL is missing in backend/.env');
    process.exit(1);
  }

  let target;
  try {
    target = parseHostPort(databaseUrl);
  } catch (error) {
    console.error(`Invalid DATABASE_URL format: ${error.message}`);
    process.exit(1);
  }

  const tcp = await testTcp(target);

  if (!tcp.ok) {
    console.error(`TCP FAIL ${target.host}:${target.port} -> ${tcp.reason}`);
    process.exit(2);
  }

  console.log(`OK ${target.host}:${target.port}`);
};

run();
