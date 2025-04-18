import pgPromise from 'pg-promise';

const pgp = pgPromise();

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'tasksdb',
  user: 'postgres',
  password: 'postgrespassword',
};

const db = pgp(connection);

export default db;
