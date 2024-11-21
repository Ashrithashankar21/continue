import { getCoreLogsPath } from "core/util/paths";
import * as vscode from "vscode";

export function setupCoreLogging() {
  async function appendToFile(uri: vscode.Uri, content: string) {
    try {
      // Read the existing content
      const existingContent = await vscode.workspace.fs.readFile(uri);
      const newContent = Buffer.concat([existingContent, Buffer.from(content)]);

      // Write the appended content back
      await vscode.workspace.fs.writeFile(uri, newContent);
    } catch (error) {
      console.error("Error appending to file:", error);
    }
  }

  const logger = (message: any, ...optionalParams: any[]) => {
    const logFilePath = vscode.Uri.file(getCoreLogsPath());
    const timestamp = new Date().toISOString().split(".")[0];
    const logMessage = `[${timestamp}] ${message} ${optionalParams.join(" ")}\n`;
    appendToFile(logFilePath, logMessage);
  };
  console.log = logger;
  console.error = logger;
  console.warn = logger;
  console.debug = logger;
  console.log("[info] Starting Continue core...");
}
