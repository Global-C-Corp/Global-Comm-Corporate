import * as migration_20260831_025813_initial from './20260831_025813_initial';
import * as migration_20260831_031312_mcp_api_keys from './20260831_031312_mcp_api_keys';

export const migrations = [
  {
    up: migration_20260831_025813_initial.up,
    down: migration_20260831_025813_initial.down,
    name: '20260831_025813_initial',
  },
  {
    up: migration_20260831_031312_mcp_api_keys.up,
    down: migration_20260831_031312_mcp_api_keys.down,
    name: '20260831_031312_mcp_api_keys'
  },
];
