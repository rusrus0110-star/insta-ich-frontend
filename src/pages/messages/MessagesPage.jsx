import { useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

import "../../styles/messages.css";

const currentUser = {
  username: "ruslan",
  displayName: "Ruslan Chyhryn",
  avatarText: "RC",
  profileLink: "/profile/ruslan",
};

const initialChats = [
  {
    id: "nikita",
    username: "nikita",
    displayName: "Nikita",
    status: "Active now",
    avatarText: "N",
    profileLink: "/profile/ichcareerhub",
    messages: [
      {
        id: 1,
        type: "received",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        type: "sent",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
  },
  {
    id: "sasha",
    username: "sasha",
    displayName: "Sasha",
    status: "Active 1 hour ago",
    avatarText: "S",
    profileLink: "/profile/ichcareerhub",
    messages: [
      {
        id: 1,
        type: "received",
        text: "Hi Ruslan, did you finish the final project layout?",
      },
      {
        id: 2,
        type: "sent",
        text: "Yes, I am finishing the messages page now.",
      },
    ],
  },
];

function MessagesPage() {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [messageText, setMessageText] = useState("");

  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];

  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    setChats((currentChats) =>
      currentChats.map((chat) => {
        if (chat.id !== activeChatId) {
          return chat;
        }

        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: Date.now(),
              type: "sent",
              text: trimmedMessage,
            },
          ],
        };
      }),
    );

    setMessageText("");
  }

  return (
    <main className="messages-page">
      <section className="messages-container">
        <aside className="messages-list-panel">
          <header className="messages-list-header">
            <h1>ichcareerhub</h1>
          </header>

          <div className="messages-chat-list">
            {chats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className={
                  chat.id === activeChatId
                    ? "messages-chat-item messages-chat-item-active"
                    : "messages-chat-item"
                }
                onClick={() => handleSelectChat(chat.id)}
              >
                <span className="messages-avatar-ring">
                  <span className="messages-avatar-fallback">
                    {chat.avatarText}
                  </span>
                </span>

                <span className="messages-chat-info">
                  <span className="messages-chat-name">{chat.username}</span>
                  <span className="messages-chat-preview">
                    {chat.status} · 1 m
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="messages-dialog-panel">
          <header className="messages-dialog-header">
            <span className="messages-avatar-ring messages-dialog-avatar">
              <span className="messages-avatar-fallback">
                {activeChat.avatarText}
              </span>
            </span>

            <h2>{activeChat.username}</h2>
            <p>{activeChat.displayName}</p>

            <Link
              to={activeChat.profileLink}
              className="messages-view-profile-button"
            >
              View profile
            </Link>
          </header>

          <div className="messages-date-divider">Jun 25, 2024, 08:46 PM</div>

          <div className="messages-thread">
            {activeChat.messages.map((message) => {
              const isSent = message.type === "sent";

              return (
                <div
                  key={message.id}
                  className={
                    isSent
                      ? "messages-bubble-row messages-bubble-row-sent"
                      : "messages-bubble-row messages-bubble-row-received"
                  }
                >
                  {!isSent && (
                    <span className="messages-small-avatar">
                      {activeChat.avatarText}
                    </span>
                  )}

                  <p
                    className={
                      isSent
                        ? "messages-bubble messages-bubble-sent"
                        : "messages-bubble messages-bubble-received"
                    }
                  >
                    {message.text}
                  </p>

                  {isSent && (
                    <span className="messages-small-avatar messages-small-avatar-sent">
                      {currentUser.avatarText}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <form className="messages-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Write message..."
            />

            <button type="submit" aria-label="Send message">
              <Send size={17} strokeWidth={1.9} />
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default MessagesPage;
