import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import jobStore from './jobStore.js';
import { getScriptCommand } from './utils.js';

// Manages job run
class JobManager {

  runJob({ jobName, arguments: args }) {
    console.log('job run', jobName);
    const id = uuidv4();
    const job = {
      id,
      name: jobName,
      args,
      status: 'running',
      retryCount: 0,
      startTime: new Date(),
    };

    jobStore.add(job);
    this.launchProcess(job);
    return id;
  }

  launchProcess(job, isRetry = false) {
    console.log('job launch', job);
    const { command, args, options } = getScriptCommand(job.args);

    const child = spawn(command, args, options );
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.on('exit', (code) => {
      job.exitCode = code;

      job.endTime = new Date();
      job.duration = (job.endTime-job.startTime)/1000;

      if (code === 0) {
        console.log('job success', job);
        job.status = isRetry ? 'retry-success' : 'success';
      } else if (job.retryCount === 0) {
        job.status = 'retried';
        console.log('retry job', job);
        job.retryCount++;
        this.launchProcess(job, true); // Retry once
      } else {
        job.status = 'retry-failed';
        console.log('job failed', job);
      }
      jobStore.update(job);
    });

    child.stdout.on('data', (data) => {
      console.log(`[stdout] ${data.toString()}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`[stderr] ${data.toString()}`);
    });

    child.on('error', (error) => {
      console.error(`Process spawn error: ${error.message}`);
    });


  }
}

const jobManager = new JobManager();
export default jobManager;
