import React, { useEffect, useRef, Fragment, useMemo } from "react";
import { useFetcher } from "@remix-run/react";
import { Transition, Dialog } from "@headlessui/react";
import { Coins, XCircle } from "lucide-react"; // small icons for style

export function BidModal({
  isOpen,
  setIsOpen,
  product,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: any;
}) {
  const bidFetcher = useFetcher<{ error?: string; success?: boolean }>();
  const isSubmitting = bidFetcher.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  const minBid = useMemo(
    () => product.current_bid + product.min_bid_increment,
    [product]
  );

  useEffect(() => {
    if (bidFetcher.data?.success && !isSubmitting) {
      setIsOpen(false);
      formRef.current?.reset();
    }
  }, [bidFetcher.data, isSubmitting, setIsOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-transparent backdrop-blur-md" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-6 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-6 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-md rounded-3xl bg-secondary p-12 text-left shadow-2xl transition-all">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-text2 hover:text-accent transition"
              >
                <XCircle className="w-6 h-6" />
              </button>

              {/* Title */}
              <Dialog.Title
                as="h3"
                className="flex items-center gap-2 text-2xl font-semibold text-text mb-6  border-b border-text3 pb-2"
              >
                <Coins className="w-6 h-6 text-accent" />
                Place Your Bargain
              </Dialog.Title>

              {/* Bid Form */}
              <bidFetcher.Form
                method="post"
                ref={formRef}
                className="space-y-6"
              >
                <input type="hidden" name="_action" value="createBid" />

                <div>
                  <label
                    htmlFor="bid_amount"
                    className="block text-sm font-medium text-text2 mb-2"
                  >
                    Bargain Amount (KES)
                  </label>
                  <input
                    type="number"
                    name="bid_amount"
                    id="bid_amount"
                    placeholder={`Minimum KES ${minBid}`}
                    className="bg-primary text-text placeholder:text-text2 h-12 w-full px-4 py-2 border border-tertiary rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition "
                    step="0.01"
                    min={minBid}
                    required
                  />
                </div>

                {bidFetcher.data?.error && (
                  <p className="text-sm text-red-400">
                    {bidFetcher.data.error}
                  </p>
                )}

                <p className="text-sm text-text2 leading-relaxed bg-tertiary rounded-sm p-3 border border-tertiary">
                  You’ll be charged a{" "}
                  <span className="text-accent font-medium">Ksh. 50/=</span>{" "}
                  deposit to confirm your interest in this product.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2 rounded-full bg-tertiary/60 text-accent hover:bg-tertiary hover:text-accent transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-4  text-sm rounded-full bg-accent text-buttontext hover:bg-accent/90 disabled:opacity-50 transition text-buttontext hover:bg-complementary"
                  >
                    {isSubmitting ? "Placing..." : "Submit Bargain"}
                  </button>
                </div>
              </bidFetcher.Form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
