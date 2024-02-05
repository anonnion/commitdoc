"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const inquirer_1 = require("inquirer");
const fs = require("fs");
const path = require("path");
// Function to fetch version number
function getVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const versionUrl = 'https://local.com/version/project/patch';
        const response = yield axios_1.default.get(versionUrl);
        return response.data.version;
    });
}
// Function to prompt for logs
function promptForLogs(changes) {
    return __awaiter(this, void 0, void 0, function* () {
        const logs = [];
        for (const change of changes) {
            let logType;
            if (change.status === 'A') {
                logType = 'add';
            }
            else if (change.status === 'D') {
                logType = 'delete';
            }
            else {
                logType = 'change';
            }
            const log = yield inquirer_1.default.prompt([
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
    });
}
// Function to generate changelog
function generateChangelog() {
    return __awaiter(this, void 0, void 0, function* () {
        const commitUrl = process.argv[2];
        const commitDetails = yield axios_1.default.get(commitUrl);
        const changes = commitDetails.data.files;
        const version = yield getVersion();
        const logs = yield promptForLogs(changes);
        const changelog = {
            date: new Date().toISOString(),
            version,
            changes: logs,
        };
        fs.writeFileSync('changelog.json', JSON.stringify(changelog, null, 2));
        console.log('Changelog generated successfully.');
    });
}
generateChangelog();
