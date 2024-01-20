import axios from 'axios';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

// Interface for the changelog entry
interface ChangelogEntry {
  type: string;
  path: string;
  fileType: string;
  changeDate: string;
  description: string;
}

// Function to fetch version number
async function getVersion(): Promise<string> {
  const versionUrl = 'https://local.com/version/project/patch';
  const response = await axios.get(versionUrl);
  return response.data.version;
}

// Function to prompt for logs
async function promptForLogs(changes: any[]): Promise<ChangelogEntry[]> {
  const logs: ChangelogEntry[] = [];
  for (const change of changes) {
    let logType: string;

    if (change.status === 'A') {
      logType = 'add';
    } else if (change.status === 'D') {
      logType = 'delete';
    } else {
      logType = 'change';
    }

    const log = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: `Enter ${logType} log for ${change.path}:`,
      },
    ]);

    logs.push({
      type: logType,
      path: change.path,
      fileType: path.extname(change.path).slice(1),
      changeDate: fs.statSync(change.path).mtime.toISOString(),
      description: log.description,
    });
  }

  return logs;
}

// Function to generate changelog
async function generateChangelog() {
  const commitUrl = process.argv[2];
  const commitDetails = await axios.get(commitUrl);
  const changes = commitDetails.data.files;

  const version = await getVersion();
  const logs = await promptForLogs(changes);

  const changelog = {
    date: new Date().toISOString(),
    version,
    changes: logs,
  };

  fs.writeFileSync('changelog.json', JSON.stringify(changelog, null, 2));
  console.log('Changelog generated successfully.');
}

generateChangelog();
