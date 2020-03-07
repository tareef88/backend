const host = process.env.POSTGRES_HOST || 'localhost';
const port = process.env.POSTGRES_PORT || 5433;
const database = process.env.POSTGRES_DB || 'docly';
const user = process.env.POSTGRES_USER || 'docly';
const password = process.env.POSTGRES_PASS || '1234';

console.log('process.env_____', host, process.env.POSTGRES_HOST);
console.log('POSTGRES_PORT', port, process.env.POSTGRES_PORT);
console.log('POSTGRES_DB', database, process.env.POSTGRES_DB);
console.log('POSTGRES_USER', user, process.env.POSTGRES_USER);
console.log('POSTGRES_PASS', password, process.env.POSTGRES_PASS);

module.exports = {
  client: 'pg',
  connection: {
    host,
    database,
    port,
    user,
    password,
  },
};
