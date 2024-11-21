import * as vscode from "vscode";

import { EmbeddingsProvider } from "../";

import { getGlobalContextFilePath } from "./paths";

export type GlobalContextType = {
  indexingPaused: boolean;
  selectedTabAutocompleteModel: string;
  lastSelectedProfileForWorkspace: { [workspaceIdentifier: string]: string };
  /**
   * This is needed to handle the case where a JetBrains user has created
   * docs embeddings using one provider, and then updates to a new provider.
   *
   * For VS Code users, it is unnecessary since we use transformers.js by default.
   */
  curEmbeddingsProviderId: EmbeddingsProvider["id"];
  hasDismissedConfigTsNoticeJetBrains: boolean;
  hasAlreadyCreatedAPromptFile: boolean;
};

/**
 * A way to persist global state
 */
export class GlobalContext {
  async update<T extends keyof GlobalContextType>(
    key: T,
    value: GlobalContextType[T],
  ) {
    if (!vscode.workspace.fs.stat(vscode.Uri.file(getGlobalContextFilePath())).then(() => true)) {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(getGlobalContextFilePath()),
        new TextEncoder().encode(JSON.stringify(
          {
            [key]: value,
          },
          null,
          2,
        )),
      );
    } else {
      const data = vscode.workspace.fs.readFile(vscode.Uri.file(getGlobalContextFilePath()));

      let parsed;
      try {
        parsed = JSON.parse(data.toString());
      } catch (e: any) {
        console.warn(`Error updating global context: ${e}`);
        return;
      }

      parsed[key] = value;
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(getGlobalContextFilePath()),
        new TextEncoder().encode(JSON.stringify(parsed, null, 2)),
      );
    }
  }

  get<T extends keyof GlobalContextType>(
    key: T,
  ): GlobalContextType[T] | undefined {
    if(!vscode.workspace.fs.stat(vscode.Uri.file(getGlobalContextFilePath())).then(() => true)){
      return undefined;
    }

    const data = vscode.workspace.fs.readFile(vscode.Uri.file(getGlobalContextFilePath()));
    try {
      const parsed = JSON.parse(data.toString());
      return parsed[key];
    } catch (e: any) {
      console.warn(`Error parsing global context: ${e}`);
      return undefined;
    }
  }
}
