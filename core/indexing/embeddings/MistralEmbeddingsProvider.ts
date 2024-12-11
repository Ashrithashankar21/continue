import { EmbeddingsProviderName, EmbedOptions } from "../../index";

import OpenAIEmbeddingsProvider from "./OpenAIEmbeddingsProvider";

class MistralEmbeddingsProvider extends OpenAIEmbeddingsProvider {
  static providerName: EmbeddingsProviderName = "mistral";
  static maxBatchSize = 128;

  static defaultOptions: Partial<EmbedOptions> | undefined = {
    apiBase: "https://api.mistral.ai/v1/",
    model: "mistral-embed",
  };
}

export default MistralEmbeddingsProvider;
