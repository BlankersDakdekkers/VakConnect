export const genericLeadSubmissionErrorMessage = "De aanvraag kon niet worden verwerkt. Probeer het later opnieuw.";

export class LeadSubmissionError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "LeadSubmissionError";
    this.statusCode = statusCode;
  }
}

export function resolveLeadSubmissionError(error: unknown) {
  if (error instanceof LeadSubmissionError) {
    return {
      statusCode: error.statusCode,
      message: error.statusCode >= 500 ? genericLeadSubmissionErrorMessage : error.message,
    };
  }

  return {
    statusCode: 500,
    message: genericLeadSubmissionErrorMessage,
  };
}
