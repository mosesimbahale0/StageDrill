import { Fragment, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Send } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatFetcher: any;
  productId: string;
  merchantName: string;
}

export function ChatModal({ isOpen, onClose, chatFetcher, productId, merchantName }: ChatModalProps) {
  const isSending =
    chatFetcher.state === 'submitting' && chatFetcher.formData?.get('_action') === 'createChat';
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSending && chatFetcher.data?.success) {
      formRef.current?.reset();
      onClose();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSending, chatFetcher.data, isOpen, onClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-secondary p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-text1 mb-4">
                  Message {merchantName || 'Seller'}
                </Dialog.Title>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary">
                  x
                </button>
                <chatFetcher.Form method="post" ref={formRef} className="flex flex-col gap-4">
                  <input type="hidden" name="_action" value="createChat" />
                  <input type="hidden" name="productId" value={productId} />
                  <div>
                    <label htmlFor="chat-content" className="block text-sm font-medium text-text2 mb-1">
                      Your Message
                    </label>
                    <textarea
                      ref={inputRef as any}
                      name="content"
                      id="chat-content"
                      rows={4}
                      placeholder="Ask a question about the product or delivery..."
                      className="w-full bg-primary border border-tertiary rounded-lg p-2 text-text1 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="flex items-center justify-center gap-2 bg-accent text-buttontext font-bold py-2 px-4 rounded-lg hover:bg-complementary disabled:opacity-50"
                    >
                      {isSending ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                      ) : (
                        <Send size={18} />
                      )}
                      <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </chatFetcher.Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
