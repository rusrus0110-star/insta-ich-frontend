import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Send } from "lucide-react";

import {
  connect_socket,
  disconnect_socket,
  get_socket,
} from "../../services/socket_service.js";

import {
  create_conversation,
  get_conversation_messages,
  get_conversations,
  search_users,
} from "../../services/message_api_service.js";

import "../../styles/messages.css";

function get_current_user() {
  const userData = localStorage.getItem("user");

  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      const user = parsedUserData.user || parsedUserData;

      return {
        id: user.id || user._id || user.user_id,
        username: user.username || "ruslan",
        displayName: user.full_name || user.fullName || "Ruslan Chyhryn",
        avatar: user.avatar || null,
        avatarText: (user.username || "ruslan").charAt(0).toUpperCase(),
      };
    } catch {
      return null;
    }
  }

  return {
    id: null,
    username: "ruslan",
    displayName: "Ruslan Chyhryn",
    avatar: null,
    avatarText: "R",
  };
}

function get_user_id(user) {
  return user?.id || user?._id || user?.user_id || null;
}

function get_avatar_text(user) {
  const source = user?.username || user?.full_name || user?.fullName || "U";

  return source.charAt(0).toUpperCase();
}

function normalize_user(user) {
  return {
    id: get_user_id(user),
    username: user.username || "unknown",
    displayName: user.full_name || user.fullName || user.username || "Unknown",
    avatar: user.avatar || null,
    avatarText: get_avatar_text(user),
  };
}

function normalize_message(message, currentUser) {
  const senderId = get_user_id(message.sender) || message.sender;

  const isSent =
    currentUser?.id && senderId
      ? String(senderId) === String(currentUser.id)
      : message.sender?.username === currentUser?.username;

  return {
    id: message.id || message._id || Date.now(),
    type: isSent ? "sent" : "received",
    text: message.text,
    sender: message.sender,
    createdAt: message.created_at || message.createdAt,
  };
}

function normalize_conversation(conversation, currentUser) {
  const participants = conversation.participants || [];

  const otherUser =
    conversation.other_participant ||
    participants.find((participant) => {
      const participantId = get_user_id(participant);

      return String(participantId) !== String(currentUser?.id);
    }) ||
    participants[0];

  const otherUsername = otherUser?.username || "unknown";

  const otherDisplayName =
    otherUser?.full_name ||
    otherUser?.fullName ||
    otherUser?.username ||
    "Unknown user";

  const lastMessage = conversation.last_message || conversation.lastMessage;

  const status = lastMessage
    ? `${otherDisplayName} sent a message · now`
    : "No messages yet";

  return {
    id: conversation.id || conversation._id,
    username: otherUsername,
    displayName: otherDisplayName,
    status,
    avatar: otherUser?.avatar || null,
    avatarText: get_avatar_text(otherUser),
    profileLink: `/profile/${otherUsername}`,
    raw: conversation,
  };
}

