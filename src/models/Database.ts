import type { APISearch } from "./APISearch";

export class Database {
    id: string;
    apisearch: Map<string, APISearch>;

    constructor(id: string) {
        this.id = id;
        this.apisearch = new Map<string, APISearch>();
    }

    get<T>(key: string): T | null {
        return this.apisearch.get(key) as T || null;
    }

    set(key: string, value: APISearch): void {
        this.apisearch.set(key, value);
    }

    delete(key: string): boolean {
        return this.apisearch.delete(key);
    }

    getAll(): Map<string, APISearch> {
        return this.apisearch;
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
            apisearch: Array.from(this.apisearch.entries())
        });
    }
} 