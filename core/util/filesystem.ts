import * as path from "node:path";

import * as vscode from "vscode";

import {
  ContinueRcJson,
  FileType,
  IDE,
  IdeInfo,
  IdeSettings,
  IndexTag,
  Location,
  Problem,
  Range,
  RangeInFile,
  Thread,
  ToastType,
} from "../index.d.js";
import { GetGhTokenArgs } from "../protocol/ide.js";

import { getContinueGlobalPath } from "./paths.js";

class FileSystemIde implements IDE {
  constructor(private readonly workspaceDir: string) {}
  showToast(
    type: ToastType,
    message: string,
    ...otherParams: any[]
  ): Promise<void> {
    return Promise.resolve();
  }
  pathSep(): Promise<string> {
    return Promise.resolve(path.sep);
  }
  async fileExists(filepath: string): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(filepath));
      return true;
    } catch {
      return false;
    }
  }

  gotoDefinition(location: Location): Promise<RangeInFile[]> {
    return Promise.resolve([]);
  }
  onDidChangeActiveTextEditor(callback: (filepath: string) => void): void {
    return;
  }

  async getIdeSettings(): Promise<IdeSettings> {
    return {
      remoteConfigServerUrl: undefined,
      remoteConfigSyncPeriod: 60,
      userToken: "",
      enableControlServerBeta: false,
      pauseCodebaseIndexOnStart: false,
      enableDebugLogs: false,
    };
  }
  async getGitHubAuthToken(args: GetGhTokenArgs): Promise<string | undefined> {
    return undefined;
  }
  async getLastModified(files: string[]): Promise<{ [path: string]: number }> {
    const result: { [path: string]: number } = {};
    for (const file of files) {
      try {
        const stats = await vscode.workspace.fs.stat(vscode.Uri.file(file));
        result[file] = stats.mtime;
      } catch (error) {
        console.error(`Error getting last modified time for ${file}:`, error);
      }
    }
    return result;
  }
  getGitRootPath(dir: string): Promise<string | undefined> {
    return Promise.resolve(dir);
  }
  async listDir(dir: string): Promise<[string, FileType][]> {
    const entries = await vscode.workspace.fs.readDirectory(
      vscode.Uri.file(dir),
    );
    const all: [string, FileType][] = entries.map(
      ([name, type]: [string, vscode.FileType]) => [
        name,
        type === vscode.FileType.Directory
          ? FileType.Directory
          : type === vscode.FileType.SymbolicLink
            ? FileType.SymbolicLink
            : FileType.File,
      ],
    );
    return Promise.resolve(all);
  }

  getRepoName(dir: string): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  async getTags(artifactId: string): Promise<IndexTag[]> {
    const directory = (await this.getWorkspaceDirs())[0];
    return [
      {
        artifactId,
        branch: await this.getBranch(directory),
        directory,
      },
    ];
  }

  getIdeInfo(): Promise<IdeInfo> {
    return Promise.resolve({
      ideType: "vscode",
      name: "na",
      version: "0.1",
      remoteName: "na",
      extensionVersion: "na",
    });
  }

  readRangeInFile(filepath: string, range: Range): Promise<string> {
    return Promise.resolve("");
  }

  isTelemetryEnabled(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getUniqueId(): Promise<string> {
    return Promise.resolve("NOT_UNIQUE");
  }

  getWorkspaceConfigs(): Promise<ContinueRcJson[]> {
    return Promise.resolve([]);
  }

  getDiff(includeUnstaged: boolean): Promise<string> {
    return Promise.resolve("");
  }

  getTerminalContents(): Promise<string> {
    return Promise.resolve("");
  }

  async getDebugLocals(threadIndex: number): Promise<string> {
    return Promise.resolve("");
  }

  async getTopLevelCallStackSources(
    threadIndex: number,
    stackDepth: number,
  ): Promise<string[]> {
    return Promise.resolve([]);
  }

  async getAvailableThreads(): Promise<Thread[]> {
    return Promise.resolve([]);
  }

  showLines(
    filepath: string,
    startLine: number,
    endLine: number,
  ): Promise<void> {
    return Promise.resolve();
  }

  getWorkspaceDirs(): Promise<string[]> {
    return Promise.resolve([this.workspaceDir]);
  }

  listFolders(): Promise<string[]> {
    return Promise.resolve([]);
  }

  async writeFile(path: string, contents: string): Promise<void> {
    return vscode.workspace.fs.writeFile(
      vscode.Uri.file(path),
      new TextEncoder().encode(contents),
    );
  }

  showVirtualFile(title: string, contents: string): Promise<void> {
    return Promise.resolve();
  }

  getContinueDir(): Promise<any> {
    return Promise.resolve(getContinueGlobalPath());
  }

  openFile(path: string): Promise<void> {
    return Promise.resolve();
  }

  runCommand(command: string): Promise<void> {
    return Promise.resolve();
  }

  saveFile(filepath: string): Promise<void> {
    return Promise.resolve();
  }

  readFile(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      vscode.workspace.fs.readFile(vscode.Uri.file(filepath)).then(
        (contents) => resolve(new TextDecoder("utf-8").decode(contents)),
        (err) => reject(err),
      );
    });
  }

  getCurrentFile(): Promise<undefined> {
    return Promise.resolve(undefined);
  }

  showDiff(
    filepath: string,
    newContents: string,
    stepIndex: number,
  ): Promise<void> {
    return Promise.resolve();
  }

  getBranch(dir: string): Promise<string> {
    return Promise.resolve("");
  }

  getOpenFiles(): Promise<string[]> {
    return Promise.resolve([]);
  }

  getPinnedFiles(): Promise<string[]> {
    return Promise.resolve([]);
  }

  async getSearchResults(query: string): Promise<string> {
    return "";
  }

  async getProblems(filepath?: string | undefined): Promise<Problem[]> {
    return Promise.resolve([]);
  }

  async subprocess(command: string, cwd?: string): Promise<[string, string]> {
    return ["", ""];
  }
}

export default FileSystemIde;
