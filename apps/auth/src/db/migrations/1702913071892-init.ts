import { MigrationInterface, QueryRunner } from "typeorm";

export class init1702913071892 implements MigrationInterface {
    name = 'init1702913071892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "email" character varying NOT NULL, "hwid" character varying NOT NULL, "cheatName" character varying NOT NULL, "purchaseDate" TIMESTAMP NOT NULL, "activationDate" TIMESTAMP NOT NULL, "lastActive" TIMESTAMP NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_b8610560fefb596f6d843dc7e79" UNIQUE ("hwid"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "originalName" character varying NOT NULL, "version" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, "uploadDate" TIMESTAMP NOT NULL, CONSTRAINT "UQ_51e2d4c72df88f28a560615379f" UNIQUE ("filename"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
