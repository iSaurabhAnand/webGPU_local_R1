// Web Worker for heavy computations (optional)
export class Worker {
    static instance = null;
    
    static async getInstance() {
        if (!this.instance) {
            this.instance = new Worker(new URL('./worker.js', import.meta.url));
        }
        return this.instance;
    }
}
