import { ChatMessage, LLMOptions, ModelProvider } from "../../index";
import { gptEditPrompt } from "../templates/edit";

import OpenAI from "./OpenAI";

class Mistral extends OpenAI {
  static providerName: ModelProvider = "mistral";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "https://api.mistral.ai/v1/",
    model: "codestral-latest",
    promptTemplates: {
      edit: gptEditPrompt,
    },
  };

  constructor(options: LLMOptions) {
    super(options);
    if (
      options.model.includes("codestral") &&
      !options.model.includes("mamba")
    ) {
      this.apiBase = options.apiBase ?? "https://codestral.mistral.ai/v1/";
    }

    if (!this.apiBase?.endsWith("/")) {
      this.apiBase += "/";
    }
  }

  private static modelConversion: { [key: string]: string } = {
    "mistral-7b": "open-mistral-7b",
    "mistral-8x7b": "open-mixtral-8x7b",
  };
  protected _convertModelName(model: string): string {
    return Mistral.modelConversion[model] ?? model;
  }

  protected _convertArgs(options: any, messages: ChatMessage[]) {
    const finalOptions = super._convertArgs(options, messages);

    const lastMessage = finalOptions.messages[finalOptions.messages.length - 1];
    if (lastMessage?.role === "assistant") {
      (lastMessage as any).prefix = true;
    }

    return finalOptions;
  }

  supportsFim(): boolean {
    return true;
  }
}

export default Mistral;
