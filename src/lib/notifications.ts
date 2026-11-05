import { toast } from "sonner";

export function notifySuccess(title: string, description?: string) {
  if (description) {
    toast.success(title, { description });
    return;
  }

  toast.success(title);
}

export function notifyError(title: string, description?: string) {
  if (description) {
    toast.error(title, { description });
    return;
  }

  toast.error(title);
}

export function notifyInfo(title: string, description?: string) {
  if (description) {
    toast.info(title, { description });
    return;
  }

  toast.info(title);
}
