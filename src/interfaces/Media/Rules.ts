interface Rules {
  mimeType: {
    contains: string[];
  };
  fullText: {
    contains: string[];
    exclude?: string[];
  };
}

type RuleValue = Rules["fullText"];
