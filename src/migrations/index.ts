import * as migration_20260831_025813_initial from './20260831_025813_initial';
import * as migration_20260831_031312_mcp_api_keys from './20260831_031312_mcp_api_keys';
import * as migration_20260831_214415_approval_provenance from './20260831_214415_approval_provenance';
import * as migration_20260905_012312_service_pillars from './20260905_012312_service_pillars';
import * as migration_20260905_173054_home_page_sections from './20260905_173054_home_page_sections';
import * as migration_20260906_163614_blob_storage_fields from './20260906_163614_blob_storage_fields';
import * as migration_20260921_032959_services_page_composition from './20260921_032959_services_page_composition';
import * as migration_20260923_050252_services_page_featured_clients from './20260923_050252_services_page_featured_clients';

export const migrations = [
  {
    up: migration_20260831_025813_initial.up,
    down: migration_20260831_025813_initial.down,
    name: '20260831_025813_initial',
  },
  {
    up: migration_20260831_031312_mcp_api_keys.up,
    down: migration_20260831_031312_mcp_api_keys.down,
    name: '20260831_031312_mcp_api_keys',
  },
  {
    up: migration_20260831_214415_approval_provenance.up,
    down: migration_20260831_214415_approval_provenance.down,
    name: '20260831_214415_approval_provenance',
  },
  {
    up: migration_20260905_012312_service_pillars.up,
    down: migration_20260905_012312_service_pillars.down,
    name: '20260905_012312_service_pillars',
  },
  {
    up: migration_20260905_173054_home_page_sections.up,
    down: migration_20260905_173054_home_page_sections.down,
    name: '20260905_173054_home_page_sections',
  },
  {
    up: migration_20260906_163614_blob_storage_fields.up,
    down: migration_20260906_163614_blob_storage_fields.down,
    name: '20260906_163614_blob_storage_fields',
  },
  {
    up: migration_20260921_032959_services_page_composition.up,
    down: migration_20260921_032959_services_page_composition.down,
    name: '20260921_032959_services_page_composition',
  },
  {
    up: migration_20260923_050252_services_page_featured_clients.up,
    down: migration_20260923_050252_services_page_featured_clients.down,
    name: '20260923_050252_services_page_featured_clients',
  },
];
