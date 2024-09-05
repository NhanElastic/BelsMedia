import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1723568642141 implements MigrationInterface {
    name = 'UpdateUserEntity1723568642141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`status\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`profileImage\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`profileImage\``);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`status\``);
    }

}
