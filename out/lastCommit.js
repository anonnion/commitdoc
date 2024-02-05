"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function getLastCommitUrl() {
    var _a;
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.uri.scheme === 'file') {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (gitExtension) {
            const gitApi = gitExtension.exports.getAPI(1);
            if (gitApi.repositories.length > 0) {
                const repository = gitApi.repositories[0];
                const lastCommitHash = (_a = repository.state.HEAD) === null || _a === void 0 ? void 0 : _a.commit;
                if (lastCommitHash) {
                    return repository.resolveReference(lastCommitHash).then((commit) => {
                        var _a;
                        return (_a = commit.committerDate) === null || _a === void 0 ? void 0 : _a.toISOString();
                    });
                }
            }
        }
    }
    return Promise.resolve(undefined);
}
getLastCommitUrl().then((commitUrl) => {
    if (commitUrl) {
        console.log(commitUrl);
        // You can use the commitUrl as needed.
    }
    else {
        console.log('Unable to retrieve last commit URL.');
    }
});
