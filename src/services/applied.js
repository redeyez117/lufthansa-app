import {database} from '../firebase'

const db = database.ref().child("appliedJobs");

class AppliedJobsService {
  getAll() {
    return db;
  }

  create(appliedJobData) {
    return db.push().set(appliedJobData);
  }

  fetch(key) {
    return db.child(key);
  }

  jobApplicants(jobId) {
    return db.orderByChild('job_id').equalTo(jobId);
  }

  fetchJobApplications(userId) {
    return db.orderByChild('user_id').equalTo(userId)
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }
}

export default new AppliedJobsService();
