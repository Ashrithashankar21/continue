import { LLMOptions, ModelProvider } from "../../index";

import OpenAI from "./OpenAI";

class DeepInfra extends OpenAI {
  static providerName: ModelProvider = "deepinfra";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "https://api.deepinfra.com/v1/openai/",
  };
  maxStopWords: number | undefined = 16;
}

export default DeepInfra;
