class IndexedDbHandler {
  static #DATABASE_NAME = 'hot-drinks-db';
  static #DATABASE_VERSION = 3;
  static #OBJECT_STORE_SCHEMAS = [
    {
      name: 'drinks',
      indexes: ['name']
    }
  ];

  static #instance;

  #db;
  #objectStoreMap = {};
  #scheduledJobs = [];

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new IndexedDbHandler();
    }
    return this.#instance;
  }

  constructor() {
    const request = window.indexedDB.open(IndexedDbHandler.#DATABASE_NAME, IndexedDbHandler.#DATABASE_VERSION);

    request.onsuccess = () => {
      this.#db = request.result;
      this.#scheduledJobs.forEach(job => job(this.#db));
    };

    request.onupgradeneeded = () => {
      this.#db = request.result;
      IndexedDbHandler.#OBJECT_STORE_SCHEMAS.forEach(schema => {
        this.#loadObjectStore(schema);
      });
      request.transaction.oncomplete = () => {
        this.#scheduledJobs.forEach(job => job(this.#db));
      };
    };
  }

  #loadObjectStore(schema) {
    const objectStore = this.#db.createObjectStore(schema.name, { autoIncrement: true });
    this.#objectStoreMap[schema.name] = objectStore;

    schema.indexes.forEach(indexName => {
      objectStore.createIndex(indexName, indexName, { unique: false });
    });
  }

  #scheduleJob(job) {
    if (this.#db) {
      job(this.#db);
    } else {
      this.#scheduledJobs.push(job);
    }
  }

  addObjectsToStore(objectStoreName, objects) {
    return new rxjs.Observable(subscriber => {
      this.#scheduleJob(db => {
        const transaction = db.transaction([objectStoreName], 'readwrite');

        transaction.oncomplete = () => {
          subscriber.next(objects);
          subscriber.complete();
        };
        transaction.onerror = error => subscriber.error(error);

        const objectStore = transaction.objectStore(objectStoreName);
        objects.forEach(newObject => {
          objectStore.add(newObject);
        });
      });
    });
  }

  listObjectStore(objectStoreName) {
    return new rxjs.Observable(subscriber => {
      this.#scheduleJob(db => {
        const objectStore = db.transaction(objectStoreName).objectStore(objectStoreName);

        objectStore.getAll().onsuccess = event => {
          subscriber.next(event.target.result);
          subscriber.complete();
        };
      });
    });
  }

  updateObjectInStore(objectStoreName, object, index) {
    return new rxjs.Observable(subscriber => {
      this.#scheduleJob(db => {
        const transaction = db.transaction([objectStoreName], 'readwrite');

        transaction.oncomplete = () => {
          subscriber.next(object);
          subscriber.complete();
        };
        transaction.onerror = error => subscriber.error(error);

        const objectStore = transaction.objectStore(objectStoreName);
        objectStore.put(object, index + 1);
      });
    });
  }

  deleteObjectInStore(objectStoreName, index) {
    return new rxjs.Observable(subscriber => {
      this.#scheduleJob(db => {
        const transaction = db.transaction([objectStoreName], 'readwrite');

        transaction.oncomplete = () => {
          subscriber.next(index);
          subscriber.complete();
        };
        transaction.onerror = error => subscriber.error(error);

        const objectStore = transaction.objectStore(objectStoreName);
        objectStore.delete(index);
      });
    });
  }

  getPrimaryKeyForObject(objectStoreName, indexName, objectIndex) {
    return new rxjs.Observable(subscriber => {
      this.#scheduleJob(db => {
        const transaction = db.transaction([objectStoreName], 'readonly');

        const objectStore = transaction.objectStore(objectStoreName);
        const index = objectStore.index(indexName);
        const request = index.openCursor();

        request.onsuccess = event => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.key === objectIndex) {
              subscriber.next(cursor.primaryKey);
              subscriber.complete();
            } else {
              cursor.continue();
            }
          } else {
            subscriber.next(-1);
            subscriber.complete();
          }
        };
        request.onerror = error => subscriber.error(error);
      });
    });
  }
}
