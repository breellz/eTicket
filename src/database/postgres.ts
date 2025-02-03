import { DataSource } from "typeorm";
import * as path from "path";

class Postgres {
  private static datasource: DataSource;

  public static get databaseUrl() {
    switch (process.env.NODE_ENV) {
      case "test":
        return process.env.TEST_DATABASE_URL || "";
      case "development":
        return process.env.DEV_DATABASE_URL || "";
      default:
        return process.env.DEV_DATABASE_URL || "";
    }
  }

  public static async connect() {
    if (Postgres.databaseUrl) {
      const dataSource = new DataSource({
        type: "postgres",
        url: Postgres.databaseUrl,
        ssl: { rejectUnauthorized: false },
        entities: [path.join(__dirname, '/entities/**/*.entity{.ts,.js}')],
        synchronize: false,
        migrations: [
          process.env.NODE_ENV === 'production'
            ? path.join(__dirname, '/migrations/*.js')
            : path.join(__dirname, '/migrations/*.ts'),
        ],
        migrationsRun: true,
      });

      await dataSource.initialize();

      Postgres.datasource = dataSource;
      console.log("Connected to database");
    }
  }

  public static async disconnect() {
    if (Postgres.datasource) {
      await Postgres.datasource.destroy();
    }
  }
}

export default Postgres;