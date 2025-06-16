import { isAxiosError } from "axios";
import { toast } from "sonner";

export function handleAxiosError(
  err: unknown,
  fallbackMessage = "Something went wrong"
) {
  if (isAxiosError<{ message?: string; detail?: string }>(err)) {
    const message =
      err.response?.data?.message ?? err.message ?? fallbackMessage;
    toast(message);
  } else if (err instanceof Error) {
    toast(err.message ?? fallbackMessage);
  } else {
    toast(fallbackMessage);
  }
}
