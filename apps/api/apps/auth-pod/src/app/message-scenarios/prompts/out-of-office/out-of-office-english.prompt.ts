
export interface IBuildPromptData {
  emailBody: string;
}

export function buildOutOfOfficeEnglishPrompt(data: IBuildPromptData): string {

  return `
    Context: You are an AI assistant specialized in email analysis. Your task is to identify automatic "out-of-office" (OOO) replies.

    Input: You will receive the full text content of an email, including the subject line and the body. Insert the email content below:

    ${data.emailBody}

    Task: Analyze the provided email text above. Determine if it is an automatic out-of-office notification, auto-reply, or vacation response. Consider common phrases such as:

    "Out of office" / "OOO"

    "Away from my desk" / "Away from the office"

    "Limited access to email"

    "Will respond upon my return" / "Reply upon return"

    "Vacation" / "Holiday" / "Annual leave"

    "Auto-reply" / "Automatic reply"

    References to specific return dates without answering a direct query.

    Output:

    If the email is an out-of-office reply, respond with only the word: YES

    If the email is not an out-of-office reply, respond with only the word: NO

    Constraint: Do not provide any explanation, context, or additional text. Your entire response must be either YES or NO.

    Example Email Input (filled in):

    Subject: Out of Office: Quick Question

    Hi team,

    I am currently out of the office on annual leave until May 12th with limited access to email.

    For urgent matters, please contact colleague@example.com. Otherwise, I will respond to your message as soon as possible upon my return.

    Best regards,
    Alex.

    Expected Output for Example:

    YES
  `;
}
