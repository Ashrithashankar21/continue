import { ContextRetrievalService } from "./context/ContextRetrievalService";
import {
  fillPromptWithSnippets,
  rankAndOrderSnippets,
  type AutocompleteSnippet,
} from "./context/ranking/index";
import { HelperVars } from "./util/HelperVars";

function filterSnippetsAlreadyInCaretWindow(
  snippets: AutocompleteSnippet[],
  caretWindow: string,
): AutocompleteSnippet[] {
  return snippets
    .map((snippet) => ({ ...snippet }))
    .filter(
      (s) =>
        s.contents.trim() !== "" && !caretWindow.includes(s.contents.trim()),
    );
}

export async function aggregateSnippets(
  helper: HelperVars,
  extraSnippets: AutocompleteSnippet[],
  contextRetrievalService: ContextRetrievalService,
): Promise<AutocompleteSnippet[]> {
  let snippets = await contextRetrievalService.retrieveCandidateSnippets(
    helper,
    extraSnippets,
  );

  snippets = filterSnippetsAlreadyInCaretWindow(
    snippets,
    helper.prunedCaretWindow,
  );

  const scoredSnippets = rankAndOrderSnippets(snippets, helper);

  const finalSnippets = fillPromptWithSnippets(
    scoredSnippets,
    helper.maxSnippetTokens,
    helper.modelName,
  );

  return finalSnippets;
}
