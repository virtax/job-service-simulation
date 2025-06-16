import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import jobManager from './jobManager.js';
import jobStore from './jobStore.js';
import { analyzeStats } from './statsAnalyzer.js';

const app = express();
const PORT = 3000;

// HTTP logger
app.use(morgan('dev'));
app.use(bodyParser.json());

app.post('/jobs', (req, res) => {
  const { jobName, arguments: args } = req.body;
  const id = jobManager.runJob({ jobName, arguments: args });
  res.status(201).json({ jobId: id });
});

app.get('/jobs', (req, res) => {
  res.json(jobStore.getAll());
});

app.get('/stats', (req, res) => {
  const jobs = jobStore.getAll();
  const stats = analyzeStats(jobs);
  res.json(stats);
});

// clear jobs store
app.delete('/jobs', (req, res) => {
  const jobs = jobStore.clear();
  res.sendStatus(204);
});


app.listen(PORT, () => {
  console.log(`Job service listening on http://localhost:${PORT}`);
});
