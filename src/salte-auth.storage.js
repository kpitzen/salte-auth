import localforage from 'localforage';

class SalteAuthStorage {
  constructor(type) {
    this.type = type;
    if (type === 'local') {
      this.$storage = localStorage;
    } else if (type === 'session') {
      this.$storage = sessionStorage;
    } else if (type === 'indexeddb') {
      this.$storage = localforage;
    } else {
      throw new ReferenceError(`Unknown Storage Type (${storageType})`);
    }
  }

  set(key, value) {
    if (['local', 'session'].indexOf(this.type) !== -1) {
      if ([undefined, null].indexOf(value) !== -1) {
        this.$storage.removeItem(key);
      } else {
        this.$storage.setItem(key, value);
      }
      return Promise.resolve();
    } else {
      if ([undefined, null].indexOf(value) !== -1) {
        return this.$storage.removeItem(key);
      } else {
        return this.$storage.setItem(key, value);
      }
    }
  }

  get(key) {
    if (['local', 'session'].indexOf(this.type) !== -1) {
      return Promise.resolve(this.$storage.getItem(key));
    } else {
      return this.$storage.getItem(key);
    }
  }

  all() {
    if (['local', 'session'].indexOf(this.type) !== -1) {
      const values = [];
      for (const key in this.$storage) {
        if (!this.$storage.hasOwnProperty(key)) continue;

        values.push({
          key: key,
          value: this.get(key)
        });
      }
      return Promise.resolve(values);
    } else {
      const values = [];
      return this.$storage.iterate((value, key) => {
        values.push({
          key,
          value
        });
      }).then(() => values);
    }
  }
}

export { SalteAuthStorage };
export default SalteAuthStorage;
