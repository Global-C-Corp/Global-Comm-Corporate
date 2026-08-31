import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "services" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_services_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "industries" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "industries" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_industries_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_industries_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "clients" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "clients" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_clients_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_clients_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "projects" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "projects" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_projects_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "testimonials" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "home_page" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "services_page" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "services_page" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "work_page" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "work_page" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_work_page_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_work_page_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "company_page" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "company_page" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_company_page_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_company_page_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "contact_page" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "contact_page" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "services" ADD CONSTRAINT "services_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_page_v" ADD CONSTRAINT "_services_page_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_page" ADD CONSTRAINT "work_page_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_page_v" ADD CONSTRAINT "_work_page_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_page" ADD CONSTRAINT "company_page_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_company_page_v" ADD CONSTRAINT "_company_page_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_approved_by_idx" ON "services" USING btree ("approved_by_id");
  CREATE INDEX "_services_v_version_version_approved_by_idx" ON "_services_v" USING btree ("version_approved_by_id");
  CREATE INDEX "industries_approved_by_idx" ON "industries" USING btree ("approved_by_id");
  CREATE INDEX "_industries_v_version_version_approved_by_idx" ON "_industries_v" USING btree ("version_approved_by_id");
  CREATE INDEX "clients_approved_by_idx" ON "clients" USING btree ("approved_by_id");
  CREATE INDEX "_clients_v_version_version_approved_by_idx" ON "_clients_v" USING btree ("version_approved_by_id");
  CREATE INDEX "projects_approved_by_idx" ON "projects" USING btree ("approved_by_id");
  CREATE INDEX "_projects_v_version_version_approved_by_idx" ON "_projects_v" USING btree ("version_approved_by_id");
  CREATE INDEX "testimonials_approved_by_idx" ON "testimonials" USING btree ("approved_by_id");
  CREATE INDEX "_testimonials_v_version_version_approved_by_idx" ON "_testimonials_v" USING btree ("version_approved_by_id");
  CREATE INDEX "home_page_approved_by_idx" ON "home_page" USING btree ("approved_by_id");
  CREATE INDEX "_home_page_v_version_version_approved_by_idx" ON "_home_page_v" USING btree ("version_approved_by_id");
  CREATE INDEX "services_page_approved_by_idx" ON "services_page" USING btree ("approved_by_id");
  CREATE INDEX "_services_page_v_version_version_approved_by_idx" ON "_services_page_v" USING btree ("version_approved_by_id");
  CREATE INDEX "work_page_approved_by_idx" ON "work_page" USING btree ("approved_by_id");
  CREATE INDEX "_work_page_v_version_version_approved_by_idx" ON "_work_page_v" USING btree ("version_approved_by_id");
  CREATE INDEX "company_page_approved_by_idx" ON "company_page" USING btree ("approved_by_id");
  CREATE INDEX "_company_page_v_version_version_approved_by_idx" ON "_company_page_v" USING btree ("version_approved_by_id");
  CREATE INDEX "contact_page_approved_by_idx" ON "contact_page" USING btree ("approved_by_id");
  CREATE INDEX "_contact_page_v_version_version_approved_by_idx" ON "_contact_page_v" USING btree ("version_approved_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP CONSTRAINT "services_approved_by_id_users_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT "_services_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "industries" DROP CONSTRAINT "industries_approved_by_id_users_id_fk";
  
  ALTER TABLE "_industries_v" DROP CONSTRAINT "_industries_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "clients" DROP CONSTRAINT "clients_approved_by_id_users_id_fk";
  
  ALTER TABLE "_clients_v" DROP CONSTRAINT "_clients_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_approved_by_id_users_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_approved_by_id_users_id_fk";
  
  ALTER TABLE "_testimonials_v" DROP CONSTRAINT "_testimonials_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_approved_by_id_users_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "services_page" DROP CONSTRAINT "services_page_approved_by_id_users_id_fk";
  
  ALTER TABLE "_services_page_v" DROP CONSTRAINT "_services_page_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "work_page" DROP CONSTRAINT "work_page_approved_by_id_users_id_fk";
  
  ALTER TABLE "_work_page_v" DROP CONSTRAINT "_work_page_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "company_page" DROP CONSTRAINT "company_page_approved_by_id_users_id_fk";
  
  ALTER TABLE "_company_page_v" DROP CONSTRAINT "_company_page_v_version_approved_by_id_users_id_fk";
  
  ALTER TABLE "contact_page" DROP CONSTRAINT "contact_page_approved_by_id_users_id_fk";
  
  ALTER TABLE "_contact_page_v" DROP CONSTRAINT "_contact_page_v_version_approved_by_id_users_id_fk";
  
  DROP INDEX "services_approved_by_idx";
  DROP INDEX "_services_v_version_version_approved_by_idx";
  DROP INDEX "industries_approved_by_idx";
  DROP INDEX "_industries_v_version_version_approved_by_idx";
  DROP INDEX "clients_approved_by_idx";
  DROP INDEX "_clients_v_version_version_approved_by_idx";
  DROP INDEX "projects_approved_by_idx";
  DROP INDEX "_projects_v_version_version_approved_by_idx";
  DROP INDEX "testimonials_approved_by_idx";
  DROP INDEX "_testimonials_v_version_version_approved_by_idx";
  DROP INDEX "home_page_approved_by_idx";
  DROP INDEX "_home_page_v_version_version_approved_by_idx";
  DROP INDEX "services_page_approved_by_idx";
  DROP INDEX "_services_page_v_version_version_approved_by_idx";
  DROP INDEX "work_page_approved_by_idx";
  DROP INDEX "_work_page_v_version_version_approved_by_idx";
  DROP INDEX "company_page_approved_by_idx";
  DROP INDEX "_company_page_v_version_version_approved_by_idx";
  DROP INDEX "contact_page_approved_by_idx";
  DROP INDEX "_contact_page_v_version_version_approved_by_idx";
  ALTER TABLE "services" DROP COLUMN "approved_by_id";
  ALTER TABLE "services" DROP COLUMN "approved_at";
  ALTER TABLE "_services_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_services_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "industries" DROP COLUMN "approved_by_id";
  ALTER TABLE "industries" DROP COLUMN "approved_at";
  ALTER TABLE "_industries_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_industries_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "clients" DROP COLUMN "approved_by_id";
  ALTER TABLE "clients" DROP COLUMN "approved_at";
  ALTER TABLE "_clients_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_clients_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "projects" DROP COLUMN "approved_by_id";
  ALTER TABLE "projects" DROP COLUMN "approved_at";
  ALTER TABLE "_projects_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "testimonials" DROP COLUMN "approved_by_id";
  ALTER TABLE "testimonials" DROP COLUMN "approved_at";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "home_page" DROP COLUMN "approved_by_id";
  ALTER TABLE "home_page" DROP COLUMN "approved_at";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "services_page" DROP COLUMN "approved_by_id";
  ALTER TABLE "services_page" DROP COLUMN "approved_at";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "work_page" DROP COLUMN "approved_by_id";
  ALTER TABLE "work_page" DROP COLUMN "approved_at";
  ALTER TABLE "_work_page_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_work_page_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "company_page" DROP COLUMN "approved_by_id";
  ALTER TABLE "company_page" DROP COLUMN "approved_at";
  ALTER TABLE "_company_page_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_company_page_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "contact_page" DROP COLUMN "approved_by_id";
  ALTER TABLE "contact_page" DROP COLUMN "approved_at";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_approved_at";`)
}
