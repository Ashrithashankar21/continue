import { ControlPlaneProxyInfo } from "../../control-plane/analytics/IAnalyticsProvider";
import { EmbeddingsProviderName } from "../../index";

import OpenAIEmbeddingsProvider from "./OpenAIEmbeddingsProvider";

class ContinueProxyEmbeddingsProvider extends OpenAIEmbeddingsProvider {
  static providerName: EmbeddingsProviderName = "continue-proxy";

  set controlPlaneProxyInfo(value: ControlPlaneProxyInfo) {
    this.options.apiKey = value.workOsAccessToken;
    this.options.apiBase = new URL(
      "openai/v1",
      value.controlPlaneProxyUrl,
    ).toString();
  }
}

export default ContinueProxyEmbeddingsProvider;
