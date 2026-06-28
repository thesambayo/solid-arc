/**
 * Toast — module singleton.
 *
 * Import anywhere (components, API interceptors, query handlers, utils):
 *
 *   import { toast } from "@/components/ui/toast";
 *   toast.success({ title: "Saved" });
 *   toast.error({ title: "Failed", description: err.message });
 *   toast.promise(api.post("/monitors", body), {
 *     loading: { title: "Creating monitor..." },
 *     success: { title: "Monitor created" },
 *     error:   { title: "Couldn't create monitor" },
 *   });
 *
 * The matching <Toaster /> render component must be mounted once near the app
 * root for these calls to appear on screen — see ./toaster.tsx.
 */
import { createToaster } from "@ark-ui/solid/toast";

export const toast = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 12,
  max: 5,
});
