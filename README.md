
# Job Service Simulation

A lightweight Node.js-based backend for launching, monitoring, and analyzing concurrent native job executions (e.g., C++ batch scripts). The service exposes a REST API to manage jobs and provides basic statistical insights into job success patterns.

---

## Features

- Start and monitor multiple concurrent native jobs (e.g., `.bat` or `.sh`)
- Automatically retry failed jobs once
- Track job status, watchdog-style monitoring to detect unexpected exits
- In-memory job state storage
- REST API for job control and stats analysis

---

## Installation

```bash
git clone https://github.com/virtax/job-service-simulation
cd job-service-simulation
npm install
```

## Run

```bash
npm start
```
This starts the service at: http://localhost:3000

## Test

```bash
npm test
```

This script:

Creates 100 jobs via the API
Periodically polls /jobs until all jobs have stopped
Retrieves /stats to analyze job behavior

Example Output:
```bash
Creating 100 new jobs...

 Finished: 0/100
 Finished: 0/100
 Finished: 48/100
 Finished: 49/100
 Finished: 99/100
 Finished: 100/100
 All jobs finished.
Load test time: 5.724s

Total jobs: 100
Stats:
 {
  "totalJobs": 100,
  "overallSuccessRate": 0.73,
  "patterns": [
    {
      "pattern": "Job name length > 5",
      "matchCount": 90,
      "successRate": 0.73,
      "differenceFromAverage": "0%"
    },
    {
      "pattern": "Job name contains 0",
      "matchCount": 10,
      "successRate": 0.7,
      "differenceFromAverage": "-3%"
    },
    {
      "pattern": "Argument count >= 2",
      "matchCount": 100,
      "successRate": 0.73,
      "differenceFromAverage": "0%"
    },
    {
      "pattern": "Duration < 20 sec",
      "matchCount": 100,
      "successRate": 0.73,
      "differenceFromAverage": "0%"
    }
  ]
}
```
## API Endpoints

# POST /jobs
Start a new job.

Request Body:
```json
{
  "jobName": "my-task-42",
  "arguments": ["arg1", "arg2"]
}
```
# GET /jobs
List all submitted jobs and their current statuses.

Example Response:
```json
[
  {
    "id": "abc123",
    "jobName": "my-task-42",
    "status": "completed",
    "retry": false,
    "exitCode": 0
  }
]
```
# GET /stats
Returns statistical insights into job behavior, including correlations between job characteristics and success rates.

Example Response:
```json
{
  "totalJobs": 100,
  "overallSuccessRate": 0.68,
  "patterns": [
    {
      "pattern": "Job name length > 5",
      "matchCount": 90,
      "successRate": 0.73,
      "differenceFromAverage": "0%"
    },
    {
      "pattern": "Job name contains 0",
      "matchCount": 10,
      "successRate": 0.7,
      "differenceFromAverage": "-3%"
    }
  ]
}
```