import path from "path";

import * as vscode from "vscode";

export default async function () {
  process.env.CONTINUE_GLOBAL_DIR = path.join(__dirname, ".continue-test");
  try {
    const dirPath = process.env.CONTINUE_GLOBAL_DIR;
    if (dirPath && (await vscode.workspace.fs.stat(vscode.Uri.file(dirPath)))) {
      await vscode.workspace.fs.delete(vscode.Uri.file(dirPath), {
        recursive: true,
        useTrash: false,
      });
    }
  } catch (error) {
    console.error("Failed to delete directory:", error);
  }
}
