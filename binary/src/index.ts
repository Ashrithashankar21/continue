process.env.IS_BINARY = "true";
import { Command } from "commander";
import { Core } from "core/core";
import { FromCoreProtocol, ToCoreProtocol } from "core/protocol";
import { IMessenger } from "core/util/messenger";
import { getCoreLogsPath, getPromptLogsPath } from "core/util/paths";
import { IpcIde } from "./IpcIde";
import { IpcMessenger } from "./IpcMessenger";
import { setupCoreLogging } from "./logging";
import { TcpMessenger } from "./TcpMessenger";
import * as vscode from "vscode";

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

const logFileUri = vscode.Uri.file(getCoreLogsPath());
appendToFile(logFileUri, "[info] Starting Continue core...\n");
const program = new Command();

program.action(async () => {
  try {
    let messenger: IMessenger<ToCoreProtocol, FromCoreProtocol>;
    if (process.env.CONTINUE_DEVELOPMENT === "true") {
      messenger = new TcpMessenger<ToCoreProtocol, FromCoreProtocol>();
      console.log("Waiting for connection");
      await (
        messenger as TcpMessenger<ToCoreProtocol, FromCoreProtocol>
      ).awaitConnection();
      console.log("Connected");
    } else {
      setupCoreLogging();
      // await setupCa();
      messenger = new IpcMessenger<ToCoreProtocol, FromCoreProtocol>();
    }
    const ide = new IpcIde(messenger);
    const promptLogsPath = vscode.Uri.file(getPromptLogsPath());
    const core = new Core(messenger, ide, async (text) => {
      appendToFile(promptLogsPath, text + "\n\n");
    });
    console.log("Core started");
  } catch (e) {
    vscode.workspace.fs.writeFile(
      vscode.Uri.file("./error.log"),
      Buffer.from(`${new Date().toISOString()} ${e}\n`),
    );
    console.log("Error: ", e);
    process.exit(1);
  }
});

program.parse(process.argv);
