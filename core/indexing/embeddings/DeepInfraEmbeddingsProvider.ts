import { EmbeddingsProviderName, EmbedOptions } from "../../index";
import { withExponentialBackoff } from "../../util/withExponentialBackoff";

import BaseEmbeddingsProvider from "./BaseEmbeddingsProvider";

class DeepInfraEmbeddingsProvider extends BaseEmbeddingsProvider {
  static providerName: EmbeddingsProviderName = "deepinfra";
  static defaultOptions: Partial<EmbedOptions> | undefined = {
    model: "sentence-transformers/all-MiniLM-L6-v2",
  };

  async embed(chunks: string[]) {
    const fetchWithBackoff = () =>
      withExponentialBackoff<Response>(() =>
        this.fetch(
          `https://api.deepinfra.com/v1/inference/${this.options.model}`,
          {
            method: "POST",
            headers: {
              Authorization: `bearer ${this.options.apiKey}`,
            },
            body: JSON.stringify({ inputs: chunks }),
          },
        ),
      );
    const resp = await fetchWithBackoff();
    const data = await resp.json();
    return data.embeddings;
  }
}

export default DeepInfraEmbeddingsProvider;
