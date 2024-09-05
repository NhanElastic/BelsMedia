import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { UserEntity } from "src/user/user.entity";
import { AuthEntity } from "src/auth/auth.entity";
dotenv.config();


export const dataSourcesOptions: DataSourceOptions = {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
}

const dataSource = new DataSource(dataSourcesOptions)
export default dataSource;