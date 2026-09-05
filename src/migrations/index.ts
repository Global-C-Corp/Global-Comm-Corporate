import * as migration_20260831_025813_initial from './20260831_025813_initial';
import * as migration_20260831_031312_mcp_api_keys from './20260831_031312_mcp_api_keys';
import * as migration_20260831_214415_approval_provenance from './20260831_214415_approval_provenance';
import * as migration_20260905_012312_service_pillars from './20260905_012312_service_pillars';
import * as migration_20260905_173054_home_page_sections from './20260905_173054_home_page_sections';

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
    name: '20260905_173054_home_page_sections'
  },
];
