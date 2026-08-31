import * as migration_20260831_025813_initial from './20260831_025813_initial';

export const migrations = [
  {
    up: migration_20260831_025813_initial.up,
    down: migration_20260831_025813_initial.down,
    name: '20260831_025813_initial'
  },
];
