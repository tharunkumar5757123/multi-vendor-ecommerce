import toast from "react-hot-toast";

function ConfirmToastContent({ title, message }) {
  return (
    <div className="max-w-[17rem]">
      <p className="text-sm font-medium leading-5 text-gray-900">
        {title}
      </p>

      {message && (
        <p className="mt-1 text-xs leading-4 text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}

export function showToast(type, title, message) {
  const text =
    type === "success" || type === "info"
      ? title
      : message || title;

  const options = {
    duration: 2500,
  };

  if (type === "success") {
    toast.success(text, options);
    return;
  }

  if (type === "error") {
    toast.error(text, options);
    return;
  }

  toast(text, {
    ...options,
    icon: type === "warning" ? "⚠️" : "👏",
  });
}

export function showConfirmToast({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return new Promise((resolve) => {
    const toastId = toast.custom(
      (toastInstance) => (
        <div
          className={`w-[min(92vw,20rem)] rounded-lg bg-white p-3 shadow-md transition ${
            toastInstance.visible
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          <ConfirmToastContent
            title={title}
            message={message}
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
              className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
              className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  });
}
