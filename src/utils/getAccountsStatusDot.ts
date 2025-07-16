type StatusColor = "gray" | "light-blue" | "dark-blue" | "green" | "yellow";

export const getAccountStatusDot = (
  status: string
): { color: StatusColor; tooltip: string } => {
  switch (status) {
    case "green":
      return { color: "green", tooltip: "Meeting response received" };
    case "yellow":
      return { color: "yellow", tooltip: "Response received" };
    case "dark_blue":
      return { color: "dark-blue", tooltip: "Message sent" };
    case "light_blue":
      return { color: "light-blue", tooltip: "Account saved" };
    case "not_contacted":
    default:
      return { color: "gray", tooltip: "No contact yet" };
  }
};
