// Update with your config settings.
module.exports = {
  development: {
    client: 'pg',
    version: '13',
    migrations: {
      disableTransactions: true,
    },
    connection: {
      host: 'localhost',
      port: 26257,
      user: 'donation_mgmt_migrator',
      password: null,
      database: 'donationsdb',
    },
    searchPath: ['donations'],
  },
  compose: {
    client: 'pg',
    version: '13',
    migrations: {
      disableTransactions: true,
    },
    connection: {
      host: 'roach1',
      port: 26257,
      user: 'donation_mgmt_migrator',
      password: null,
      database: 'donationsdb',
    },
    searchPath: ['donations'],
  },
};
