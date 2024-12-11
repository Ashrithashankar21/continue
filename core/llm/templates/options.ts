import { CompletionOptions, ModelName } from "../../index";

const CompletionOptionsForModels: {
  [key in ModelName]?: Partial<CompletionOptions>;
} = {
  "codellama-70b": {
    stop: ["Source: assistant"],
  },
};

export default CompletionOptionsForModels;
