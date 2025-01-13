let listenerId = 0;

export function atom(value = {}, methods = {}) {
		const instance = new StatefulAtom(value);
		Object.assign(instance, methods);
		return instance;
}

export class StatefulAtom {
		constructor(value = {}) {
				this.value = value;
				this.listeners = {};
		}

		get() {
				return this.value;
		}

		bindListener(listener, fire_at_start = false) {
				listener._listenerId = listener._listenerId || ++listenerId;
				this.listeners[listener._listenerId] = listener;
				if (fire_at_start) {
						listener(this.value, this);
				}
		}

		unbindListener(listener) {
				this.listeners[listener._listenerId] = null;
				delete this.listeners[listener._listenerId];
		}

		notifyListeners() {
				for (let id in this.listeners) {
						this.listeners[id](this.value, this);
				}
		}

		set(value, notify = true) {
				this.value = value;
				if (notify) {
						this.notifyListeners();
				}
		}
}
