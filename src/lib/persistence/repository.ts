import type { ScenarioInput } from '@/lib/validation/scenario';
import type { UserPreferences } from '@/lib/validation/settings';

import { idbGet, idbSet } from './idb';

const SCENARIOS_KEY = 'scenarios';
const SETTINGS_KEY = 'settings';

export interface ScenarioEntity extends ScenarioInput {
    id: string;
}

export class ScenarioRepository {
    static async list(): Promise<ScenarioEntity[]> {
        return (await idbGet<ScenarioEntity[]>(SCENARIOS_KEY)) ?? [];
    }

    static async getById(id: string): Promise<ScenarioEntity | null> {
        const all = await ScenarioRepository.list();
        return all.find((s) => s.id === id) ?? null;
    }

    static async upsert(scenario: ScenarioEntity): Promise<void> {
        const all = await ScenarioRepository.list();
        const idx = all.findIndex((s) => s.id === scenario.id);
        if (idx >= 0) all[idx] = scenario;
        else all.push(scenario);
        await idbSet(SCENARIOS_KEY, all);
    }

    static async remove(id: string): Promise<void> {
        const all = await ScenarioRepository.list();
        const next = all.filter((s) => s.id !== id);
        await idbSet(SCENARIOS_KEY, next);
    }
}

export class PreferencesRepository {
    static async get(): Promise<UserPreferences | null> {
        return await idbGet<UserPreferences>(SETTINGS_KEY);
    }
    static async set(prefs: UserPreferences): Promise<void> {
        await idbSet(SETTINGS_KEY, prefs);
    }
}
