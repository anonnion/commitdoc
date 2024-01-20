import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.showLastCommit', () => {
        // Retrieve the last commit URL logic here
        const lastCommitUrl = "https://github.com/your-username/your-repo/commit/your-commit-hash";

        // Display the last commit URL in a WebView
        showWebView(context.extensionUri, lastCommitUrl);
    });

    context.subscriptions.push(disposable);
}

function showWebView(extensionUri: vscode.Uri, lastCommitUrl: string) {
    const panel = vscode.window.createWebviewPanel(
        'lastCommitViewer',
        'Last Commit Viewer',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        }
    );

    // Read and inject the HTML content
    const htmlContent = getWebViewContent(lastCommitUrl);
    panel.webview.html = htmlContent;
}

function getWebViewContent(lastCommitUrl: string): string {
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
