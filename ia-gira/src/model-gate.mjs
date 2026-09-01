export class ModelGate {
	constructor({ concurrency = 1, maxQueue = 4, waitMs = 1500 } = {}) {
		this.concurrency = Math.max(1, concurrency);
		this.maxQueue = Math.max(0, maxQueue);
		this.waitMs = Math.max(0, waitMs);
		this.active = 0;
		this.queue = [];
	}

	async acquire() {
		if (this.active < this.concurrency) {
			this.active += 1;
			return this.#releaseOnce();
		}
		if (this.queue.length >= this.maxQueue || this.waitMs === 0) return null;

		return new Promise((resolve) => {
			const entry = { resolve, timer: null };
			entry.timer = setTimeout(() => {
				const index = this.queue.indexOf(entry);
				if (index !== -1) this.queue.splice(index, 1);
				resolve(null);
			}, this.waitMs);
			this.queue.push(entry);
		});
	}

	#releaseOnce() {
		let released = false;
		return () => {
			if (released) return;
			released = true;
			const next = this.queue.shift();
			if (next) {
				clearTimeout(next.timer);
				next.resolve(this.#releaseOnce());
				return;
			}
			this.active -= 1;
		};
	}

	status() {
		return { active: this.active, queued: this.queue.length };
	}
}
