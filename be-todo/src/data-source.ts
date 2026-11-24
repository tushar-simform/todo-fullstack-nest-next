import { DataSource } from 'typeorm';

/** Used by the TypeORM CLI only (migration:generate / run / revert). The app itself is configured in AppModule. */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  uuidExtension: 'pgcrypto',
  entities: [import.meta.dirname + '/**/*.entity.{js,ts}'],
  migrations: [import.meta.dirname + '/migrations/*.{js,ts}'],
});
