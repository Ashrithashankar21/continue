import { LLMOptions, ModelProvider } from "../../index";

import Ollama from "./Ollama";

class Msty extends Ollama {
  static providerName: ModelProvider = "msty";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "http://localhost:10000",
    model: "codellama-7b",
  };
}

export default Msty;
