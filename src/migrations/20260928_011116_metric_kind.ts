import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_metrics_kind" AS ENUM('measured', 'estimate', 'target');
  CREATE TYPE "public"."enum__projects_v_version_metrics_kind" AS ENUM('measured', 'estimate', 'target');
  ALTER TABLE "projects_metrics" ADD COLUMN "kind" "enum_projects_metrics_kind" DEFAULT 'measured';
  ALTER TABLE "_projects_v_version_metrics" ADD COLUMN "kind" "enum__projects_v_version_metrics_kind" DEFAULT 'measured';
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "payload_mcp_tool_update_content" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_metrics" DROP COLUMN "kind";
  ALTER TABLE "_projects_v_version_metrics" DROP COLUMN "kind";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "payload_mcp_tool_update_content";
  DROP TYPE "public"."enum_projects_metrics_kind";
  DROP TYPE "public"."enum__projects_v_version_metrics_kind";`)
}
