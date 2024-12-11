import { ControlPlaneProxyInfo } from "../../../control-plane/analytics/IAnalyticsProvider";
import { Telemetry } from "../../../util/posthog";
import OpenAI from "../OpenAI";

import type { LLMOptions, ModelProvider } from "../../../index";

class ContinueProxy extends OpenAI {
  set controlPlaneProxyInfo(value: ControlPlaneProxyInfo) {
    this.apiKey = value.workOsAccessToken;
    this.apiBase = new URL("openai/v1/", value.controlPlaneProxyUrl).toString();
  }

  static providerName: ModelProvider = "continue-proxy";
  static defaultOptions: Partial<LLMOptions> = {
    useLegacyCompletionsEndpoint: false,
  };

  protected _getHeaders() {
    const headers: any = super._getHeaders();
    headers["x-continue-unique-id"] = Telemetry.uniqueId;
    return headers;
  }

  supportsCompletions(): boolean {
    return false;
  }

  supportsFim(): boolean {
    return true;
  }
}

export default ContinueProxy;
