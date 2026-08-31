import * as migration_20260831_025813_initial from './20260831_025813_initial';
import * as migration_20260831_031312_mcp_api_keys from './20260831_031312_mcp_api_keys';
import * as migration_20260831_214415_approval_provenance from './20260831_214415_approval_provenance';

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
    name: '20260831_214415_approval_provenance'
  },
];
