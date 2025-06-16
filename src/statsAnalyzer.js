export function analyzeStats(jobs) {
  const total = jobs.length;
  const successful = jobs.filter(j => j.status === 'success' || j.status === 'retry-success').length;
  const overallSuccessRate = successful / total;

  const patterns = [];

  function pattern(description, filterFn) {
    const match = jobs.filter(filterFn);
    const matchSuccess = match.filter(j => j.status === 'success' || j.status === 'retry-success').length;
    const rate = match.length > 0 ? matchSuccess / match.length : 0;
    const delta = ((rate - overallSuccessRate) * 100).toFixed(0);

    patterns.push({
      pattern: description,
      matchCount: match.length,
      successRate: +rate.toFixed(2),
      differenceFromAverage: `${delta > 0 ? '+' : ''}${delta}%`
    });
  }

  pattern("Job name length > 5", j => j.name.length > 5);
  pattern("Job name contains 0", j => /0/.test(j.name));
  pattern("Argument count >= 2", j => j.args.length >= 2);
  pattern("Duration < 20 sec", j => j.duration < 20);

  return {
    totalJobs: total,
    overallSuccessRate: +overallSuccessRate.toFixed(2),
    patterns
  };
}
