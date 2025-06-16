// Store jobs
class JobStore {
  constructor() {
    this.jobs = new Map();
  }

  add(job) {
    this.jobs.set(job.id, job);
  }

  update(job) {
    if (!this.jobs.has(job.id)) {
      throw new Error(`Job with ID ${job.id} does not exist.`);
    }
    this.jobs.set(job.id, job);
  }

  getAll() {
    return Array.from(this.jobs.values());
  }

  getById(id) {
    return this.jobs.get(id);
  }

  clear() {
    this.jobs.clear();
  }

}

const jobStore = new JobStore();
export default jobStore;
