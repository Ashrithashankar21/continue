import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
  ContextSubmenuItem,
  LoadSubmenuItemsArgs,
} from "../../index";
import {
  getBasename,
  groupByLastNPathParts,
  getUniqueFilePath,
} from "../../util/index";
import { BaseContextProvider } from "../index";

class FolderContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "folder",
    displayTitle: "Folder",
    description: "Type to search",
    type: "submenu",
    dependsOnIndexing: true,
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    const { retrieveContextItemsFromEmbeddings } = await import(
      "../retrieval/retrieval.js"
    );
    return retrieveContextItemsFromEmbeddings(extras, this.options, query);
  }
  async loadSubmenuItems(
    args: LoadSubmenuItemsArgs,
  ): Promise<ContextSubmenuItem[]> {
    const folders = await args.ide.listFolders();
    const folderGroups = groupByLastNPathParts(folders, 2);

    return folders.map((folder) => {
      return {
        id: folder,
        title: getBasename(folder),
        description: getUniqueFilePath(folder, folderGroups),
      };
    });
  }
}

export default FolderContextProvider;
