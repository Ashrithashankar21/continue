import { EmbeddingsProviderName } from "../../index";

import BaseEmbeddingsProvider from "./BaseEmbeddingsProvider";
import BedrockEmbeddingsProvider from "./BedrockEmbeddingsProvider";
import CohereEmbeddingsProvider from "./CohereEmbeddingsProvider";
import ContinueProxyEmbeddingsProvider from "./ContinueProxyEmbeddingsProvider";
import DeepInfraEmbeddingsProvider from "./DeepInfraEmbeddingsProvider";
import FreeTrialEmbeddingsProvider from "./FreeTrialEmbeddingsProvider";
import GeminiEmbeddingsProvider from "./GeminiEmbeddingsProvider";
import HuggingFaceTEIEmbeddingsProvider from "./HuggingFaceTEIEmbeddingsProvider";
import LMStudioEmbeddingsProvider from "./LMStudio";
import MistralEmbeddingsProvider from "./MistralEmbeddingsProvider";
import NebiusEmbeddingsProvider from "./NebiusEmbeddingsProvider";
import NvidiaEmbeddingsProvider from "./NvidiaEmbeddingsProvider";
import OllamaEmbeddingsProvider from "./OllamaEmbeddingsProvider";
import OpenAIEmbeddingsProvider from "./OpenAIEmbeddingsProvider";
import SageMakerEmbeddingsProvider from "./SageMakerEmbeddingsProvider";
import TransformersJsEmbeddingsProvider from "./TransformersJsEmbeddingsProvider";
import VertexEmbeddingsProvider from "./VertexEmbeddingsProvider";
import VoyageEmbeddingsProvider from "./VoyageEmbeddingsProvider";
import WatsonxEmbeddingsProvider from "./WatsonxEmbeddingsProvider";

type EmbeddingsProviderConstructor = new (
  ...args: any[]
) => BaseEmbeddingsProvider;

export const allEmbeddingsProviders: Record<
  EmbeddingsProviderName,
  EmbeddingsProviderConstructor
> = {
  sagemaker: SageMakerEmbeddingsProvider,
  bedrock: BedrockEmbeddingsProvider,
  ollama: OllamaEmbeddingsProvider,
  "transformers.js": TransformersJsEmbeddingsProvider,
  openai: OpenAIEmbeddingsProvider,
  cohere: CohereEmbeddingsProvider,
  "free-trial": FreeTrialEmbeddingsProvider,
  "huggingface-tei": HuggingFaceTEIEmbeddingsProvider,
  gemini: GeminiEmbeddingsProvider,
  "continue-proxy": ContinueProxyEmbeddingsProvider,
  deepinfra: DeepInfraEmbeddingsProvider,
  nvidia: NvidiaEmbeddingsProvider,
  voyage: VoyageEmbeddingsProvider,
  mistral: MistralEmbeddingsProvider,
  nebius: NebiusEmbeddingsProvider,
  vertexai: VertexEmbeddingsProvider,
  watsonx: WatsonxEmbeddingsProvider,
  lmstudio: LMStudioEmbeddingsProvider,
};
