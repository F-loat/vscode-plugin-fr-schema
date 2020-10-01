/**
 * schema editor
 */

import * as vscode from 'vscode';

export class frSchemaEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new frSchemaEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      frSchemaEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
          enableFindWidget: true,
        },
      },
    );
    return providerRegistration;
  }

  private static readonly viewType = 'frSchema.editor';

  private innerUpdateCount = 2;

  constructor(
    private readonly context: vscode.ExtensionContext,
  ) { }

  /**
   * Called when our custom editor is opened.
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: 'update',
        body: document.getText(),
      });
    }

    // Hook up event handlers so that we can synchronize the webview with the text document.
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() !== document.uri.toString()) {
        return
      }
      if (this.innerUpdateCount < 2) {
        this.innerUpdateCount += 1
        return
      }
      if (this.innerUpdateCount >= 2 && e.contentChanges.length) {
        updateWebview();
      }
    });

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(async ({ type, body}) => {
      switch (type) {
        case 'init':
          updateWebview();
          break;
        case 'update':
          this.innerUpdateCount = 0
          this.updateTextDocument(document, body);
          break;
        case 'close':
          await this.updateTextDocument(document, body);
          await document.save();
          vscode.commands.executeCommand('vscode.openWith', document.uri, 'default');
          break;
        case 'warning':
          vscode.window.showWarningMessage(body);
          break;
        case 'error':
          vscode.window.showErrorMessage(body);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Get the static html used for the editor webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    const baseUri = `${webview.asWebviewUri(vscode.Uri.file(this.context.extensionPath))}/out/webview`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="${baseUri}/umi.css">
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
          <title>FormRender generator</title>
          <script>
            window.routerBase = location.pathname.split('/').slice(0, -1).concat('').join('/');
            window.publicPath = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + window.routerBase;
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script src="${baseUri}/umi.js"></script>
        </body>
      </html>`;
  }

  /**
   * Write out the json string to a given document.
   */
  private updateTextDocument(document: vscode.TextDocument, jsonStr?: string) {
    if (jsonStr === undefined) return

    const edit = new vscode.WorkspaceEdit();

    // Just replace the entire document every time.
    // TODO: compute minimal edits instead.
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      `${jsonStr}\n`,
    );

    return vscode.workspace.applyEdit(edit);
  }
}
