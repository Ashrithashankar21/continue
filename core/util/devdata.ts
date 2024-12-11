import * as vscode from "vscode";

import { getDevDataFilePath } from "./paths.js";

export async function logDevData(tableName: string, data: any) {
  const filepath: string = getDevDataFilePath(tableName);
  const jsonLine = JSON.stringify(data);
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(filepath),
    new TextEncoder().encode(`${jsonLine}\n`),
  );
}
