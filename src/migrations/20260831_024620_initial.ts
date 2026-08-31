import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'publisher', 'editor', 'ai_editor');
  CREATE TYPE "public"."enum_media_usage_rights" AS ENUM('full_ownership', 'licensed', 'client_provided', 'stock', 'unknown');
  CREATE TYPE "public"."enum_services_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum_services_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_services_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_services_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_services_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_services_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__services_v_version_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum__services_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__services_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__services_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__services_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_industries_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_industries_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum_industries_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_industries_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_industries_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_industries_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_industries_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_industries_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_industries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__industries_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__industries_v_version_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum__industries_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__industries_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__industries_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__industries_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__industries_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__industries_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__industries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__industries_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_clients_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_clients_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum_clients_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_clients_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_clients_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_clients_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_clients_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_clients_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__clients_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__clients_v_version_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum__clients_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__clients_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__clients_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__clients_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__clients_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__clients_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__clients_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__clients_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_projects_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_projects_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum_projects_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_projects_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_projects_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_projects_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_projects_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_projects_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__projects_v_version_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum__projects_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__projects_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__projects_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__projects_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__projects_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__projects_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_testimonials_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum_testimonials_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_testimonials_original_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_testimonials_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_testimonials_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_testimonials_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_testimonials_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_testimonials_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_testimonials_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_source_references_type" AS ENUM('user_provided', 'uploaded_document', 'existing_cms', 'public_url', 'human_verified');
  CREATE TYPE "public"."enum__testimonials_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__testimonials_v_version_original_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__testimonials_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__testimonials_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__testimonials_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__testimonials_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__testimonials_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__testimonials_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_ai_audit_logs_result" AS ENUM('success', 'rejected', 'error');
  CREATE TYPE "public"."enum_ai_audit_logs_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('linkedin', 'instagram', 'facebook', 'x', 'youtube');
  CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_home_page_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_home_page_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_home_page_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_home_page_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_home_page_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_home_page_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_home_page_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__home_page_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__home_page_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__home_page_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__home_page_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__home_page_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__home_page_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_page_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_page_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_services_page_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_services_page_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_services_page_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_services_page_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_page_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_services_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_page_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__services_page_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__services_page_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__services_page_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__services_page_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__services_page_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__services_page_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__services_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_page_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_work_page_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_work_page_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_work_page_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_work_page_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_work_page_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_work_page_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_work_page_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_work_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_page_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__work_page_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__work_page_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__work_page_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__work_page_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__work_page_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__work_page_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__work_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_page_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_company_page_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_company_page_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_company_page_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_company_page_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_company_page_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_company_page_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_company_page_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_company_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__company_page_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__company_page_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__company_page_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__company_page_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__company_page_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__company_page_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__company_page_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__company_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__company_page_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_contact_page_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_contact_page_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum_contact_page_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_contact_page_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_contact_page_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum_contact_page_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_contact_page_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_dirty_locales" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__contact_page_v_version_review_status" AS ENUM('ai_draft', 'editorial_draft', 'needs_review', 'revision_requested', 'approved');
  CREATE TYPE "public"."enum__contact_page_v_version_translation_status_fr" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__contact_page_v_version_translation_status_en" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__contact_page_v_version_translation_status_es" AS ENUM('missing', 'ai_draft', 'needs_review', 'approved');
  CREATE TYPE "public"."enum__contact_page_v_version_ai_meta_source_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__contact_page_v_version_ai_meta_target_locale" AS ENUM('fr', 'en', 'es');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_published_locale" AS ENUM('fr', 'en', 'es');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"copyright_owner" varchar,
  	"usage_rights" "enum_media_usage_rights" DEFAULT 'unknown',
  	"usage_expiration" timestamp(3) with time zone,
  	"client_approved" boolean DEFAULT false,
  	"source" varchar,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_logo_url" varchar,
  	"sizes_logo_width" numeric,
  	"sizes_logo_height" numeric,
  	"sizes_logo_mime_type" varchar,
  	"sizes_logo_filesize" numeric,
  	"sizes_logo_filename" varchar,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_project_card_url" varchar,
  	"sizes_project_card_width" numeric,
  	"sizes_project_card_height" numeric,
  	"sizes_project_card_mime_type" varchar,
  	"sizes_project_card_filesize" numeric,
  	"sizes_project_card_filename" varchar,
  	"sizes_project_feature_url" varchar,
  	"sizes_project_feature_width" numeric,
  	"sizes_project_feature_height" numeric,
  	"sizes_project_feature_mime_type" varchar,
  	"sizes_project_feature_filesize" numeric,
  	"sizes_project_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_open_graph_url" varchar,
  	"sizes_open_graph_width" numeric,
  	"sizes_open_graph_height" numeric,
  	"sizes_open_graph_mime_type" varchar,
  	"sizes_open_graph_filesize" numeric,
  	"sizes_open_graph_filename" varchar,
  	"sizes_portrait_url" varchar,
  	"sizes_portrait_width" numeric,
  	"sizes_portrait_height" numeric,
  	"sizes_portrait_mime_type" varchar,
  	"sizes_portrait_filesize" numeric,
  	"sizes_portrait_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "services_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_services_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"internal_definition" varchar,
  	"hero_media_id" integer,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"review_status" "enum_services_review_status",
  	"translation_status_fr" "enum_services_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_services_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_services_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_services_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_services_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"long_description" jsonb,
  	"client_problem" jsonb,
  	"approach" jsonb,
  	"deliverables" jsonb,
  	"outcomes" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__services_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_services_v_version_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__services_v_version_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_parent_id" integer,
  	"version_internal_definition" varchar,
  	"version_hero_media_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_review_status" "enum__services_v_version_review_status",
  	"version_translation_status_fr" "enum__services_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__services_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__services_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__services_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__services_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_long_description" jsonb,
  	"version_client_problem" jsonb,
  	"version_approach" jsonb,
  	"version_deliverables" jsonb,
  	"version_outcomes" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "industries_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "industries_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_industries_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "industries_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "industries_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_industries_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "industries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_definition" varchar,
  	"hero_media_id" integer,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"review_status" "enum_industries_review_status",
  	"translation_status_fr" "enum_industries_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_industries_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_industries_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_industries_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_industries_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_industries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "industries_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"long_description" jsonb,
  	"challenges" jsonb,
  	"capabilities" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "industries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_industries_v_version_aliases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__industries_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_industries_v_version_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__industries_v_version_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_definition" varchar,
  	"version_hero_media_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_review_status" "enum__industries_v_version_review_status",
  	"version_translation_status_fr" "enum__industries_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__industries_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__industries_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__industries_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__industries_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__industries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__industries_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_industries_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_long_description" jsonb,
  	"version_challenges" jsonb,
  	"version_capabilities" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_industries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "project_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_definition" varchar,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "project_types_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "context_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_definition" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "context_tags_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clients_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "clients_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "clients_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_clients_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"website_u_r_l" varchar,
  	"location" varchar,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"review_status" "enum_clients_review_status",
  	"translation_status_fr" "enum_clients_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_clients_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_clients_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_clients_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_clients_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_clients_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "clients_locales" (
  	"short_description" varchar,
  	"long_description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clients_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"industries_id" integer
  );
  
  CREATE TABLE "_clients_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__clients_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_clients_v_version_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_clients_v_version_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__clients_v_version_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_clients_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_website_u_r_l" varchar,
  	"version_location" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_review_status" "enum__clients_v_version_review_status",
  	"version_translation_status_fr" "enum__clients_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__clients_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__clients_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__clients_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__clients_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__clients_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__clients_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_clients_v_locales" (
  	"version_short_description" varchar,
  	"version_long_description" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_clients_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"industries_id" integer
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "projects_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"source_note" varchar
  );
  
  CREATE TABLE "projects_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "projects_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_projects_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer,
  	"year" numeric,
  	"location" varchar,
  	"external_u_r_l" varchar,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"hero_media_id" integer,
  	"featured_media_id" integer,
  	"review_status" "enum_projects_review_status",
  	"translation_status_fr" "enum_projects_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_projects_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_projects_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_projects_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_projects_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"short_statement" varchar,
  	"excerpt" varchar,
  	"challenge" jsonb,
  	"approach" jsonb,
  	"deliverables" jsonb,
  	"outcome" jsonb,
  	"results_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"industries_id" integer,
  	"project_types_id" integer,
  	"context_tags_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"source_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_metrics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__projects_v_version_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_client_id" integer,
  	"version_year" numeric,
  	"version_location" varchar,
  	"version_external_u_r_l" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_hero_media_id" integer,
  	"version_featured_media_id" integer,
  	"version_review_status" "enum__projects_v_version_review_status",
  	"version_translation_status_fr" "enum__projects_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__projects_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__projects_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__projects_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__projects_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_short_statement" varchar,
  	"version_excerpt" varchar,
  	"version_challenge" jsonb,
  	"version_approach" jsonb,
  	"version_deliverables" jsonb,
  	"version_outcome" jsonb,
  	"version_results_note" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"industries_id" integer,
  	"project_types_id" integer,
  	"context_tags_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "testimonials_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_testimonials_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "testimonials_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_testimonials_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "testimonials_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_title" varchar,
  	"original_quote" varchar,
  	"original_locale" "enum_testimonials_original_locale",
  	"person_name" varchar,
  	"person_role" varchar,
  	"organization_name" varchar,
  	"client_id" integer,
  	"project_id" integer,
  	"person_photo_id" integer,
  	"organization_logo_id" integer,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"review_status" "enum_testimonials_review_status",
  	"translation_status_fr" "enum_testimonials_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_testimonials_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_testimonials_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_testimonials_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_testimonials_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_locales" (
  	"translated_quote" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v_version_source_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__testimonials_v_version_source_references_type",
  	"label" varchar,
  	"url" varchar,
  	"note" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_testimonials_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__testimonials_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_testimonials_v_version_taxonomy_suggestions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_title" varchar,
  	"version_original_quote" varchar,
  	"version_original_locale" "enum__testimonials_v_version_original_locale",
  	"version_person_name" varchar,
  	"version_person_role" varchar,
  	"version_organization_name" varchar,
  	"version_client_id" integer,
  	"version_project_id" integer,
  	"version_person_photo_id" integer,
  	"version_organization_logo_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_review_status" "enum__testimonials_v_version_review_status",
  	"version_translation_status_fr" "enum__testimonials_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__testimonials_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__testimonials_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__testimonials_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__testimonials_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__testimonials_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_translated_quote" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"website" varchar,
  	"project_type_id" integer,
  	"estimated_budget" varchar,
  	"desired_start" timestamp(3) with time zone,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ai_audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"actor_id" integer,
  	"api_key_reference" varchar,
  	"tool" varchar NOT NULL,
  	"action" varchar NOT NULL,
  	"target_collection" varchar,
  	"target_document" varchar,
  	"result" "enum_ai_audit_logs_result" NOT NULL,
  	"correlation_id" varchar NOT NULL,
  	"changed_fields" jsonb,
  	"locale" "enum_ai_audit_logs_locale",
  	"error_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"industries_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"project_types_id" integer,
  	"context_tags_id" integer,
  	"clients_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer,
  	"inquiries_id" integer,
  	"ai_audit_logs_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'Global Communication Corporate' NOT NULL,
  	"short_name" varchar DEFAULT 'Global Comm',
  	"site_u_r_l" varchar DEFAULT 'https://globalcomm.ma' NOT NULL,
  	"primary_email" varchar,
  	"primary_phone" varchar,
  	"organization_logo_id" integer,
  	"default_o_g_image_id" integer,
  	"analytics_plausible_domain" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"address" varchar,
  	"default_s_e_o_title" varchar,
  	"default_s_e_o_description" varchar,
  	"copyright_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_primary_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"opens_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_primary_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"opens_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_footer_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_legal_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"opens_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_legal_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_navigation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_navigation_v_version_primary_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"opens_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_primary_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"opens_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_legal_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"opens_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_legal_navigation_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__navigation_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "home_page_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_home_page_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_url" varchar,
  	"closing_c_t_a_url" varchar,
  	"review_status" "enum_home_page_review_status",
  	"translation_status_fr" "enum_home_page_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_home_page_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_home_page_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_home_page_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_home_page_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"primary_c_t_a_label" varchar,
  	"secondary_c_t_a_label" varchar,
  	"method_heading" varchar,
  	"method_intro" varchar,
  	"closing_c_t_a_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"clients_id" integer,
  	"projects_id" integer,
  	"industries_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_home_page_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__home_page_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_primary_c_t_a_url" varchar,
  	"version_secondary_c_t_a_url" varchar,
  	"version_closing_c_t_a_url" varchar,
  	"version_review_status" "enum__home_page_v_version_review_status",
  	"version_translation_status_fr" "enum__home_page_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__home_page_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__home_page_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__home_page_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__home_page_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_page_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_primary_c_t_a_label" varchar,
  	"version_secondary_c_t_a_label" varchar,
  	"version_method_heading" varchar,
  	"version_method_intro" varchar,
  	"version_closing_c_t_a_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"clients_id" integer,
  	"projects_id" integer,
  	"industries_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "services_page_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_page_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_c_t_a_url" varchar,
  	"review_status" "enum_services_page_review_status",
  	"translation_status_fr" "enum_services_page_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_services_page_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_services_page_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_services_page_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_services_page_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"_status" "enum_services_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"closing_c_t_a_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_services_page_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__services_page_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_services_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_closing_c_t_a_url" varchar,
  	"version_review_status" "enum__services_page_v_version_review_status",
  	"version_translation_status_fr" "enum__services_page_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__services_page_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__services_page_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__services_page_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__services_page_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version__status" "enum__services_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__services_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_services_page_v_locales" (
  	"version_eyebrow" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_closing_c_t_a_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "work_page_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_work_page_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "work_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_c_t_a_url" varchar,
  	"review_status" "enum_work_page_review_status",
  	"translation_status_fr" "enum_work_page_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_work_page_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_work_page_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_work_page_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_work_page_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"_status" "enum_work_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "work_page_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"closing_c_t_a_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_work_page_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__work_page_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_work_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_closing_c_t_a_url" varchar,
  	"version_review_status" "enum__work_page_v_version_review_status",
  	"version_translation_status_fr" "enum__work_page_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__work_page_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__work_page_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__work_page_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__work_page_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version__status" "enum__work_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__work_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_work_page_v_locales" (
  	"version_eyebrow" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_closing_c_t_a_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "company_page_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_company_page_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "company_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"closing_c_t_a_url" varchar,
  	"review_status" "enum_company_page_review_status",
  	"translation_status_fr" "enum_company_page_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_company_page_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_company_page_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_company_page_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_company_page_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"_status" "enum_company_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_page_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"who_we_are" jsonb,
  	"what_we_believe" jsonb,
  	"how_we_work" jsonb,
  	"closing_c_t_a_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "company_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"clients_id" integer,
  	"industries_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_company_page_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__company_page_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_company_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_closing_c_t_a_url" varchar,
  	"version_review_status" "enum__company_page_v_version_review_status",
  	"version_translation_status_fr" "enum__company_page_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__company_page_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__company_page_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__company_page_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__company_page_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version__status" "enum__company_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__company_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_company_page_v_locales" (
  	"version_eyebrow" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_who_we_are" jsonb,
  	"version_what_we_believe" jsonb,
  	"version_how_we_work" jsonb,
  	"version_closing_c_t_a_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_company_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"clients_id" integer,
  	"industries_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "contact_page_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_contact_page_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"review_status" "enum_contact_page_review_status",
  	"translation_status_fr" "enum_contact_page_translation_status_fr" DEFAULT 'missing',
  	"translation_status_en" "enum_contact_page_translation_status_en" DEFAULT 'missing',
  	"translation_status_es" "enum_contact_page_translation_status_es" DEFAULT 'missing',
  	"ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"ai_meta_provider" varchar,
  	"ai_meta_model" varchar,
  	"ai_meta_operation" varchar,
  	"ai_meta_generated_at" timestamp(3) with time zone,
  	"ai_meta_run_id" varchar,
  	"ai_meta_actor_user_id" integer,
  	"ai_meta_source_locale" "enum_contact_page_ai_meta_source_locale",
  	"ai_meta_target_locale" "enum_contact_page_ai_meta_target_locale",
  	"ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"meta_open_graph_image_id" integer,
  	"meta_robots_no_index" boolean DEFAULT false,
  	"meta_robots_no_follow" boolean DEFAULT false,
  	"meta_canonical_override" varchar,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"direct_contact" varchar,
  	"office_location" varchar,
  	"form_intro" varchar,
  	"closing_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_open_graph_title" varchar,
  	"meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_contact_page_v_version_dirty_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__contact_page_v_version_dirty_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_review_status" "enum__contact_page_v_version_review_status",
  	"version_translation_status_fr" "enum__contact_page_v_version_translation_status_fr" DEFAULT 'missing',
  	"version_translation_status_en" "enum__contact_page_v_version_translation_status_en" DEFAULT 'missing',
  	"version_translation_status_es" "enum__contact_page_v_version_translation_status_es" DEFAULT 'missing',
  	"version_ai_meta_generated_by_a_i" boolean DEFAULT false,
  	"version_ai_meta_provider" varchar,
  	"version_ai_meta_model" varchar,
  	"version_ai_meta_operation" varchar,
  	"version_ai_meta_generated_at" timestamp(3) with time zone,
  	"version_ai_meta_run_id" varchar,
  	"version_ai_meta_actor_user_id" integer,
  	"version_ai_meta_source_locale" "enum__contact_page_v_version_ai_meta_source_locale",
  	"version_ai_meta_target_locale" "enum__contact_page_v_version_ai_meta_target_locale",
  	"version_ai_meta_last_a_i_update" timestamp(3) with time zone,
  	"version_meta_open_graph_image_id" integer,
  	"version_meta_robots_no_index" boolean DEFAULT false,
  	"version_meta_robots_no_follow" boolean DEFAULT false,
  	"version_meta_canonical_override" varchar,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__contact_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_contact_page_v_locales" (
  	"version_eyebrow" varchar,
  	"version_heading" varchar,
  	"version_intro" varchar,
  	"version_direct_contact" varchar,
  	"version_office_location" varchar,
  	"version_form_intro" varchar,
  	"version_closing_text" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_open_graph_title" varchar,
  	"version_meta_open_graph_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_aliases" ADD CONSTRAINT "services_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_dirty_locales" ADD CONSTRAINT "services_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_taxonomy_suggestions" ADD CONSTRAINT "services_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_source_references" ADD CONSTRAINT "services_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_aliases" ADD CONSTRAINT "_services_v_version_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_dirty_locales" ADD CONSTRAINT "_services_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_taxonomy_suggestions" ADD CONSTRAINT "_services_v_version_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_source_references" ADD CONSTRAINT "_services_v_version_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_parent_id_services_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_aliases" ADD CONSTRAINT "industries_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_dirty_locales" ADD CONSTRAINT "industries_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_taxonomy_suggestions" ADD CONSTRAINT "industries_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_source_references" ADD CONSTRAINT "industries_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries_locales" ADD CONSTRAINT "industries_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries_locales" ADD CONSTRAINT "industries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_rels" ADD CONSTRAINT "industries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_rels" ADD CONSTRAINT "industries_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_aliases" ADD CONSTRAINT "_industries_v_version_aliases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_dirty_locales" ADD CONSTRAINT "_industries_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_taxonomy_suggestions" ADD CONSTRAINT "_industries_v_version_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_source_references" ADD CONSTRAINT "_industries_v_version_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_parent_id_industries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v_locales" ADD CONSTRAINT "_industries_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v_locales" ADD CONSTRAINT "_industries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_rels" ADD CONSTRAINT "_industries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_rels" ADD CONSTRAINT "_industries_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_types_locales" ADD CONSTRAINT "project_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "context_tags_locales" ADD CONSTRAINT "context_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."context_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_dirty_locales" ADD CONSTRAINT "clients_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_taxonomy_suggestions" ADD CONSTRAINT "clients_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_source_references" ADD CONSTRAINT "clients_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_locales" ADD CONSTRAINT "clients_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_locales" ADD CONSTRAINT "clients_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_version_dirty_locales" ADD CONSTRAINT "_clients_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_version_taxonomy_suggestions" ADD CONSTRAINT "_clients_v_version_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_version_source_references" ADD CONSTRAINT "_clients_v_version_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_parent_id_clients_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v_locales" ADD CONSTRAINT "_clients_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v_locales" ADD CONSTRAINT "_clients_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_rels" ADD CONSTRAINT "_clients_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_rels" ADD CONSTRAINT "_clients_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_metrics" ADD CONSTRAINT "projects_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_metrics_locales" ADD CONSTRAINT "projects_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_dirty_locales" ADD CONSTRAINT "projects_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_taxonomy_suggestions" ADD CONSTRAINT "projects_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_source_references" ADD CONSTRAINT "projects_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_media_id_media_id_fk" FOREIGN KEY ("featured_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_project_types_fk" FOREIGN KEY ("project_types_id") REFERENCES "public"."project_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_context_tags_fk" FOREIGN KEY ("context_tags_id") REFERENCES "public"."context_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_metrics" ADD CONSTRAINT "_projects_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_metrics_locales" ADD CONSTRAINT "_projects_v_version_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_dirty_locales" ADD CONSTRAINT "_projects_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_taxonomy_suggestions" ADD CONSTRAINT "_projects_v_version_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_source_references" ADD CONSTRAINT "_projects_v_version_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_featured_media_id_media_id_fk" FOREIGN KEY ("version_featured_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_project_types_fk" FOREIGN KEY ("project_types_id") REFERENCES "public"."project_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_context_tags_fk" FOREIGN KEY ("context_tags_id") REFERENCES "public"."context_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_source_references" ADD CONSTRAINT "testimonials_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_dirty_locales" ADD CONSTRAINT "testimonials_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_taxonomy_suggestions" ADD CONSTRAINT "testimonials_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_person_photo_id_media_id_fk" FOREIGN KEY ("person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_version_source_references" ADD CONSTRAINT "_testimonials_v_version_source_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_version_dirty_locales" ADD CONSTRAINT "_testimonials_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_version_taxonomy_suggestions" ADD CONSTRAINT "_testimonials_v_version_taxonomy_suggestions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_person_photo_id_media_id_fk" FOREIGN KEY ("version_person_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_organization_logo_id_media_id_fk" FOREIGN KEY ("version_organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_project_type_id_project_types_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."project_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ai_audit_logs" ADD CONSTRAINT "ai_audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_types_fk" FOREIGN KEY ("project_types_id") REFERENCES "public"."project_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_context_tags_fk" FOREIGN KEY ("context_tags_id") REFERENCES "public"."context_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_audit_logs_fk" FOREIGN KEY ("ai_audit_logs_id") REFERENCES "public"."ai_audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_o_g_image_id_media_id_fk" FOREIGN KEY ("default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary_navigation" ADD CONSTRAINT "navigation_primary_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary_navigation_locales" ADD CONSTRAINT "navigation_primary_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_primary_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_navigation" ADD CONSTRAINT "navigation_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_navigation_locales" ADD CONSTRAINT "navigation_footer_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_legal_navigation" ADD CONSTRAINT "navigation_legal_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_legal_navigation_locales" ADD CONSTRAINT "navigation_legal_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_legal_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_primary_navigation" ADD CONSTRAINT "_navigation_v_version_primary_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_primary_navigation_locales" ADD CONSTRAINT "_navigation_v_version_primary_navigation_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_primary_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_navigation" ADD CONSTRAINT "_navigation_v_version_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_navigation_locales" ADD CONSTRAINT "_navigation_v_version_footer_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_footer_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_legal_navigation" ADD CONSTRAINT "_navigation_v_version_legal_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_legal_navigation_locales" ADD CONSTRAINT "_navigation_v_version_legal_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_legal_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_dirty_locales" ADD CONSTRAINT "home_page_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_dirty_locales" ADD CONSTRAINT "_home_page_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_dirty_locales" ADD CONSTRAINT "services_page_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page_locales" ADD CONSTRAINT "services_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page_locales" ADD CONSTRAINT "services_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_rels" ADD CONSTRAINT "services_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_rels" ADD CONSTRAINT "services_page_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v_version_dirty_locales" ADD CONSTRAINT "_services_page_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v" ADD CONSTRAINT "_services_page_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_page_v" ADD CONSTRAINT "_services_page_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_page_v_locales" ADD CONSTRAINT "_services_page_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_page_v_locales" ADD CONSTRAINT "_services_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v_rels" ADD CONSTRAINT "_services_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_page_v_rels" ADD CONSTRAINT "_services_page_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_page_dirty_locales" ADD CONSTRAINT "work_page_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_page" ADD CONSTRAINT "work_page_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_page" ADD CONSTRAINT "work_page_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_page_locales" ADD CONSTRAINT "work_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_page_locales" ADD CONSTRAINT "work_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_page_v_version_dirty_locales" ADD CONSTRAINT "_work_page_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_work_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_page_v" ADD CONSTRAINT "_work_page_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_page_v" ADD CONSTRAINT "_work_page_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_page_v_locales" ADD CONSTRAINT "_work_page_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_page_v_locales" ADD CONSTRAINT "_work_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_work_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_page_dirty_locales" ADD CONSTRAINT "company_page_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."company_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_page" ADD CONSTRAINT "company_page_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_page" ADD CONSTRAINT "company_page_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_page_locales" ADD CONSTRAINT "company_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_page_locales" ADD CONSTRAINT "company_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_page_rels" ADD CONSTRAINT "company_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."company_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_page_rels" ADD CONSTRAINT "company_page_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_page_rels" ADD CONSTRAINT "company_page_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_page_rels" ADD CONSTRAINT "company_page_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_page_v_version_dirty_locales" ADD CONSTRAINT "_company_page_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_company_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_page_v" ADD CONSTRAINT "_company_page_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_company_page_v" ADD CONSTRAINT "_company_page_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_company_page_v_locales" ADD CONSTRAINT "_company_page_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_company_page_v_locales" ADD CONSTRAINT "_company_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_page_v_rels" ADD CONSTRAINT "_company_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_company_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_page_v_rels" ADD CONSTRAINT "_company_page_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_page_v_rels" ADD CONSTRAINT "_company_page_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_page_v_rels" ADD CONSTRAINT "_company_page_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_dirty_locales" ADD CONSTRAINT "contact_page_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_dirty_locales" ADD CONSTRAINT "_contact_page_v_version_dirty_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_ai_meta_actor_user_id_users_id_fk" FOREIGN KEY ("version_ai_meta_actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_meta_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_meta_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_logo_sizes_logo_filename_idx" ON "media" USING btree ("sizes_logo_filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_project_card_sizes_project_card_filename_idx" ON "media" USING btree ("sizes_project_card_filename");
  CREATE INDEX "media_sizes_project_feature_sizes_project_feature_filena_idx" ON "media" USING btree ("sizes_project_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_open_graph_sizes_open_graph_filename_idx" ON "media" USING btree ("sizes_open_graph_filename");
  CREATE INDEX "media_sizes_portrait_sizes_portrait_filename_idx" ON "media" USING btree ("sizes_portrait_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_aliases_order_idx" ON "services_aliases" USING btree ("_order");
  CREATE INDEX "services_aliases_parent_id_idx" ON "services_aliases" USING btree ("_parent_id");
  CREATE INDEX "services_aliases_locale_idx" ON "services_aliases" USING btree ("_locale");
  CREATE INDEX "services_dirty_locales_order_idx" ON "services_dirty_locales" USING btree ("order");
  CREATE INDEX "services_dirty_locales_parent_idx" ON "services_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "services_taxonomy_suggestions_order_idx" ON "services_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "services_taxonomy_suggestions_parent_id_idx" ON "services_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "services_source_references_order_idx" ON "services_source_references" USING btree ("_order");
  CREATE INDEX "services_source_references_parent_id_idx" ON "services_source_references" USING btree ("_parent_id");
  CREATE INDEX "services_parent_idx" ON "services" USING btree ("parent_id");
  CREATE INDEX "services_hero_media_idx" ON "services" USING btree ("hero_media_id");
  CREATE INDEX "services_ai_meta_ai_meta_actor_user_idx" ON "services" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "services_meta_open_graph_meta_open_graph_image_idx" ON "services" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services_locales" USING btree ("slug","_locale");
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_version_aliases_order_idx" ON "_services_v_version_aliases" USING btree ("_order");
  CREATE INDEX "_services_v_version_aliases_parent_id_idx" ON "_services_v_version_aliases" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_aliases_locale_idx" ON "_services_v_version_aliases" USING btree ("_locale");
  CREATE INDEX "_services_v_version_dirty_locales_order_idx" ON "_services_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_services_v_version_dirty_locales_parent_idx" ON "_services_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_taxonomy_suggestions_order_idx" ON "_services_v_version_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "_services_v_version_taxonomy_suggestions_parent_id_idx" ON "_services_v_version_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_source_references_order_idx" ON "_services_v_version_source_references" USING btree ("_order");
  CREATE INDEX "_services_v_version_source_references_parent_id_idx" ON "_services_v_version_source_references" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_parent_idx" ON "_services_v" USING btree ("version_parent_id");
  CREATE INDEX "_services_v_version_version_hero_media_idx" ON "_services_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_services_v_version_ai_meta_version_ai_meta_actor_user_idx" ON "_services_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_services_v_version_meta_open_graph_version_meta_open_gr_idx" ON "_services_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "industries_aliases_order_idx" ON "industries_aliases" USING btree ("_order");
  CREATE INDEX "industries_aliases_parent_id_idx" ON "industries_aliases" USING btree ("_parent_id");
  CREATE INDEX "industries_aliases_locale_idx" ON "industries_aliases" USING btree ("_locale");
  CREATE INDEX "industries_dirty_locales_order_idx" ON "industries_dirty_locales" USING btree ("order");
  CREATE INDEX "industries_dirty_locales_parent_idx" ON "industries_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "industries_taxonomy_suggestions_order_idx" ON "industries_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "industries_taxonomy_suggestions_parent_id_idx" ON "industries_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "industries_source_references_order_idx" ON "industries_source_references" USING btree ("_order");
  CREATE INDEX "industries_source_references_parent_id_idx" ON "industries_source_references" USING btree ("_parent_id");
  CREATE INDEX "industries_hero_media_idx" ON "industries" USING btree ("hero_media_id");
  CREATE INDEX "industries_ai_meta_ai_meta_actor_user_idx" ON "industries" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "industries_meta_open_graph_meta_open_graph_image_idx" ON "industries" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "industries_updated_at_idx" ON "industries" USING btree ("updated_at");
  CREATE INDEX "industries_created_at_idx" ON "industries" USING btree ("created_at");
  CREATE INDEX "industries__status_idx" ON "industries" USING btree ("_status");
  CREATE UNIQUE INDEX "industries_slug_idx" ON "industries_locales" USING btree ("slug","_locale");
  CREATE INDEX "industries_meta_meta_image_idx" ON "industries_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "industries_locales_locale_parent_id_unique" ON "industries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "industries_rels_order_idx" ON "industries_rels" USING btree ("order");
  CREATE INDEX "industries_rels_parent_idx" ON "industries_rels" USING btree ("parent_id");
  CREATE INDEX "industries_rels_path_idx" ON "industries_rels" USING btree ("path");
  CREATE INDEX "industries_rels_services_id_idx" ON "industries_rels" USING btree ("services_id");
  CREATE INDEX "_industries_v_version_aliases_order_idx" ON "_industries_v_version_aliases" USING btree ("_order");
  CREATE INDEX "_industries_v_version_aliases_parent_id_idx" ON "_industries_v_version_aliases" USING btree ("_parent_id");
  CREATE INDEX "_industries_v_version_aliases_locale_idx" ON "_industries_v_version_aliases" USING btree ("_locale");
  CREATE INDEX "_industries_v_version_dirty_locales_order_idx" ON "_industries_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_industries_v_version_dirty_locales_parent_idx" ON "_industries_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_industries_v_version_taxonomy_suggestions_order_idx" ON "_industries_v_version_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "_industries_v_version_taxonomy_suggestions_parent_id_idx" ON "_industries_v_version_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "_industries_v_version_source_references_order_idx" ON "_industries_v_version_source_references" USING btree ("_order");
  CREATE INDEX "_industries_v_version_source_references_parent_id_idx" ON "_industries_v_version_source_references" USING btree ("_parent_id");
  CREATE INDEX "_industries_v_parent_idx" ON "_industries_v" USING btree ("parent_id");
  CREATE INDEX "_industries_v_version_version_hero_media_idx" ON "_industries_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_industries_v_version_ai_meta_version_ai_meta_actor_user_idx" ON "_industries_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_industries_v_version_meta_open_graph_version_meta_open__idx" ON "_industries_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_industries_v_version_version_updated_at_idx" ON "_industries_v" USING btree ("version_updated_at");
  CREATE INDEX "_industries_v_version_version_created_at_idx" ON "_industries_v" USING btree ("version_created_at");
  CREATE INDEX "_industries_v_version_version__status_idx" ON "_industries_v" USING btree ("version__status");
  CREATE INDEX "_industries_v_created_at_idx" ON "_industries_v" USING btree ("created_at");
  CREATE INDEX "_industries_v_updated_at_idx" ON "_industries_v" USING btree ("updated_at");
  CREATE INDEX "_industries_v_snapshot_idx" ON "_industries_v" USING btree ("snapshot");
  CREATE INDEX "_industries_v_published_locale_idx" ON "_industries_v" USING btree ("published_locale");
  CREATE INDEX "_industries_v_latest_idx" ON "_industries_v" USING btree ("latest");
  CREATE INDEX "_industries_v_version_version_slug_idx" ON "_industries_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_industries_v_version_meta_version_meta_image_idx" ON "_industries_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_industries_v_locales_locale_parent_id_unique" ON "_industries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_rels_order_idx" ON "_industries_v_rels" USING btree ("order");
  CREATE INDEX "_industries_v_rels_parent_idx" ON "_industries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_industries_v_rels_path_idx" ON "_industries_v_rels" USING btree ("path");
  CREATE INDEX "_industries_v_rels_services_id_idx" ON "_industries_v_rels" USING btree ("services_id");
  CREATE INDEX "project_types_updated_at_idx" ON "project_types" USING btree ("updated_at");
  CREATE INDEX "project_types_created_at_idx" ON "project_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_types_slug_idx" ON "project_types_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "project_types_locales_locale_parent_id_unique" ON "project_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "context_tags_updated_at_idx" ON "context_tags" USING btree ("updated_at");
  CREATE INDEX "context_tags_created_at_idx" ON "context_tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "context_tags_slug_idx" ON "context_tags_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "context_tags_locales_locale_parent_id_unique" ON "context_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clients_dirty_locales_order_idx" ON "clients_dirty_locales" USING btree ("order");
  CREATE INDEX "clients_dirty_locales_parent_idx" ON "clients_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "clients_taxonomy_suggestions_order_idx" ON "clients_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "clients_taxonomy_suggestions_parent_id_idx" ON "clients_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "clients_source_references_order_idx" ON "clients_source_references" USING btree ("_order");
  CREATE INDEX "clients_source_references_parent_id_idx" ON "clients_source_references" USING btree ("_parent_id");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_ai_meta_ai_meta_actor_user_idx" ON "clients" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "clients_meta_open_graph_meta_open_graph_image_idx" ON "clients" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "clients__status_idx" ON "clients" USING btree ("_status");
  CREATE INDEX "clients_meta_meta_image_idx" ON "clients_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "clients_locales_locale_parent_id_unique" ON "clients_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clients_rels_order_idx" ON "clients_rels" USING btree ("order");
  CREATE INDEX "clients_rels_parent_idx" ON "clients_rels" USING btree ("parent_id");
  CREATE INDEX "clients_rels_path_idx" ON "clients_rels" USING btree ("path");
  CREATE INDEX "clients_rels_industries_id_idx" ON "clients_rels" USING btree ("industries_id");
  CREATE INDEX "_clients_v_version_dirty_locales_order_idx" ON "_clients_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_clients_v_version_dirty_locales_parent_idx" ON "_clients_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_clients_v_version_taxonomy_suggestions_order_idx" ON "_clients_v_version_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "_clients_v_version_taxonomy_suggestions_parent_id_idx" ON "_clients_v_version_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "_clients_v_version_source_references_order_idx" ON "_clients_v_version_source_references" USING btree ("_order");
  CREATE INDEX "_clients_v_version_source_references_parent_id_idx" ON "_clients_v_version_source_references" USING btree ("_parent_id");
  CREATE INDEX "_clients_v_parent_idx" ON "_clients_v" USING btree ("parent_id");
  CREATE INDEX "_clients_v_version_version_logo_idx" ON "_clients_v" USING btree ("version_logo_id");
  CREATE INDEX "_clients_v_version_ai_meta_version_ai_meta_actor_user_idx" ON "_clients_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_clients_v_version_meta_open_graph_version_meta_open_gra_idx" ON "_clients_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_clients_v_version_version_updated_at_idx" ON "_clients_v" USING btree ("version_updated_at");
  CREATE INDEX "_clients_v_version_version_created_at_idx" ON "_clients_v" USING btree ("version_created_at");
  CREATE INDEX "_clients_v_version_version__status_idx" ON "_clients_v" USING btree ("version__status");
  CREATE INDEX "_clients_v_created_at_idx" ON "_clients_v" USING btree ("created_at");
  CREATE INDEX "_clients_v_updated_at_idx" ON "_clients_v" USING btree ("updated_at");
  CREATE INDEX "_clients_v_snapshot_idx" ON "_clients_v" USING btree ("snapshot");
  CREATE INDEX "_clients_v_published_locale_idx" ON "_clients_v" USING btree ("published_locale");
  CREATE INDEX "_clients_v_latest_idx" ON "_clients_v" USING btree ("latest");
  CREATE INDEX "_clients_v_version_meta_version_meta_image_idx" ON "_clients_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_clients_v_locales_locale_parent_id_unique" ON "_clients_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_clients_v_rels_order_idx" ON "_clients_v_rels" USING btree ("order");
  CREATE INDEX "_clients_v_rels_parent_idx" ON "_clients_v_rels" USING btree ("parent_id");
  CREATE INDEX "_clients_v_rels_path_idx" ON "_clients_v_rels" USING btree ("path");
  CREATE INDEX "_clients_v_rels_industries_id_idx" ON "_clients_v_rels" USING btree ("industries_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_media_idx" ON "projects_gallery" USING btree ("media_id");
  CREATE INDEX "projects_metrics_order_idx" ON "projects_metrics" USING btree ("_order");
  CREATE INDEX "projects_metrics_parent_id_idx" ON "projects_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_metrics_locales_locale_parent_id_unique" ON "projects_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_dirty_locales_order_idx" ON "projects_dirty_locales" USING btree ("order");
  CREATE INDEX "projects_dirty_locales_parent_idx" ON "projects_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "projects_taxonomy_suggestions_order_idx" ON "projects_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "projects_taxonomy_suggestions_parent_id_idx" ON "projects_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "projects_source_references_order_idx" ON "projects_source_references" USING btree ("_order");
  CREATE INDEX "projects_source_references_parent_id_idx" ON "projects_source_references" USING btree ("_parent_id");
  CREATE INDEX "projects_client_idx" ON "projects" USING btree ("client_id");
  CREATE INDEX "projects_hero_media_idx" ON "projects" USING btree ("hero_media_id");
  CREATE INDEX "projects_featured_media_idx" ON "projects" USING btree ("featured_media_id");
  CREATE INDEX "projects_ai_meta_ai_meta_actor_user_idx" ON "projects" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "projects_meta_open_graph_meta_open_graph_image_idx" ON "projects" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects_locales" USING btree ("slug","_locale");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  CREATE INDEX "projects_rels_industries_id_idx" ON "projects_rels" USING btree ("industries_id");
  CREATE INDEX "projects_rels_project_types_id_idx" ON "projects_rels" USING btree ("project_types_id");
  CREATE INDEX "projects_rels_context_tags_id_idx" ON "projects_rels" USING btree ("context_tags_id");
  CREATE INDEX "projects_rels_testimonials_id_idx" ON "projects_rels" USING btree ("testimonials_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_media_idx" ON "_projects_v_version_gallery" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_metrics_order_idx" ON "_projects_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_projects_v_version_metrics_parent_id_idx" ON "_projects_v_version_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_metrics_locales_locale_parent_id_unique" ON "_projects_v_version_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_dirty_locales_order_idx" ON "_projects_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_projects_v_version_dirty_locales_parent_idx" ON "_projects_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_taxonomy_suggestions_order_idx" ON "_projects_v_version_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "_projects_v_version_taxonomy_suggestions_parent_id_idx" ON "_projects_v_version_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_source_references_order_idx" ON "_projects_v_version_source_references" USING btree ("_order");
  CREATE INDEX "_projects_v_version_source_references_parent_id_idx" ON "_projects_v_version_source_references" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_client_idx" ON "_projects_v" USING btree ("version_client_id");
  CREATE INDEX "_projects_v_version_version_hero_media_idx" ON "_projects_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_projects_v_version_version_featured_media_idx" ON "_projects_v" USING btree ("version_featured_media_id");
  CREATE INDEX "_projects_v_version_ai_meta_version_ai_meta_actor_user_idx" ON "_projects_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_projects_v_version_meta_open_graph_version_meta_open_gr_idx" ON "_projects_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_services_id_idx" ON "_projects_v_rels" USING btree ("services_id");
  CREATE INDEX "_projects_v_rels_industries_id_idx" ON "_projects_v_rels" USING btree ("industries_id");
  CREATE INDEX "_projects_v_rels_project_types_id_idx" ON "_projects_v_rels" USING btree ("project_types_id");
  CREATE INDEX "_projects_v_rels_context_tags_id_idx" ON "_projects_v_rels" USING btree ("context_tags_id");
  CREATE INDEX "_projects_v_rels_testimonials_id_idx" ON "_projects_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "testimonials_source_references_order_idx" ON "testimonials_source_references" USING btree ("_order");
  CREATE INDEX "testimonials_source_references_parent_id_idx" ON "testimonials_source_references" USING btree ("_parent_id");
  CREATE INDEX "testimonials_dirty_locales_order_idx" ON "testimonials_dirty_locales" USING btree ("order");
  CREATE INDEX "testimonials_dirty_locales_parent_idx" ON "testimonials_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "testimonials_taxonomy_suggestions_order_idx" ON "testimonials_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "testimonials_taxonomy_suggestions_parent_id_idx" ON "testimonials_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "testimonials_client_idx" ON "testimonials" USING btree ("client_id");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials_person_photo_idx" ON "testimonials" USING btree ("person_photo_id");
  CREATE INDEX "testimonials_organization_logo_idx" ON "testimonials" USING btree ("organization_logo_id");
  CREATE INDEX "testimonials_ai_meta_ai_meta_actor_user_idx" ON "testimonials" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "testimonials_meta_open_graph_meta_open_graph_image_idx" ON "testimonials" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "testimonials_meta_meta_image_idx" ON "testimonials_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_version_source_references_order_idx" ON "_testimonials_v_version_source_references" USING btree ("_order");
  CREATE INDEX "_testimonials_v_version_source_references_parent_id_idx" ON "_testimonials_v_version_source_references" USING btree ("_parent_id");
  CREATE INDEX "_testimonials_v_version_dirty_locales_order_idx" ON "_testimonials_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_testimonials_v_version_dirty_locales_parent_idx" ON "_testimonials_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_taxonomy_suggestions_order_idx" ON "_testimonials_v_version_taxonomy_suggestions" USING btree ("_order");
  CREATE INDEX "_testimonials_v_version_taxonomy_suggestions_parent_id_idx" ON "_testimonials_v_version_taxonomy_suggestions" USING btree ("_parent_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_client_idx" ON "_testimonials_v" USING btree ("version_client_id");
  CREATE INDEX "_testimonials_v_version_version_project_idx" ON "_testimonials_v" USING btree ("version_project_id");
  CREATE INDEX "_testimonials_v_version_version_person_photo_idx" ON "_testimonials_v" USING btree ("version_person_photo_id");
  CREATE INDEX "_testimonials_v_version_version_organization_logo_idx" ON "_testimonials_v" USING btree ("version_organization_logo_id");
  CREATE INDEX "_testimonials_v_version_ai_meta_version_ai_meta_actor_us_idx" ON "_testimonials_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_testimonials_v_version_meta_open_graph_version_meta_ope_idx" ON "_testimonials_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_version_meta_version_meta_image_idx" ON "_testimonials_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_project_type_idx" ON "inquiries" USING btree ("project_type_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "ai_audit_logs_actor_idx" ON "ai_audit_logs" USING btree ("actor_id");
  CREATE INDEX "ai_audit_logs_correlation_id_idx" ON "ai_audit_logs" USING btree ("correlation_id");
  CREATE INDEX "ai_audit_logs_updated_at_idx" ON "ai_audit_logs" USING btree ("updated_at");
  CREATE INDEX "ai_audit_logs_created_at_idx" ON "ai_audit_logs" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX "redirects_rels_industries_id_idx" ON "redirects_rels" USING btree ("industries_id");
  CREATE INDEX "redirects_rels_projects_id_idx" ON "redirects_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_industries_id_idx" ON "payload_locked_documents_rels" USING btree ("industries_id");
  CREATE INDEX "payload_locked_documents_rels_project_types_id_idx" ON "payload_locked_documents_rels" USING btree ("project_types_id");
  CREATE INDEX "payload_locked_documents_rels_context_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("context_tags_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_ai_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_organization_logo_idx" ON "site_settings" USING btree ("organization_logo_id");
  CREATE INDEX "site_settings_default_o_g_image_idx" ON "site_settings" USING btree ("default_o_g_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_primary_navigation_order_idx" ON "navigation_primary_navigation" USING btree ("_order");
  CREATE INDEX "navigation_primary_navigation_parent_id_idx" ON "navigation_primary_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_primary_navigation_locales_locale_parent_id_uniqu" ON "navigation_primary_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_navigation_order_idx" ON "navigation_footer_navigation" USING btree ("_order");
  CREATE INDEX "navigation_footer_navigation_parent_id_idx" ON "navigation_footer_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_navigation_locales_locale_parent_id_unique" ON "navigation_footer_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_legal_navigation_order_idx" ON "navigation_legal_navigation" USING btree ("_order");
  CREATE INDEX "navigation_legal_navigation_parent_id_idx" ON "navigation_legal_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_legal_navigation_locales_locale_parent_id_unique" ON "navigation_legal_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE INDEX "_navigation_v_version_primary_navigation_order_idx" ON "_navigation_v_version_primary_navigation" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_primary_navigation_parent_id_idx" ON "_navigation_v_version_primary_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_primary_navigation_locales_locale_pare" ON "_navigation_v_version_primary_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_footer_navigation_order_idx" ON "_navigation_v_version_footer_navigation" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_navigation_parent_id_idx" ON "_navigation_v_version_footer_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_footer_navigation_locales_locale_paren" ON "_navigation_v_version_footer_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_legal_navigation_order_idx" ON "_navigation_v_version_legal_navigation" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_legal_navigation_parent_id_idx" ON "_navigation_v_version_legal_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_legal_navigation_locales_locale_parent" ON "_navigation_v_version_legal_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_snapshot_idx" ON "_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_navigation_v_published_locale_idx" ON "_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");
  CREATE INDEX "home_page_dirty_locales_order_idx" ON "home_page_dirty_locales" USING btree ("order");
  CREATE INDEX "home_page_dirty_locales_parent_idx" ON "home_page_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "home_page_ai_meta_ai_meta_actor_user_idx" ON "home_page" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "home_page_meta_open_graph_meta_open_graph_image_idx" ON "home_page" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "home_page_meta_meta_image_idx" ON "home_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_clients_id_idx" ON "home_page_rels" USING btree ("clients_id");
  CREATE INDEX "home_page_rels_projects_id_idx" ON "home_page_rels" USING btree ("projects_id");
  CREATE INDEX "home_page_rels_industries_id_idx" ON "home_page_rels" USING btree ("industries_id");
  CREATE INDEX "home_page_rels_testimonials_id_idx" ON "home_page_rels" USING btree ("testimonials_id");
  CREATE INDEX "_home_page_v_version_dirty_locales_order_idx" ON "_home_page_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_home_page_v_version_dirty_locales_parent_idx" ON "_home_page_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_version_ai_meta_version_ai_meta_actor_user_idx" ON "_home_page_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_home_page_v_version_meta_open_graph_version_meta_open_g_idx" ON "_home_page_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
  CREATE INDEX "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_version_meta_version_meta_image_idx" ON "_home_page_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_rels_order_idx" ON "_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON "_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON "_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_clients_id_idx" ON "_home_page_v_rels" USING btree ("clients_id");
  CREATE INDEX "_home_page_v_rels_projects_id_idx" ON "_home_page_v_rels" USING btree ("projects_id");
  CREATE INDEX "_home_page_v_rels_industries_id_idx" ON "_home_page_v_rels" USING btree ("industries_id");
  CREATE INDEX "_home_page_v_rels_testimonials_id_idx" ON "_home_page_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "services_page_dirty_locales_order_idx" ON "services_page_dirty_locales" USING btree ("order");
  CREATE INDEX "services_page_dirty_locales_parent_idx" ON "services_page_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "services_page_ai_meta_ai_meta_actor_user_idx" ON "services_page" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "services_page_meta_open_graph_meta_open_graph_image_idx" ON "services_page" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "services_page__status_idx" ON "services_page" USING btree ("_status");
  CREATE INDEX "services_page_meta_meta_image_idx" ON "services_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_page_locales_locale_parent_id_unique" ON "services_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_rels_order_idx" ON "services_page_rels" USING btree ("order");
  CREATE INDEX "services_page_rels_parent_idx" ON "services_page_rels" USING btree ("parent_id");
  CREATE INDEX "services_page_rels_path_idx" ON "services_page_rels" USING btree ("path");
  CREATE INDEX "services_page_rels_projects_id_idx" ON "services_page_rels" USING btree ("projects_id");
  CREATE INDEX "_services_page_v_version_dirty_locales_order_idx" ON "_services_page_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_services_page_v_version_dirty_locales_parent_idx" ON "_services_page_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_services_page_v_version_ai_meta_version_ai_meta_actor_u_idx" ON "_services_page_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_services_page_v_version_meta_open_graph_version_meta_op_idx" ON "_services_page_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_services_page_v_version_version__status_idx" ON "_services_page_v" USING btree ("version__status");
  CREATE INDEX "_services_page_v_created_at_idx" ON "_services_page_v" USING btree ("created_at");
  CREATE INDEX "_services_page_v_updated_at_idx" ON "_services_page_v" USING btree ("updated_at");
  CREATE INDEX "_services_page_v_snapshot_idx" ON "_services_page_v" USING btree ("snapshot");
  CREATE INDEX "_services_page_v_published_locale_idx" ON "_services_page_v" USING btree ("published_locale");
  CREATE INDEX "_services_page_v_latest_idx" ON "_services_page_v" USING btree ("latest");
  CREATE INDEX "_services_page_v_version_meta_version_meta_image_idx" ON "_services_page_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_services_page_v_locales_locale_parent_id_unique" ON "_services_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_page_v_rels_order_idx" ON "_services_page_v_rels" USING btree ("order");
  CREATE INDEX "_services_page_v_rels_parent_idx" ON "_services_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_page_v_rels_path_idx" ON "_services_page_v_rels" USING btree ("path");
  CREATE INDEX "_services_page_v_rels_projects_id_idx" ON "_services_page_v_rels" USING btree ("projects_id");
  CREATE INDEX "work_page_dirty_locales_order_idx" ON "work_page_dirty_locales" USING btree ("order");
  CREATE INDEX "work_page_dirty_locales_parent_idx" ON "work_page_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "work_page_ai_meta_ai_meta_actor_user_idx" ON "work_page" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "work_page_meta_open_graph_meta_open_graph_image_idx" ON "work_page" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "work_page__status_idx" ON "work_page" USING btree ("_status");
  CREATE INDEX "work_page_meta_meta_image_idx" ON "work_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "work_page_locales_locale_parent_id_unique" ON "work_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_work_page_v_version_dirty_locales_order_idx" ON "_work_page_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_work_page_v_version_dirty_locales_parent_idx" ON "_work_page_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_work_page_v_version_ai_meta_version_ai_meta_actor_user_idx" ON "_work_page_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_work_page_v_version_meta_open_graph_version_meta_open_g_idx" ON "_work_page_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_work_page_v_version_version__status_idx" ON "_work_page_v" USING btree ("version__status");
  CREATE INDEX "_work_page_v_created_at_idx" ON "_work_page_v" USING btree ("created_at");
  CREATE INDEX "_work_page_v_updated_at_idx" ON "_work_page_v" USING btree ("updated_at");
  CREATE INDEX "_work_page_v_snapshot_idx" ON "_work_page_v" USING btree ("snapshot");
  CREATE INDEX "_work_page_v_published_locale_idx" ON "_work_page_v" USING btree ("published_locale");
  CREATE INDEX "_work_page_v_latest_idx" ON "_work_page_v" USING btree ("latest");
  CREATE INDEX "_work_page_v_version_meta_version_meta_image_idx" ON "_work_page_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_work_page_v_locales_locale_parent_id_unique" ON "_work_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_page_dirty_locales_order_idx" ON "company_page_dirty_locales" USING btree ("order");
  CREATE INDEX "company_page_dirty_locales_parent_idx" ON "company_page_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "company_page_ai_meta_ai_meta_actor_user_idx" ON "company_page" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "company_page_meta_open_graph_meta_open_graph_image_idx" ON "company_page" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "company_page__status_idx" ON "company_page" USING btree ("_status");
  CREATE INDEX "company_page_meta_meta_image_idx" ON "company_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "company_page_locales_locale_parent_id_unique" ON "company_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_page_rels_order_idx" ON "company_page_rels" USING btree ("order");
  CREATE INDEX "company_page_rels_parent_idx" ON "company_page_rels" USING btree ("parent_id");
  CREATE INDEX "company_page_rels_path_idx" ON "company_page_rels" USING btree ("path");
  CREATE INDEX "company_page_rels_clients_id_idx" ON "company_page_rels" USING btree ("clients_id");
  CREATE INDEX "company_page_rels_industries_id_idx" ON "company_page_rels" USING btree ("industries_id");
  CREATE INDEX "company_page_rels_testimonials_id_idx" ON "company_page_rels" USING btree ("testimonials_id");
  CREATE INDEX "_company_page_v_version_dirty_locales_order_idx" ON "_company_page_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_company_page_v_version_dirty_locales_parent_idx" ON "_company_page_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_company_page_v_version_ai_meta_version_ai_meta_actor_us_idx" ON "_company_page_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_company_page_v_version_meta_open_graph_version_meta_ope_idx" ON "_company_page_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_company_page_v_version_version__status_idx" ON "_company_page_v" USING btree ("version__status");
  CREATE INDEX "_company_page_v_created_at_idx" ON "_company_page_v" USING btree ("created_at");
  CREATE INDEX "_company_page_v_updated_at_idx" ON "_company_page_v" USING btree ("updated_at");
  CREATE INDEX "_company_page_v_snapshot_idx" ON "_company_page_v" USING btree ("snapshot");
  CREATE INDEX "_company_page_v_published_locale_idx" ON "_company_page_v" USING btree ("published_locale");
  CREATE INDEX "_company_page_v_latest_idx" ON "_company_page_v" USING btree ("latest");
  CREATE INDEX "_company_page_v_version_meta_version_meta_image_idx" ON "_company_page_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_company_page_v_locales_locale_parent_id_unique" ON "_company_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_company_page_v_rels_order_idx" ON "_company_page_v_rels" USING btree ("order");
  CREATE INDEX "_company_page_v_rels_parent_idx" ON "_company_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_company_page_v_rels_path_idx" ON "_company_page_v_rels" USING btree ("path");
  CREATE INDEX "_company_page_v_rels_clients_id_idx" ON "_company_page_v_rels" USING btree ("clients_id");
  CREATE INDEX "_company_page_v_rels_industries_id_idx" ON "_company_page_v_rels" USING btree ("industries_id");
  CREATE INDEX "_company_page_v_rels_testimonials_id_idx" ON "_company_page_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "contact_page_dirty_locales_order_idx" ON "contact_page_dirty_locales" USING btree ("order");
  CREATE INDEX "contact_page_dirty_locales_parent_idx" ON "contact_page_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "contact_page_ai_meta_ai_meta_actor_user_idx" ON "contact_page" USING btree ("ai_meta_actor_user_id");
  CREATE INDEX "contact_page_meta_open_graph_meta_open_graph_image_idx" ON "contact_page" USING btree ("meta_open_graph_image_id");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE INDEX "contact_page_meta_meta_image_idx" ON "contact_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_contact_page_v_version_dirty_locales_order_idx" ON "_contact_page_v_version_dirty_locales" USING btree ("order");
  CREATE INDEX "_contact_page_v_version_dirty_locales_parent_idx" ON "_contact_page_v_version_dirty_locales" USING btree ("parent_id");
  CREATE INDEX "_contact_page_v_version_ai_meta_version_ai_meta_actor_us_idx" ON "_contact_page_v" USING btree ("version_ai_meta_actor_user_id");
  CREATE INDEX "_contact_page_v_version_meta_open_graph_version_meta_ope_idx" ON "_contact_page_v" USING btree ("version_meta_open_graph_image_id");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_snapshot_idx" ON "_contact_page_v" USING btree ("snapshot");
  CREATE INDEX "_contact_page_v_published_locale_idx" ON "_contact_page_v" USING btree ("published_locale");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE INDEX "_contact_page_v_version_meta_version_meta_image_idx" ON "_contact_page_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_contact_page_v_locales_locale_parent_id_unique" ON "_contact_page_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "services_aliases" CASCADE;
  DROP TABLE "services_dirty_locales" CASCADE;
  DROP TABLE "services_taxonomy_suggestions" CASCADE;
  DROP TABLE "services_source_references" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "_services_v_version_aliases" CASCADE;
  DROP TABLE "_services_v_version_dirty_locales" CASCADE;
  DROP TABLE "_services_v_version_taxonomy_suggestions" CASCADE;
  DROP TABLE "_services_v_version_source_references" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "industries_aliases" CASCADE;
  DROP TABLE "industries_dirty_locales" CASCADE;
  DROP TABLE "industries_taxonomy_suggestions" CASCADE;
  DROP TABLE "industries_source_references" CASCADE;
  DROP TABLE "industries" CASCADE;
  DROP TABLE "industries_locales" CASCADE;
  DROP TABLE "industries_rels" CASCADE;
  DROP TABLE "_industries_v_version_aliases" CASCADE;
  DROP TABLE "_industries_v_version_dirty_locales" CASCADE;
  DROP TABLE "_industries_v_version_taxonomy_suggestions" CASCADE;
  DROP TABLE "_industries_v_version_source_references" CASCADE;
  DROP TABLE "_industries_v" CASCADE;
  DROP TABLE "_industries_v_locales" CASCADE;
  DROP TABLE "_industries_v_rels" CASCADE;
  DROP TABLE "project_types" CASCADE;
  DROP TABLE "project_types_locales" CASCADE;
  DROP TABLE "context_tags" CASCADE;
  DROP TABLE "context_tags_locales" CASCADE;
  DROP TABLE "clients_dirty_locales" CASCADE;
  DROP TABLE "clients_taxonomy_suggestions" CASCADE;
  DROP TABLE "clients_source_references" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "clients_locales" CASCADE;
  DROP TABLE "clients_rels" CASCADE;
  DROP TABLE "_clients_v_version_dirty_locales" CASCADE;
  DROP TABLE "_clients_v_version_taxonomy_suggestions" CASCADE;
  DROP TABLE "_clients_v_version_source_references" CASCADE;
  DROP TABLE "_clients_v" CASCADE;
  DROP TABLE "_clients_v_locales" CASCADE;
  DROP TABLE "_clients_v_rels" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_metrics" CASCADE;
  DROP TABLE "projects_metrics_locales" CASCADE;
  DROP TABLE "projects_dirty_locales" CASCADE;
  DROP TABLE "projects_taxonomy_suggestions" CASCADE;
  DROP TABLE "projects_source_references" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_version_metrics" CASCADE;
  DROP TABLE "_projects_v_version_metrics_locales" CASCADE;
  DROP TABLE "_projects_v_version_dirty_locales" CASCADE;
  DROP TABLE "_projects_v_version_taxonomy_suggestions" CASCADE;
  DROP TABLE "_projects_v_version_source_references" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "testimonials_source_references" CASCADE;
  DROP TABLE "testimonials_dirty_locales" CASCADE;
  DROP TABLE "testimonials_taxonomy_suggestions" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "_testimonials_v_version_source_references" CASCADE;
  DROP TABLE "_testimonials_v_version_dirty_locales" CASCADE;
  DROP TABLE "_testimonials_v_version_taxonomy_suggestions" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "ai_audit_logs" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_primary_navigation" CASCADE;
  DROP TABLE "navigation_primary_navigation_locales" CASCADE;
  DROP TABLE "navigation_footer_navigation" CASCADE;
  DROP TABLE "navigation_footer_navigation_locales" CASCADE;
  DROP TABLE "navigation_legal_navigation" CASCADE;
  DROP TABLE "navigation_legal_navigation_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "_navigation_v_version_primary_navigation" CASCADE;
  DROP TABLE "_navigation_v_version_primary_navigation_locales" CASCADE;
  DROP TABLE "_navigation_v_version_footer_navigation" CASCADE;
  DROP TABLE "_navigation_v_version_footer_navigation_locales" CASCADE;
  DROP TABLE "_navigation_v_version_legal_navigation" CASCADE;
  DROP TABLE "_navigation_v_version_legal_navigation_locales" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "home_page_dirty_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "_home_page_v_version_dirty_locales" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_locales" CASCADE;
  DROP TABLE "_home_page_v_rels" CASCADE;
  DROP TABLE "services_page_dirty_locales" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "services_page_locales" CASCADE;
  DROP TABLE "services_page_rels" CASCADE;
  DROP TABLE "_services_page_v_version_dirty_locales" CASCADE;
  DROP TABLE "_services_page_v" CASCADE;
  DROP TABLE "_services_page_v_locales" CASCADE;
  DROP TABLE "_services_page_v_rels" CASCADE;
  DROP TABLE "work_page_dirty_locales" CASCADE;
  DROP TABLE "work_page" CASCADE;
  DROP TABLE "work_page_locales" CASCADE;
  DROP TABLE "_work_page_v_version_dirty_locales" CASCADE;
  DROP TABLE "_work_page_v" CASCADE;
  DROP TABLE "_work_page_v_locales" CASCADE;
  DROP TABLE "company_page_dirty_locales" CASCADE;
  DROP TABLE "company_page" CASCADE;
  DROP TABLE "company_page_locales" CASCADE;
  DROP TABLE "company_page_rels" CASCADE;
  DROP TABLE "_company_page_v_version_dirty_locales" CASCADE;
  DROP TABLE "_company_page_v" CASCADE;
  DROP TABLE "_company_page_v_locales" CASCADE;
  DROP TABLE "_company_page_v_rels" CASCADE;
  DROP TABLE "contact_page_dirty_locales" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "_contact_page_v_version_dirty_locales" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TABLE "_contact_page_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_usage_rights";
  DROP TYPE "public"."enum_services_dirty_locales";
  DROP TYPE "public"."enum_services_source_references_type";
  DROP TYPE "public"."enum_services_review_status";
  DROP TYPE "public"."enum_services_translation_status_fr";
  DROP TYPE "public"."enum_services_translation_status_en";
  DROP TYPE "public"."enum_services_translation_status_es";
  DROP TYPE "public"."enum_services_ai_meta_source_locale";
  DROP TYPE "public"."enum_services_ai_meta_target_locale";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_dirty_locales";
  DROP TYPE "public"."enum__services_v_version_source_references_type";
  DROP TYPE "public"."enum__services_v_version_review_status";
  DROP TYPE "public"."enum__services_v_version_translation_status_fr";
  DROP TYPE "public"."enum__services_v_version_translation_status_en";
  DROP TYPE "public"."enum__services_v_version_translation_status_es";
  DROP TYPE "public"."enum__services_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__services_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum_industries_dirty_locales";
  DROP TYPE "public"."enum_industries_source_references_type";
  DROP TYPE "public"."enum_industries_review_status";
  DROP TYPE "public"."enum_industries_translation_status_fr";
  DROP TYPE "public"."enum_industries_translation_status_en";
  DROP TYPE "public"."enum_industries_translation_status_es";
  DROP TYPE "public"."enum_industries_ai_meta_source_locale";
  DROP TYPE "public"."enum_industries_ai_meta_target_locale";
  DROP TYPE "public"."enum_industries_status";
  DROP TYPE "public"."enum__industries_v_version_dirty_locales";
  DROP TYPE "public"."enum__industries_v_version_source_references_type";
  DROP TYPE "public"."enum__industries_v_version_review_status";
  DROP TYPE "public"."enum__industries_v_version_translation_status_fr";
  DROP TYPE "public"."enum__industries_v_version_translation_status_en";
  DROP TYPE "public"."enum__industries_v_version_translation_status_es";
  DROP TYPE "public"."enum__industries_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__industries_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__industries_v_version_status";
  DROP TYPE "public"."enum__industries_v_published_locale";
  DROP TYPE "public"."enum_clients_dirty_locales";
  DROP TYPE "public"."enum_clients_source_references_type";
  DROP TYPE "public"."enum_clients_review_status";
  DROP TYPE "public"."enum_clients_translation_status_fr";
  DROP TYPE "public"."enum_clients_translation_status_en";
  DROP TYPE "public"."enum_clients_translation_status_es";
  DROP TYPE "public"."enum_clients_ai_meta_source_locale";
  DROP TYPE "public"."enum_clients_ai_meta_target_locale";
  DROP TYPE "public"."enum_clients_status";
  DROP TYPE "public"."enum__clients_v_version_dirty_locales";
  DROP TYPE "public"."enum__clients_v_version_source_references_type";
  DROP TYPE "public"."enum__clients_v_version_review_status";
  DROP TYPE "public"."enum__clients_v_version_translation_status_fr";
  DROP TYPE "public"."enum__clients_v_version_translation_status_en";
  DROP TYPE "public"."enum__clients_v_version_translation_status_es";
  DROP TYPE "public"."enum__clients_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__clients_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__clients_v_version_status";
  DROP TYPE "public"."enum__clients_v_published_locale";
  DROP TYPE "public"."enum_projects_dirty_locales";
  DROP TYPE "public"."enum_projects_source_references_type";
  DROP TYPE "public"."enum_projects_review_status";
  DROP TYPE "public"."enum_projects_translation_status_fr";
  DROP TYPE "public"."enum_projects_translation_status_en";
  DROP TYPE "public"."enum_projects_translation_status_es";
  DROP TYPE "public"."enum_projects_ai_meta_source_locale";
  DROP TYPE "public"."enum_projects_ai_meta_target_locale";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_dirty_locales";
  DROP TYPE "public"."enum__projects_v_version_source_references_type";
  DROP TYPE "public"."enum__projects_v_version_review_status";
  DROP TYPE "public"."enum__projects_v_version_translation_status_fr";
  DROP TYPE "public"."enum__projects_v_version_translation_status_en";
  DROP TYPE "public"."enum__projects_v_version_translation_status_es";
  DROP TYPE "public"."enum__projects_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__projects_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_testimonials_source_references_type";
  DROP TYPE "public"."enum_testimonials_dirty_locales";
  DROP TYPE "public"."enum_testimonials_original_locale";
  DROP TYPE "public"."enum_testimonials_review_status";
  DROP TYPE "public"."enum_testimonials_translation_status_fr";
  DROP TYPE "public"."enum_testimonials_translation_status_en";
  DROP TYPE "public"."enum_testimonials_translation_status_es";
  DROP TYPE "public"."enum_testimonials_ai_meta_source_locale";
  DROP TYPE "public"."enum_testimonials_ai_meta_target_locale";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_source_references_type";
  DROP TYPE "public"."enum__testimonials_v_version_dirty_locales";
  DROP TYPE "public"."enum__testimonials_v_version_original_locale";
  DROP TYPE "public"."enum__testimonials_v_version_review_status";
  DROP TYPE "public"."enum__testimonials_v_version_translation_status_fr";
  DROP TYPE "public"."enum__testimonials_v_version_translation_status_en";
  DROP TYPE "public"."enum__testimonials_v_version_translation_status_es";
  DROP TYPE "public"."enum__testimonials_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__testimonials_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_ai_audit_logs_result";
  DROP TYPE "public"."enum_ai_audit_logs_locale";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum__navigation_v_published_locale";
  DROP TYPE "public"."enum_home_page_dirty_locales";
  DROP TYPE "public"."enum_home_page_review_status";
  DROP TYPE "public"."enum_home_page_translation_status_fr";
  DROP TYPE "public"."enum_home_page_translation_status_en";
  DROP TYPE "public"."enum_home_page_translation_status_es";
  DROP TYPE "public"."enum_home_page_ai_meta_source_locale";
  DROP TYPE "public"."enum_home_page_ai_meta_target_locale";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_dirty_locales";
  DROP TYPE "public"."enum__home_page_v_version_review_status";
  DROP TYPE "public"."enum__home_page_v_version_translation_status_fr";
  DROP TYPE "public"."enum__home_page_v_version_translation_status_en";
  DROP TYPE "public"."enum__home_page_v_version_translation_status_es";
  DROP TYPE "public"."enum__home_page_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__home_page_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum__home_page_v_published_locale";
  DROP TYPE "public"."enum_services_page_dirty_locales";
  DROP TYPE "public"."enum_services_page_review_status";
  DROP TYPE "public"."enum_services_page_translation_status_fr";
  DROP TYPE "public"."enum_services_page_translation_status_en";
  DROP TYPE "public"."enum_services_page_translation_status_es";
  DROP TYPE "public"."enum_services_page_ai_meta_source_locale";
  DROP TYPE "public"."enum_services_page_ai_meta_target_locale";
  DROP TYPE "public"."enum_services_page_status";
  DROP TYPE "public"."enum__services_page_v_version_dirty_locales";
  DROP TYPE "public"."enum__services_page_v_version_review_status";
  DROP TYPE "public"."enum__services_page_v_version_translation_status_fr";
  DROP TYPE "public"."enum__services_page_v_version_translation_status_en";
  DROP TYPE "public"."enum__services_page_v_version_translation_status_es";
  DROP TYPE "public"."enum__services_page_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__services_page_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__services_page_v_version_status";
  DROP TYPE "public"."enum__services_page_v_published_locale";
  DROP TYPE "public"."enum_work_page_dirty_locales";
  DROP TYPE "public"."enum_work_page_review_status";
  DROP TYPE "public"."enum_work_page_translation_status_fr";
  DROP TYPE "public"."enum_work_page_translation_status_en";
  DROP TYPE "public"."enum_work_page_translation_status_es";
  DROP TYPE "public"."enum_work_page_ai_meta_source_locale";
  DROP TYPE "public"."enum_work_page_ai_meta_target_locale";
  DROP TYPE "public"."enum_work_page_status";
  DROP TYPE "public"."enum__work_page_v_version_dirty_locales";
  DROP TYPE "public"."enum__work_page_v_version_review_status";
  DROP TYPE "public"."enum__work_page_v_version_translation_status_fr";
  DROP TYPE "public"."enum__work_page_v_version_translation_status_en";
  DROP TYPE "public"."enum__work_page_v_version_translation_status_es";
  DROP TYPE "public"."enum__work_page_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__work_page_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__work_page_v_version_status";
  DROP TYPE "public"."enum__work_page_v_published_locale";
  DROP TYPE "public"."enum_company_page_dirty_locales";
  DROP TYPE "public"."enum_company_page_review_status";
  DROP TYPE "public"."enum_company_page_translation_status_fr";
  DROP TYPE "public"."enum_company_page_translation_status_en";
  DROP TYPE "public"."enum_company_page_translation_status_es";
  DROP TYPE "public"."enum_company_page_ai_meta_source_locale";
  DROP TYPE "public"."enum_company_page_ai_meta_target_locale";
  DROP TYPE "public"."enum_company_page_status";
  DROP TYPE "public"."enum__company_page_v_version_dirty_locales";
  DROP TYPE "public"."enum__company_page_v_version_review_status";
  DROP TYPE "public"."enum__company_page_v_version_translation_status_fr";
  DROP TYPE "public"."enum__company_page_v_version_translation_status_en";
  DROP TYPE "public"."enum__company_page_v_version_translation_status_es";
  DROP TYPE "public"."enum__company_page_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__company_page_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__company_page_v_version_status";
  DROP TYPE "public"."enum__company_page_v_published_locale";
  DROP TYPE "public"."enum_contact_page_dirty_locales";
  DROP TYPE "public"."enum_contact_page_review_status";
  DROP TYPE "public"."enum_contact_page_translation_status_fr";
  DROP TYPE "public"."enum_contact_page_translation_status_en";
  DROP TYPE "public"."enum_contact_page_translation_status_es";
  DROP TYPE "public"."enum_contact_page_ai_meta_source_locale";
  DROP TYPE "public"."enum_contact_page_ai_meta_target_locale";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_dirty_locales";
  DROP TYPE "public"."enum__contact_page_v_version_review_status";
  DROP TYPE "public"."enum__contact_page_v_version_translation_status_fr";
  DROP TYPE "public"."enum__contact_page_v_version_translation_status_en";
  DROP TYPE "public"."enum__contact_page_v_version_translation_status_es";
  DROP TYPE "public"."enum__contact_page_v_version_ai_meta_source_locale";
  DROP TYPE "public"."enum__contact_page_v_version_ai_meta_target_locale";
  DROP TYPE "public"."enum__contact_page_v_version_status";
  DROP TYPE "public"."enum__contact_page_v_published_locale";`)
}
