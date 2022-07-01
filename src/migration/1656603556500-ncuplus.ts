import { MigrationInterface, QueryBuilder, QueryRunner } from 'typeorm';

export class ncuplus1656671641251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createDatabase('ncuplus', true);
    await queryRunner.query('ALTER DATABASE ncuplus CHARACTER SET utf8mb4');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('ncuplus');
  }
}
