import { LLMOptions, ModelProvider } from "../../index";
import { osModelsEditPrompt } from "../templates/edit";

import OpenAI from "./OpenAI";

class OpenRouter extends OpenAI {
  static providerName: ModelProvider = "openrouter";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "https://openrouter.ai/api/v1/",
    model: "gpt-4o-mini",
    promptTemplates: {
      edit: osModelsEditPrompt,
    },
    useLegacyCompletionsEndpoint: false,
  };
}

export default OpenRouter;
