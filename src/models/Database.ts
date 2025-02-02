import type { APISearch } from "./APISearch";

export class Database {
    id: string;
    size: number;
    apisearch: Map<string, APISearch>;

    constructor(id: string) {
        this.id = id;
        this.size = 0;
        this.apisearch = new Map<string, APISearch>();
    }

    get<T>(key: string): T | null {
        return this.apisearch.get(key) as T || null;
    }

    set(key: string, value: APISearch): void {
        this.apisearch.set(key, value);
        this.size++;
    }

    delete(key: string): boolean {
        this.size--;
        return this.apisearch.delete(key);
    }

    getAll(): Map<string, APISearch> {
        return this.apisearch;
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
            apisearch: Array.from(this.apisearch.entries()),
            size: this.size
        });
    }
} 