function MessagesPage() {
  const currentUser = useMemo(() => get_current_user(), []);
  const { username: targetUsername } = useParams();
  const openedTargetRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];

  const activeMessages = activeChat
    ? messagesByConversation[activeChat.id] || []
    : [];

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length < 2) {
      return false;
    }

    return (
      user.username.toLowerCase().includes(query) ||
      user.displayName.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const activeSocket = connect_socket();

    async function load_conversations() {
      try {
        const conversations = await get_conversations();

        const normalizedChats = conversations.map((conversation) =>
          normalize_conversation(conversation, currentUser),
        );

        setChats(normalizedChats);

        if (normalizedChats.length > 0) {
          setActiveChatId(normalizedChats[0].id);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    load_conversations();

    return () => {
      if (activeSocket) {
        disconnect_socket();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      return;
    }

    let isActive = true;

    async function load_search_results() {
      try {
        const usersData = await search_users(query);

        if (!isActive) {
          return;
        }

        const normalizedUsers = usersData
          .map(normalize_user)
          .filter((user) => user.id)
          .filter((user) => String(user.id) !== String(currentUser?.id));

        setUsers(normalizedUsers);
      } catch (error) {
        console.error("Failed to search users:", error.message);

        if (isActive) {
          setUsers([]);
        }
      }
    }

    load_search_results();

    return () => {
      isActive = false;
    };
  }, [searchQuery, currentUser]);

  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    const socket = get_socket();

    if (socket) {
      socket.emit("join_conversation", {
        conversation_id: activeChatId,
      });
    }

    async function load_messages() {
      try {
        const messages = await get_conversation_messages(activeChatId);

        setMessagesByConversation((currentMessages) => ({
          ...currentMessages,
          [activeChatId]: messages.map((message) =>
            normalize_message(message, currentUser),
          ),
        }));
      } catch (error) {
        console.error("Failed to load messages:", error.message);
      }
    }

    load_messages();
  }, [activeChatId, currentUser]);

  useEffect(() => {
    const socket = get_socket();

    if (!socket) {
      return undefined;
    }

    function handle_receive_message(payload) {
      const incomingMessage = payload?.message;

      if (!incomingMessage?.conversation) {
        return;
      }

      const conversationId = String(incomingMessage.conversation);

      setMessagesByConversation((currentMessages) => {
        const currentConversationMessages =
          currentMessages[conversationId] || [];

        const messageAlreadyExists = currentConversationMessages.some(
          (message) => String(message.id) === String(incomingMessage.id),
        );

        if (messageAlreadyExists) {
          return currentMessages;
        }

        return {
          ...currentMessages,
          [conversationId]: [
            ...currentConversationMessages,
            normalize_message(incomingMessage, currentUser),
          ],
        };
      });

      setChats((currentChats) =>
        currentChats.map((chat) => {
          if (String(chat.id) !== conversationId) {
            return chat;
          }

          return {
            ...chat,
            status: `${chat.displayName} sent a message · now`,
          };
        }),
      );
    }

    socket.on("receive_message", handle_receive_message);

    return () => {
      socket.off("receive_message", handle_receive_message);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!targetUsername) {
      openedTargetRef.current = null;
      return;
    }

    if (targetUsername === currentUser?.username) {
      return;
    }

    if (openedTargetRef.current === targetUsername) {
      return;
    }

    if (isLoading) {
      return;
    }

    openedTargetRef.current = targetUsername;

    async function open_target_conversation() {
      try {
        await Promise.resolve();

        const existingChat = chats.find(
          (chat) => chat.username === targetUsername,
        );

        if (existingChat) {
          setActiveChatId(existingChat.id);
          setSearchQuery("");
          return;
        }

        const usersData = await search_users(targetUsername);

        const targetUser = usersData
          .map(normalize_user)
          .find((user) => user.username === targetUsername);

        if (!targetUser?.id) {
          console.error("Target user was not found:", targetUsername);
          return;
        }

        const conversation = await create_conversation(targetUser.id);

        if (!conversation) {
          throw new Error("Conversation was not returned by backend");
        }

        const normalizedConversation = normalize_conversation(
          conversation,
          currentUser,
        );

        setChats((currentChats) => {
          const alreadyExists = currentChats.some(
            (chat) => String(chat.id) === String(normalizedConversation.id),
          );

          if (alreadyExists) {
            return currentChats;
          }

          return [normalizedConversation, ...currentChats];
        });

        setActiveChatId(normalizedConversation.id);
        setSearchQuery("");
      } catch (error) {
        console.error("Failed to open target conversation:", error.message);
      }
    }

    open_target_conversation();
  }, [targetUsername, currentUser, chats, isLoading]);

  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
    setSearchQuery("");
  }

  async function handleStartConversation(participantId) {
    try {
      const conversation = await create_conversation(participantId);

      if (!conversation) {
        throw new Error("Conversation was not returned by backend");
      }

      const normalizedConversation = normalize_conversation(
        conversation,
        currentUser,
      );

      setChats((currentChats) => {
        const alreadyExists = currentChats.some(
          (chat) => String(chat.id) === String(normalizedConversation.id),
        );

        if (alreadyExists) {
          return currentChats;
        }

        return [normalizedConversation, ...currentChats];
      });

      setActiveChatId(normalizedConversation.id);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to start conversation:", error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || !activeChat) {
      return;
    }

    const socket = get_socket();

    if (!socket) {
      console.error("Socket is not connected");
      return;
    }

    socket.emit(
      "send_message",
      {
        conversation_id: activeChat.id,
        text: trimmedMessage,
      },
      (response) => {
        if (!response?.success) {
          console.error("Message sending failed:", response?.message);
          return;
        }

        setMessageText("");
      },
    );
  }

  return (
    <main className="messages-page">
      <section className="messages-container">
        <aside className="messages-list-panel">
          <header className="messages-list-header">
            <div className="messages-current-user">
              <span className="messages-current-avatar">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={`${currentUser.username} avatar`}
                  />
                ) : (
                  <span>{currentUser.avatarText}</span>
                )}
              </span>

              <div>
                <h1>{currentUser.username}</h1>
                <p>{currentUser.displayName}</p>
              </div>
            </div>
          </header>

          <div className="messages-search-box">
            <Search size={15} strokeWidth={1.8} />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users"
            />
          </div>

          {searchQuery.trim().length < 2 && (
            <p className="messages-search-hint">
              Type at least 2 characters to search users.
            </p>
          )}

          <div className="messages-chat-list">
            {isLoading && (
              <p className="messages-empty-text">Loading conversations...</p>
            )}

            {!isLoading && chats.length === 0 && (
              <p className="messages-empty-text">No conversations yet.</p>
            )}

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
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={`${chat.username} avatar`}
                      className="messages-avatar-image"
                    />
                  ) : (
                    <span className="messages-avatar-fallback">
                      {chat.avatarText}
                    </span>
                  )}
                </span>

                <span className="messages-chat-info">
                  <span className="messages-chat-name">{chat.username}</span>
                  <span className="messages-chat-preview">{chat.status}</span>
                </span>
              </button>
            ))}

            <div className="messages-start-panel">
              {searchQuery.trim().length >= 2 &&
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="messages-chat-item"
                    onClick={() => handleStartConversation(user.id)}
                  >
                    <span className="messages-avatar-ring">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.username} avatar`}
                          className="messages-avatar-image"
                        />
                      ) : (
                        <span className="messages-avatar-fallback">
                          {user.avatarText}
                        </span>
                      )}
                    </span>

                    <span className="messages-chat-info">
                      <span className="messages-chat-name">
                        {user.username}
                      </span>
                      <span className="messages-chat-preview">
                        Start conversation
                      </span>
                    </span>
                  </button>
                ))}

              {searchQuery.trim().length >= 2 && filteredUsers.length === 0 && (
                <p className="messages-empty-text">No users found.</p>
              )}
            </div>
          </div>
        </aside>

        <section className="messages-dialog-panel">
          {activeChat ? (
            <>
              <header className="messages-dialog-header">
                <span className="messages-avatar-ring messages-dialog-avatar">
                  {activeChat.avatar ? (
                    <img
                      src={activeChat.avatar}
                      alt={`${activeChat.username} avatar`}
                      className="messages-avatar-image"
                    />
                  ) : (
                    <span className="messages-avatar-fallback">
                      {activeChat.avatarText}
                    </span>
                  )}
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

              <div className="messages-date-divider">Messages</div>

              <div className="messages-thread">
                {activeMessages.map((message) => {
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
            </>
          ) : (
            <div className="messages-empty-dialog">
              <p>Select a user to start messaging.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default MessagesPage;
