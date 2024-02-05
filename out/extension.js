"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.showLastCommit', () => {
        // Retrieve the last commit URL logic here
        const lastCommitUrl = "https://github.com/your-username/your-repo/commit/your-commit-hash";
        console.log("Extension activated.");
        // Display the last commit URL in a WebView
        showWebView(context, lastCommitUrl);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function showWebView(context, lastCommitUrl) {
    const extensionPath = context.extensionPath;
    const panel = vscode.window.createWebviewPanel('lastCommitViewer', 'Last Commit Viewer', vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(extensionPath + '/media')]
    });
    // Read and inject the HTML content
    const htmlContent = getWebViewContent(lastCommitUrl);
    panel.webview.html = htmlContent;
}
function getWebViewContent(lastCommitUrl) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Last Commit Viewer</title>
            <style>
                /* Your CSS styles here */
            </style>
        </head>
        <body>
            <h1>Last Commit URL</h1>
            <p>${lastCommitUrl}</p>

            <script>
                // Your JavaScript logic here
            </script>
        </body>
        </html>
    `;
}
