export class TupleSet {
    private data: Map<number, Set<number>>;

    constructor() {
        this.data = new Map();
    }

    add([first, second]: number[]): this {
        if (!this.data.has(first)) {
            this.data.set(first, new Set<number>());
        }
        this.data.get(first)!.add(second);
        return this;
    }

    has([first, second]: number[]): boolean {
        return (
            this.data.has(first) &&
            this.data.get(first)!.has(second)
        );
    }

    delete([first, second]: any): boolean {
        if (!this.data.has(first) || !this.data.get(first)!.has(second)) {
            return false;
        }

        this.data.get(first)!.delete(second);
        if (this.data.get(first)!.size === 0) {
            this.data.delete(first);
        }

        return true;
    }
}
