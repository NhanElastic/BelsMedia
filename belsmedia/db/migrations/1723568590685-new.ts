import { MigrationInterface, QueryRunner } from "typeorm";

export class New1723568590685 implements MigrationInterface {
    name = 'New1723568590685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id\` uuid NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ffc81a3b97dcbf8e320d5106c0\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`auth\` (\`id\` uuid NOT NULL, \`username\` varchar(255) NOT NULL, \`refreshtoken\` varchar(600) NOT NULL DEFAULT 'None', UNIQUE INDEX \`IDX_366ebf23d8f3781bb7bb37abbd\` (\`username\`), UNIQUE INDEX \`IDX_990c3fb67b65c29c681f31e6f0\` (\`refreshtoken\`), UNIQUE INDEX \`REL_366ebf23d8f3781bb7bb37abbd\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`auth\` ADD CONSTRAINT \`FK_366ebf23d8f3781bb7bb37abbd1\` FOREIGN KEY (\`username\`) REFERENCES \`Users\`(\`username\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auth\` DROP FOREIGN KEY \`FK_366ebf23d8f3781bb7bb37abbd1\``);
        await queryRunner.query(`DROP INDEX \`REL_366ebf23d8f3781bb7bb37abbd\` ON \`auth\``);
        await queryRunner.query(`DROP INDEX \`IDX_990c3fb67b65c29c681f31e6f0\` ON \`auth\``);
        await queryRunner.query(`DROP INDEX \`IDX_366ebf23d8f3781bb7bb37abbd\` ON \`auth\``);
        await queryRunner.query(`DROP TABLE \`auth\``);
        await queryRunner.query(`DROP INDEX \`IDX_ffc81a3b97dcbf8e320d5106c0\` ON \`Users\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
    }

}
