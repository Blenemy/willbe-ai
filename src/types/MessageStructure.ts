export interface MessageStructure {
  id: string;
  name: string;
  messageType: string;
  subjectType: string;
  wordsLimit: number;
  user: {
    firstName: string;
    lastName: string;
  };
  languages: string[];
  createdAt: string;
}
