// Update with your config settings.
module.exports = {
  development: {
    client: 'pg',
    version: '13',
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
    connection: {
      host: 'cockroachdb',
      port: 26257,
      user: 'donation_mgmt_migrator',
      password: null,
      database: 'donationsdb',
    },
    searchPath: ['donations'],
  },
};
