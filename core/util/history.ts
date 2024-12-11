import * as vscode from "vscode";

import { PersistedSessionInfo, SessionInfo } from "../index.js";
import { ListHistoryOptions } from "../protocol/core.js";

import { getSessionFilePath, getSessionsListPath } from "./paths";

function safeParseArray<T>(
  value: string,
  errorMessage: string = "Error parsing array",
): T[] | undefined {
  try {
    return JSON.parse(value) as T[];
  } catch (e: any) {
    console.warn(`${errorMessage}: ${e}`);
    return undefined;
  }
}

class HistoryManager {
  list(options: ListHistoryOptions): SessionInfo[] {
    const filepath = getSessionsListPath();
    if (
      !vscode.workspace.fs
        .stat(vscode.Uri.file(filepath.toString()))
        .then(() => true)
    ) {
      return [];
    }
    const content = vscode.workspace.fs.readFile(
      vscode.Uri.file(filepath.toString()),
    );

    let sessions = safeParseArray<SessionInfo>(content.toString()) ?? [];
    sessions = sessions.filter((session: any) => {
      // Filter out old format
      return typeof session.session_id !== "string";
    });

    // Apply limit and offset
    if (options.limit) {
      const offset = options.offset || 0;
      sessions = sessions.slice(offset, offset + options.limit);
    }

    return sessions;
  }

  async delete(sessionId: string) {
    // Delete a session
    const sessionFile = getSessionFilePath(sessionId);
    if (
      !vscode.workspace.fs.stat(vscode.Uri.file(sessionFile)).then(() => true)
    ) {
      throw new Error(`Session file ${sessionFile} does not exist`);
    }
    await vscode.workspace.fs.delete(vscode.Uri.file(sessionFile));
    // Read and update the sessions list
    const sessionsListFile = getSessionsListPath();
    const sessionsListRaw = vscode.workspace.fs.readFile(
      vscode.Uri.file(sessionsListFile.toString()),
    );
    let sessionsList =
      safeParseArray<SessionInfo>(
        sessionsListRaw.toString(),
        "Error parsing sessions.json",
      ) ?? [];

    sessionsList = sessionsList.filter(
      (session) => session.sessionId !== sessionId,
    );

    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(sessionsListFile.toString()),
      new TextEncoder().encode(JSON.stringify(sessionsList, undefined, 2)),
    );
  }

  load(sessionId: string): PersistedSessionInfo {
    try {
      const sessionFile = getSessionFilePath(sessionId);
      if (
        !vscode.workspace.fs.stat(vscode.Uri.file(sessionFile)).then(() => true)
      ) {
        throw new Error(`Session file ${sessionFile} does not exist`);
      }
      const session: PersistedSessionInfo = JSON.parse(
        vscode.workspace.fs.readFile(vscode.Uri.file(sessionFile)).toString(),
      );
      session.sessionId = sessionId;
      return session;
    } catch (e) {
      console.log(`Error loading session: ${e}`);
      return {
        history: [],
        title: "Failed to load session",
        workspaceDirectory: "",
        sessionId: sessionId,
      };
    }
  }

  async save(session: PersistedSessionInfo) {
    // Save the main session json file
    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(getSessionFilePath(session.sessionId)),
      new TextEncoder().encode(JSON.stringify(session, undefined, 2)),
    );

    // Read and update the sessions list
    const sessionsListFilePath = getSessionsListPath();
    try {
      const rawSessionsList = vscode.workspace.fs.readFile(
        vscode.Uri.file(sessionsListFilePath.toString()),
      );

      let sessionsList: SessionInfo[];
      try {
        sessionsList = JSON.parse(rawSessionsList.toString());
      } catch (e) {
        if (rawSessionsList.toString().trim() === "") {
          await vscode.workspace.fs.writeFile(
            vscode.Uri.file(sessionsListFilePath.toString()),
            new TextEncoder().encode(JSON.stringify([])),
          );
          sessionsList = [];
        } else {
          throw e;
        }
      }

      let found = false;
      for (const sessionInfo of sessionsList) {
        if (sessionInfo.sessionId === session.sessionId) {
          sessionInfo.title = session.title;
          sessionInfo.workspaceDirectory = session.workspaceDirectory;
          found = true;
          break;
        }
      }

      if (!found) {
        const sessionInfo: SessionInfo = {
          sessionId: session.sessionId,
          title: session.title,
          dateCreated: String(Date.now()),
          workspaceDirectory: session.workspaceDirectory,
        };
        sessionsList.push(sessionInfo);
      }

      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(sessionsListFilePath.toString()),
        new TextEncoder().encode(JSON.stringify(sessionsList, undefined, 2)),
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `It looks like there is a JSON formatting error in your sessions.json file (${sessionsListFilePath}). Please fix this before creating a new session.`,
        );
      }
      throw new Error(
        `It looks like there is a validation error in your sessions.json file (${sessionsListFilePath}). Please fix this before creating a new session. Error: ${error}`,
      );
    }
  }
}

const historyManager = new HistoryManager();

export default historyManager;
