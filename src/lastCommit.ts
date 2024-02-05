import * as vscode from 'vscode';

function getLastCommitUrl(): Thenable<string | undefined> {
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.uri.scheme === 'file') {
    const gitExtension = vscode.extensions.getExtension('vscode.git');
    if (gitExtension) {
      const gitApi = gitExtension.exports.getAPI(1);

      if (gitApi.repositories.length > 0) {
        const repository = gitApi.repositories[0];
        const lastCommitHash = repository.state.HEAD?.commit;

        if (lastCommitHash) {
          return repository.resolveReference(lastCommitHash).then((commit: any) => {
            return commit.committerDate?.toISOString();
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
  } else {
    console.log('Unable to retrieve last commit URL.');
  }
});
