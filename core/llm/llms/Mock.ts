import { ChatMessage, CompletionOptions, ModelProvider } from "../../index";
import { BaseLLM } from "../index";

class Mock extends BaseLLM {
  public completion: string = "Test Completion";
  static providerName: ModelProvider = "mock";

  protected async *_streamComplete(
    prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    yield this.completion;
  }

  protected async *_streamChat(
    messages: ChatMessage[],
    options: CompletionOptions,
  ): AsyncGenerator<ChatMessage> {
    for (const char of this.completion) {
      yield {
        role: "assistant",
        content: char,
      };
    }
  }
}

export default Mock;
