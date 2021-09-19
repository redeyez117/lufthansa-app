import {database} from '../firebase'

const db = database.ref().child("favouriteJobs");

class FavouriteJobsService {
  getAll() {
    return db;
  }

  create(favouriteJobData) {
    return db.push().set(favouriteJobData);
  }

  fetch(key) {
    return db.child(key);
  }

  jobFavourites(jobId) {
    return db.orderByChild('job_id').equalTo(jobId);
  }

  fetchJobFavourites(userId) {
    return db.orderByChild('user_id').equalTo(userId)
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }
}

export default new FavouriteJobsService();
