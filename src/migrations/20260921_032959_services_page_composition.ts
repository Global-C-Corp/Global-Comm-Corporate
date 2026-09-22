import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_page_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_page_method_steps_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_services_page_v_version_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_page_v_version_method_steps_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "services_locales" ADD COLUMN "positioning_line" varchar;
  ALTER TABLE "_services_v_locales" ADD COLUMN "version_positioning_line" varchar;
  ALTER TABLE "services_page" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "services_page" ADD COLUMN "primary_c_t_a_url" varchar;
  ALTER TABLE "services_page" ADD COLUMN "secondary_c_t_a_url" varchar;
  ALTER TABLE "services_page" ADD COLUMN "belief_media_id" integer;
  ALTER TABLE "services_page" ADD COLUMN "belief_cta_url" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "primary_c_t_a_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "secondary_c_t_a_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "experience_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "practices_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "practices_heading" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "practices_body" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "belief_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "belief_heading" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "belief_body" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "belief_cta_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "method_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "method_heading" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "method_intro" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "work_heading" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "closing_label" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "closing_heading" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "closing_body" varchar;
  ALTER TABLE "services_page_locales" ADD COLUMN "closing_secondary_label" varchar;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_primary_c_t_a_url" varchar;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_secondary_c_t_a_url" varchar;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_belief_media_id" integer;
  ALTER TABLE "_services_page_v" ADD COLUMN "version_belief_cta_url" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_primary_c_t_a_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_secondary_c_t_a_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_experience_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_practices_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_practices_heading" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_practices_body" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_belief_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_belief_heading" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_belief_body" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_belief_cta_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_method_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_method_heading" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_method_intro" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_work_heading" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_closing_label" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_closing_heading" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_closing_body" varchar;
  ALTER TABLE "_services_page_v_locales" ADD COLUMN "version_closing_secondary_label" varchar;
  ALTER TABLE "services_page_method_steps" ADD CONSTRAINT "services_page_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_method_steps_locales" ADD CONSTRAINT "services_page_method_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v_version_method_steps" ADD CONSTRAINT "_services_page_v_version_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v_version_method_steps_locales" ADD CONSTRAINT "_services_page_v_version_method_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_page_v_version_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_page_method_steps_order_idx" ON "services_page_method_steps" USING btree ("_order");
  CREATE INDEX "services_page_method_steps_parent_id_idx" ON "services_page_method_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_method_steps_locales_locale_parent_id_unique" ON "services_page_method_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_page_v_version_method_steps_order_idx" ON "_services_page_v_version_method_steps" USING btree ("_order");
  CREATE INDEX "_services_page_v_version_method_steps_parent_id_idx" ON "_services_page_v_version_method_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_services_page_v_version_method_steps_locales_locale_parent_" ON "_services_page_v_version_method_steps_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_belief_media_id_media_id_fk" FOREIGN KEY ("belief_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_page_v" ADD CONSTRAINT "_services_page_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_page_v" ADD CONSTRAINT "_services_page_v_version_belief_media_id_media_id_fk" FOREIGN KEY ("version_belief_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_page_hero_media_idx" ON "services_page" USING btree ("hero_media_id");
  CREATE INDEX "services_page_belief_belief_media_idx" ON "services_page" USING btree ("belief_media_id");
  CREATE INDEX "_services_page_v_version_version_hero_media_idx" ON "_services_page_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_services_page_v_version_belief_version_belief_media_idx" ON "_services_page_v" USING btree ("version_belief_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_page_method_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_page_method_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_page_v_version_method_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_page_v_version_method_steps_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_page_method_steps" CASCADE;
  DROP TABLE "services_page_method_steps_locales" CASCADE;
  DROP TABLE "_services_page_v_version_method_steps" CASCADE;
  DROP TABLE "_services_page_v_version_method_steps_locales" CASCADE;
  ALTER TABLE "services_page" DROP CONSTRAINT "services_page_hero_media_id_media_id_fk";
  
  ALTER TABLE "services_page" DROP CONSTRAINT "services_page_belief_media_id_media_id_fk";
  
  ALTER TABLE "_services_page_v" DROP CONSTRAINT "_services_page_v_version_hero_media_id_media_id_fk";
  
  ALTER TABLE "_services_page_v" DROP CONSTRAINT "_services_page_v_version_belief_media_id_media_id_fk";
  
  DROP INDEX "services_page_hero_media_idx";
  DROP INDEX "services_page_belief_belief_media_idx";
  DROP INDEX "_services_page_v_version_version_hero_media_idx";
  DROP INDEX "_services_page_v_version_belief_version_belief_media_idx";
  ALTER TABLE "services_locales" DROP COLUMN "positioning_line";
  ALTER TABLE "_services_v_locales" DROP COLUMN "version_positioning_line";
  ALTER TABLE "services_page" DROP COLUMN "hero_media_id";
  ALTER TABLE "services_page" DROP COLUMN "primary_c_t_a_url";
  ALTER TABLE "services_page" DROP COLUMN "secondary_c_t_a_url";
  ALTER TABLE "services_page" DROP COLUMN "belief_media_id";
  ALTER TABLE "services_page" DROP COLUMN "belief_cta_url";
  ALTER TABLE "services_page_locales" DROP COLUMN "primary_c_t_a_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "secondary_c_t_a_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "experience_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "practices_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "practices_heading";
  ALTER TABLE "services_page_locales" DROP COLUMN "practices_body";
  ALTER TABLE "services_page_locales" DROP COLUMN "belief_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "belief_heading";
  ALTER TABLE "services_page_locales" DROP COLUMN "belief_body";
  ALTER TABLE "services_page_locales" DROP COLUMN "belief_cta_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "method_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "method_heading";
  ALTER TABLE "services_page_locales" DROP COLUMN "method_intro";
  ALTER TABLE "services_page_locales" DROP COLUMN "work_heading";
  ALTER TABLE "services_page_locales" DROP COLUMN "closing_label";
  ALTER TABLE "services_page_locales" DROP COLUMN "closing_heading";
  ALTER TABLE "services_page_locales" DROP COLUMN "closing_body";
  ALTER TABLE "services_page_locales" DROP COLUMN "closing_secondary_label";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_hero_media_id";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_primary_c_t_a_url";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_secondary_c_t_a_url";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_belief_media_id";
  ALTER TABLE "_services_page_v" DROP COLUMN "version_belief_cta_url";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_primary_c_t_a_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_secondary_c_t_a_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_experience_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_practices_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_practices_heading";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_practices_body";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_belief_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_belief_heading";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_belief_body";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_belief_cta_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_method_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_method_heading";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_method_intro";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_work_heading";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_closing_label";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_closing_heading";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_closing_body";
  ALTER TABLE "_services_page_v_locales" DROP COLUMN "version_closing_secondary_label";`)
}
