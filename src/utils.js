import os from 'os';

export function getScriptCommand(args) {
  const isWindows = os.platform() === 'win32';

  if (isWindows) {
    const command = 'cmd.exe';
    const commandArgs = ['/c', 'job.bat', ...args];
    return {
      command,
      args: commandArgs,
      options: {
        cwd: './jobs',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    };
  } else {
    return {
      command: 'bash',
      args: ['jobs/job.sh', ...args],
      options: { stdio: ['ignore', 'pipe', 'pipe'] }
    };
  }
}


