import * as migration_20260831_024620_initial from './20260831_024620_initial';

export const migrations = [
  {
    up: migration_20260831_024620_initial.up,
    down: migration_20260831_024620_initial.down,
    name: '20260831_024620_initial'
  },
];
