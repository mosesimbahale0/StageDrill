import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, Heart, MessageCircle } from "lucide-react";

export function ChatSection({
  initialChats,
  currentCustomerId,
  chatFetcher,
  productId,
}: {
  initialChats: any[];
  currentCustomerId: string;
  chatFetcher: any;
  productId: string;
}) {
  const [chats, setChats] = useState(initialChats);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isSending =
    chatFetcher.state === "submitting" &&
    chatFetcher.formData?.get("_action") === "createChat";

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    if (!isSending && chatFetcher.data?.success && chatFetcher.data.newChat) {
      setChats((prev) => [...prev, chatFetcher.data.newChat]);
      formRef.current?.reset();
    } else if (chatFetcher.data?.success && chatFetcher.data.deletedChatId) {
      setChats((prev) =>
        prev.filter((chat: any) => chat._id !== chatFetcher.data.deletedChatId)
      );
    }
  }, [chatFetcher.data, isSending]);

  return (
    <section className="mt-10  w-full">
      <h2 className="text-xl font-semibold mb-5 text-text1">
        {chats.length} Comment{chats.length !== 1 && "s"}
      </h2>

      {/* Add Comment */}
      <chatFetcher.Form
        method="post"
        ref={formRef}
        className="flex items-start gap-3 my-6 py-4"
      >
        <input type="hidden" name="_action" value="createChat" />
        <input type="hidden" name="productId" value={productId} />

        <img
          src={`https://ui-avatars.com/api/?name=You&background=888&color=fff`}
          alt="You"
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1 flex items-end gap-2">
          <textarea
            name="content"
            rows={2}
            placeholder="Add a comment..."
            className=" bg-primary border-b-2 border-tertiary h-6 focus:h-8 text-sm text-text1 resize-none focus:ring-accent focus:border-accent  outline-none w-3/4"
            required
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending}
            className="bg-accent text-buttontext font-semibold  hover:bg-complementary disabled:opacity-50  w-10 h-10 rounded-full flex justify-center items-center"
          >
            {isSending ? (
              <span className="animate-spin h-5 w-5 border-2 border-tertiaty border-t-transparent rounded-full"></span>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </chatFetcher.Form>

      {/* Comment List */}
      <div
        ref={chatMessagesRef}
        className="space-y-6 overflow-y-auto border-t border-tertiary pt-4"
      >
        {chats.length > 0 ? (
          chats.map((chat: any) => {
            const isCurrentUser = chat.customer._id === currentCustomerId;
            return (
              <div key={chat._id} className="flex gap-3 group">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      chat.customer.avatar ||
                      `https://ui-avatars.com/api/?name=${chat.customer.user_name}&background=0D8ABC&color=fff`
                    }
                    alt={chat.customer.user_name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-text1">
                      {chat.customer.user_name}
                    </p>
                    <span className="text-xs text-text2">
                      {new Date(parseInt(chat.createdAt)).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <p className="text-sm text-text1 mt-1 leading-snug">
                    {chat.content}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-text2">
                    <button className="flex items-center gap-1 hover:text-accent transition">
                      <Heart size={14} /> Like
                    </button>
                    <button className="flex items-center gap-1 hover:text-accent transition">
                      <MessageCircle size={14} /> Reply
                    </button>

                    {isCurrentUser && (
                      <chatFetcher.Form method="post" className="inline">
                        <input
                          type="hidden"
                          name="_action"
                          value="deleteChat"
                        />
                        <input type="hidden" name="chatId" value={chat._id} />
                        <button
                          type="submit"
                          title="Delete comment"
                          className="hover:text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </chatFetcher.Form>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-text2 pt-6">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </section>
  );
}
