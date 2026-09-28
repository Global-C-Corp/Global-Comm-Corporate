import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_page_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "_services_page_v_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "services_page_rels" ADD CONSTRAINT "services_page_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v_rels" ADD CONSTRAINT "_services_page_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_page_rels_clients_id_idx" ON "services_page_rels" USING btree ("clients_id");
  CREATE INDEX "_services_page_v_rels_clients_id_idx" ON "_services_page_v_rels" USING btree ("clients_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_page_rels" DROP CONSTRAINT "services_page_rels_clients_fk";
  
  ALTER TABLE "_services_page_v_rels" DROP CONSTRAINT "_services_page_v_rels_clients_fk";
  
  DROP INDEX "services_page_rels_clients_id_idx";
  DROP INDEX "_services_page_v_rels_clients_id_idx";
  ALTER TABLE "services_page_rels" DROP COLUMN "clients_id";
  ALTER TABLE "_services_page_v_rels" DROP COLUMN "clients_id";`)
}
