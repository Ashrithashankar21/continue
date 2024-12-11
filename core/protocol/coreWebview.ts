import { ProfileDescription } from "../config/ConfigHandler";

import { ToCoreFromIdeOrWebviewProtocol } from "./core";
import { ToWebviewFromIdeOrCoreProtocol } from "./webview";

export type ToCoreFromWebviewProtocol = ToCoreFromIdeOrWebviewProtocol & {
  didChangeSelectedProfile: [{ id: string }, void];
};
export type ToWebviewFromCoreProtocol = ToWebviewFromIdeOrCoreProtocol & {
  didChangeAvailableProfiles: [{ profiles: ProfileDescription[] }, void];
};
