import fetch from "cross-fetch";

import { Chunk, Reranker } from "../../index";

export class HuggingFaceTEIReranker implements Reranker {
  name = "huggingface-tei";

  static defaultOptions = {
    apiBase: "http://localhost:8080",
    truncate: true,
    truncation_direction: "Right",
  };

  constructor(
    private readonly params: {
      apiBase?: string;
      truncate?: boolean;
      truncation_direction?: string;
      apiKey?: string;
    },
  ) {}

  async rerank(query: string, chunks: Chunk[]): Promise<number[]> {
    let apiBase =
      this.params.apiBase ?? HuggingFaceTEIReranker.defaultOptions.apiBase;
    if (!apiBase.endsWith("/")) {
      apiBase += "/";
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.params.apiKey) {
      headers["Authorization"] = `Bearer ${this.params.apiKey}`;
    }

    const resp = await fetch(new URL("rerank", apiBase), {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: query,
        return_text: false,
        raw_scores: false,
        texts: chunks.map((chunk) => chunk.content),
        truncation_direction:
          this.params.truncation_direction ??
          HuggingFaceTEIReranker.defaultOptions.truncation_direction,
        truncate:
          this.params.truncate ??
          HuggingFaceTEIReranker.defaultOptions.truncate,
      }),
    });

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    const data = (await resp.json()) as any;
    // Resort into original order and extract scores
    const results = data.sort((a: any, b: any) => a.index - b.index);
    return results.map((result: any) => result.score);
  }
}
