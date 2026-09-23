import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "is_test_fixture" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_is_test_fixture" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "is_test_fixture";
  ALTER TABLE "_projects_v" DROP COLUMN "version_is_test_fixture";`)
}
