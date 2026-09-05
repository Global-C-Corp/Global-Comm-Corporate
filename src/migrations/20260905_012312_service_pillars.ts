import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ADD COLUMN "is_pillar" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "folded_into_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN "version_is_pillar" boolean DEFAULT false;
  ALTER TABLE "_services_v" ADD COLUMN "version_folded_into_id" integer;
  ALTER TABLE "services" ADD CONSTRAINT "services_folded_into_id_services_id_fk" FOREIGN KEY ("folded_into_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_folded_into_id_services_id_fk" FOREIGN KEY ("version_folded_into_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_folded_into_idx" ON "services" USING btree ("folded_into_id");
  CREATE INDEX "_services_v_version_version_folded_into_idx" ON "_services_v" USING btree ("version_folded_into_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP CONSTRAINT "services_folded_into_id_services_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT "_services_v_version_folded_into_id_services_id_fk";
  
  DROP INDEX "services_folded_into_idx";
  DROP INDEX "_services_v_version_version_folded_into_idx";
  ALTER TABLE "services" DROP COLUMN "is_pillar";
  ALTER TABLE "services" DROP COLUMN "folded_into_id";
  ALTER TABLE "_services_v" DROP COLUMN "version_is_pillar";
  ALTER TABLE "_services_v" DROP COLUMN "version_folded_into_id";`)
}
