import {database} from '../firebase'

const db = database.ref().child("jobs");

class JobsDataService {
  getAll() {
    return db;
  }

  create(jobs) {
    return db.push().set(jobs);
  }

  fetch(key) {
    return db.child(key);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new JobsDataService();
