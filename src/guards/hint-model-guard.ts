import { store } from '../models/store';

export function hintModelGuard(): boolean {
    return !!store.game.hint;
}
