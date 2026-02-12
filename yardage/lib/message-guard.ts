const FLAGGED_PATTERNS = [
  /account\s*(?:no|num|number)/i,
  /bank\s*(?:account|transfer|details)?/i,
  /\btransfer\b/i,
  /\bopay\b/i,
  /\bpalmpay\b/i,
  /\bkuda\b/i,
  /\bmoniepoint\b/i,
  /\bwhatsapp\b/i,
  /\bwhats\s*app\b/i,
  /(?:my|phone|call|wa)\s*number/i,
  /\bsend\s*money\b/i,
  /pay\s*(?:me|directly|outside)/i,
  /\bcash\s*app\b/i,
];

const WARNING_MESSAGE =
  "For your safety, always pay through Yardage. Payments made outside the app are not covered by our Refund Guarantee.";

export function scanMessage(content: string): {
  flagged: boolean;
  warning: string | null;
} {
  const flagged = FLAGGED_PATTERNS.some((pattern) => pattern.test(content));
  return {
    flagged,
    warning: flagged ? WARNING_MESSAGE : null,
  };
}
