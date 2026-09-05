import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_hero_overlay_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_page_positioning_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_expertise_items_offerings" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_page_expertise_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"service_id" integer
  );
  
  CREATE TABLE "home_page_expertise_items_locales" (
  	"title" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_approach_steps_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "home_page_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar
  );
  
  CREATE TABLE "home_page_approach_steps_locales" (
  	"title" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"result_label" varchar,
  	"result" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_home_page_v_version_hero_overlay_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_positioning_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_expertise_items_offerings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_expertise_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"service_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_expertise_items_locales" (
  	"title" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_approach_steps_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_approach_steps_locales" (
  	"title" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"result_label" varchar,
  	"result" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "home_page" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "expertise_section_c_t_a_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "work_section_section_c_t_a_url" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_overlay_label" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "positioning_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "positioning_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "positioning_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "expertise_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "expertise_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "expertise_intro" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "expertise_section_c_t_a_label" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "work_section_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "work_section_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "work_section_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "work_section_item_c_t_a_label" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "work_section_section_c_t_a_label" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "approach_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "approach_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "approach_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "proof_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "proof_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "proof_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "faq_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "faq_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "closing_kicker" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "closing_heading" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "closing_body" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "closing_reassurance" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_expertise_section_c_t_a_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_work_section_section_c_t_a_url" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_hero_overlay_label" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_positioning_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_positioning_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_positioning_body" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_expertise_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_expertise_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_expertise_intro" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_expertise_section_c_t_a_label" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_work_section_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_work_section_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_work_section_body" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_work_section_item_c_t_a_label" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_work_section_section_c_t_a_label" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_approach_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_approach_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_approach_body" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_proof_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_proof_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_proof_body" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_faq_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_faq_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_closing_kicker" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_closing_heading" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_closing_body" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_closing_reassurance" varchar;
  ALTER TABLE "home_page_hero_overlay_items" ADD CONSTRAINT "home_page_hero_overlay_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_positioning_pillars" ADD CONSTRAINT "home_page_positioning_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_expertise_items_offerings" ADD CONSTRAINT "home_page_expertise_items_offerings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_expertise_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_expertise_items" ADD CONSTRAINT "home_page_expertise_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_expertise_items" ADD CONSTRAINT "home_page_expertise_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_expertise_items_locales" ADD CONSTRAINT "home_page_expertise_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_expertise_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_approach_steps_bullets" ADD CONSTRAINT "home_page_approach_steps_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_approach_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_approach_steps" ADD CONSTRAINT "home_page_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_approach_steps_locales" ADD CONSTRAINT "home_page_approach_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_approach_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_faq_items" ADD CONSTRAINT "home_page_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_overlay_items" ADD CONSTRAINT "_home_page_v_version_hero_overlay_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_positioning_pillars" ADD CONSTRAINT "_home_page_v_version_positioning_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_expertise_items_offerings" ADD CONSTRAINT "_home_page_v_version_expertise_items_offerings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_expertise_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_expertise_items" ADD CONSTRAINT "_home_page_v_version_expertise_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_expertise_items" ADD CONSTRAINT "_home_page_v_version_expertise_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_expertise_items_locales" ADD CONSTRAINT "_home_page_v_version_expertise_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_expertise_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_approach_steps_bullets" ADD CONSTRAINT "_home_page_v_version_approach_steps_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_approach_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_approach_steps" ADD CONSTRAINT "_home_page_v_version_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_approach_steps_locales" ADD CONSTRAINT "_home_page_v_version_approach_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_approach_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_faq_items" ADD CONSTRAINT "_home_page_v_version_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_hero_overlay_items_order_idx" ON "home_page_hero_overlay_items" USING btree ("_order");
  CREATE INDEX "home_page_hero_overlay_items_parent_id_idx" ON "home_page_hero_overlay_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_overlay_items_locale_idx" ON "home_page_hero_overlay_items" USING btree ("_locale");
  CREATE INDEX "home_page_positioning_pillars_order_idx" ON "home_page_positioning_pillars" USING btree ("_order");
  CREATE INDEX "home_page_positioning_pillars_parent_id_idx" ON "home_page_positioning_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_positioning_pillars_locale_idx" ON "home_page_positioning_pillars" USING btree ("_locale");
  CREATE INDEX "home_page_expertise_items_offerings_order_idx" ON "home_page_expertise_items_offerings" USING btree ("_order");
  CREATE INDEX "home_page_expertise_items_offerings_parent_id_idx" ON "home_page_expertise_items_offerings" USING btree ("_parent_id");
  CREATE INDEX "home_page_expertise_items_offerings_locale_idx" ON "home_page_expertise_items_offerings" USING btree ("_locale");
  CREATE INDEX "home_page_expertise_items_order_idx" ON "home_page_expertise_items" USING btree ("_order");
  CREATE INDEX "home_page_expertise_items_parent_id_idx" ON "home_page_expertise_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_expertise_items_service_idx" ON "home_page_expertise_items" USING btree ("service_id");
  CREATE UNIQUE INDEX "home_page_expertise_items_locales_locale_parent_id_unique" ON "home_page_expertise_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_approach_steps_bullets_order_idx" ON "home_page_approach_steps_bullets" USING btree ("_order");
  CREATE INDEX "home_page_approach_steps_bullets_parent_id_idx" ON "home_page_approach_steps_bullets" USING btree ("_parent_id");
  CREATE INDEX "home_page_approach_steps_bullets_locale_idx" ON "home_page_approach_steps_bullets" USING btree ("_locale");
  CREATE INDEX "home_page_approach_steps_order_idx" ON "home_page_approach_steps" USING btree ("_order");
  CREATE INDEX "home_page_approach_steps_parent_id_idx" ON "home_page_approach_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_approach_steps_locales_locale_parent_id_unique" ON "home_page_approach_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_faq_items_order_idx" ON "home_page_faq_items" USING btree ("_order");
  CREATE INDEX "home_page_faq_items_parent_id_idx" ON "home_page_faq_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_faq_items_locale_idx" ON "home_page_faq_items" USING btree ("_locale");
  CREATE INDEX "_home_page_v_version_hero_overlay_items_order_idx" ON "_home_page_v_version_hero_overlay_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_overlay_items_parent_id_idx" ON "_home_page_v_version_hero_overlay_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_hero_overlay_items_locale_idx" ON "_home_page_v_version_hero_overlay_items" USING btree ("_locale");
  CREATE INDEX "_home_page_v_version_positioning_pillars_order_idx" ON "_home_page_v_version_positioning_pillars" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_positioning_pillars_parent_id_idx" ON "_home_page_v_version_positioning_pillars" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_positioning_pillars_locale_idx" ON "_home_page_v_version_positioning_pillars" USING btree ("_locale");
  CREATE INDEX "_home_page_v_version_expertise_items_offerings_order_idx" ON "_home_page_v_version_expertise_items_offerings" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_expertise_items_offerings_parent_id_idx" ON "_home_page_v_version_expertise_items_offerings" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_expertise_items_offerings_locale_idx" ON "_home_page_v_version_expertise_items_offerings" USING btree ("_locale");
  CREATE INDEX "_home_page_v_version_expertise_items_order_idx" ON "_home_page_v_version_expertise_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_expertise_items_parent_id_idx" ON "_home_page_v_version_expertise_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_expertise_items_service_idx" ON "_home_page_v_version_expertise_items" USING btree ("service_id");
  CREATE UNIQUE INDEX "_home_page_v_version_expertise_items_locales_locale_parent_i" ON "_home_page_v_version_expertise_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_approach_steps_bullets_order_idx" ON "_home_page_v_version_approach_steps_bullets" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_approach_steps_bullets_parent_id_idx" ON "_home_page_v_version_approach_steps_bullets" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_approach_steps_bullets_locale_idx" ON "_home_page_v_version_approach_steps_bullets" USING btree ("_locale");
  CREATE INDEX "_home_page_v_version_approach_steps_order_idx" ON "_home_page_v_version_approach_steps" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_approach_steps_parent_id_idx" ON "_home_page_v_version_approach_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_approach_steps_locales_locale_parent_id" ON "_home_page_v_version_approach_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_faq_items_order_idx" ON "_home_page_v_version_faq_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_faq_items_parent_id_idx" ON "_home_page_v_version_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_faq_items_locale_idx" ON "_home_page_v_version_faq_items" USING btree ("_locale");
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_hero_media_idx" ON "home_page" USING btree ("hero_media_id");
  CREATE INDEX "_home_page_v_version_version_hero_media_idx" ON "_home_page_v" USING btree ("version_hero_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_hero_overlay_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_positioning_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_expertise_items_offerings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_expertise_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_expertise_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_approach_steps_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_approach_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_approach_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_hero_overlay_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_positioning_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_expertise_items_offerings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_expertise_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_expertise_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_approach_steps_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_approach_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_approach_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_faq_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_hero_overlay_items" CASCADE;
  DROP TABLE "home_page_positioning_pillars" CASCADE;
  DROP TABLE "home_page_expertise_items_offerings" CASCADE;
  DROP TABLE "home_page_expertise_items" CASCADE;
  DROP TABLE "home_page_expertise_items_locales" CASCADE;
  DROP TABLE "home_page_approach_steps_bullets" CASCADE;
  DROP TABLE "home_page_approach_steps" CASCADE;
  DROP TABLE "home_page_approach_steps_locales" CASCADE;
  DROP TABLE "home_page_faq_items" CASCADE;
  DROP TABLE "_home_page_v_version_hero_overlay_items" CASCADE;
  DROP TABLE "_home_page_v_version_positioning_pillars" CASCADE;
  DROP TABLE "_home_page_v_version_expertise_items_offerings" CASCADE;
  DROP TABLE "_home_page_v_version_expertise_items" CASCADE;
  DROP TABLE "_home_page_v_version_expertise_items_locales" CASCADE;
  DROP TABLE "_home_page_v_version_approach_steps_bullets" CASCADE;
  DROP TABLE "_home_page_v_version_approach_steps" CASCADE;
  DROP TABLE "_home_page_v_version_approach_steps_locales" CASCADE;
  DROP TABLE "_home_page_v_version_faq_items" CASCADE;
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_media_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_hero_media_id_media_id_fk";
  
  DROP INDEX "home_page_hero_media_idx";
  DROP INDEX "_home_page_v_version_version_hero_media_idx";
  ALTER TABLE "home_page" DROP COLUMN "hero_media_id";
  ALTER TABLE "home_page" DROP COLUMN "expertise_section_c_t_a_url";
  ALTER TABLE "home_page" DROP COLUMN "work_section_section_c_t_a_url";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_overlay_label";
  ALTER TABLE "home_page_locales" DROP COLUMN "positioning_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "positioning_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "positioning_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "expertise_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "expertise_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "expertise_intro";
  ALTER TABLE "home_page_locales" DROP COLUMN "expertise_section_c_t_a_label";
  ALTER TABLE "home_page_locales" DROP COLUMN "work_section_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "work_section_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "work_section_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "work_section_item_c_t_a_label";
  ALTER TABLE "home_page_locales" DROP COLUMN "work_section_section_c_t_a_label";
  ALTER TABLE "home_page_locales" DROP COLUMN "approach_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "approach_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "approach_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "proof_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "proof_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "proof_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "faq_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "faq_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "closing_kicker";
  ALTER TABLE "home_page_locales" DROP COLUMN "closing_heading";
  ALTER TABLE "home_page_locales" DROP COLUMN "closing_body";
  ALTER TABLE "home_page_locales" DROP COLUMN "closing_reassurance";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_media_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_expertise_section_c_t_a_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_work_section_section_c_t_a_url";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_hero_overlay_label";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_positioning_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_positioning_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_positioning_body";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_expertise_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_expertise_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_expertise_intro";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_expertise_section_c_t_a_label";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_work_section_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_work_section_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_work_section_body";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_work_section_item_c_t_a_label";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_work_section_section_c_t_a_label";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_approach_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_approach_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_approach_body";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_proof_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_proof_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_proof_body";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_faq_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_faq_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_closing_kicker";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_closing_heading";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_closing_body";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_closing_reassurance";`)
}
