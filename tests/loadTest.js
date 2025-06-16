import axios from 'axios';

const JOB_COUNT = 100;
const CONCURRENCY_LIMIT = 20;

const FINAL_STATUSES = new Set(['success', 'retry-success', 'retry-failed']);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForAllJobsToFinish(pollInterval = 1000) {
  let attempts = 0;
  let total = 0;

  while (true) {
    const res = await axios.get('http://localhost:3000/jobs');
    const jobs = res.data;

    total = jobs.length;
    const finished = jobs.filter(j => FINAL_STATUSES.has(j.status)).length;

    process.stdout.write(`\n Finished: ${finished}/${total}   `);

    if (finished === total && total > 0) break;

    await delay(pollInterval);
    attempts++;

    if (attempts > 120) {
      console.warn('\n Timeout waiting for all jobs to finish.');
      break;
    }
  }

  console.log('\n All jobs finished.');
}

async function runLoadTest() {
  console.log(`Creating ${JOB_COUNT} new jobs...`);
  console.time('Load test time');
  let pending = [];

  // clear jobs store
  await axios.delete('http://localhost:3000/jobs');

  for (let i = 0; i < JOB_COUNT; i++) {
    const jobName = `job-${i}`;
    const args = [`arg${i % 3}`, `arg${(i + 1) % 5}`];

    const task = axios.post('http://localhost:3000/jobs', {
      jobName,
      arguments: args
    });

    pending.push(task);

    if (pending.length >= CONCURRENCY_LIMIT) {
      await Promise.allSettled(pending);
      pending = [];
    }
  }

  if (pending.length > 0) {
    await Promise.allSettled(pending);
  }

  await waitForAllJobsToFinish();

  // get jobs status
  const jobsResponse = await axios.get('http://localhost:3000/jobs');
  // get jobs statistics
  const statsResponse = await axios.get('http://localhost:3000/stats');

  console.timeEnd('Load test time');
  console.log(`\nTotal jobs: ${jobsResponse.data.length}`);
  console.log(`Stats:\n`, JSON.stringify(statsResponse.data, null, 2));
}

runLoadTest().catch(console.error);
