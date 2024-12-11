import { RerankerName } from "../../index";

import { CohereReranker } from "./cohere";
import { ContinueProxyReranker } from "./ContinueProxyReranker";
import { FreeTrialReranker } from "./freeTrial";
import { LLMReranker } from "./llm";
import { HuggingFaceTEIReranker } from "./tei";
import { VoyageReranker } from "./voyage";

export const AllRerankers: { [key in RerankerName]: any } = {
  cohere: CohereReranker,
  llm: LLMReranker,
  voyage: VoyageReranker,
  "free-trial": FreeTrialReranker,
  "huggingface-tei": HuggingFaceTEIReranker,
  "continue-proxy": ContinueProxyReranker,
};
