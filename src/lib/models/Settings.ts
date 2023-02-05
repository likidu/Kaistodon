import type { BaseSettings } from '@/ui/models';

export type Settings = BaseSettings & { instance: string; showSensitive: boolean };
