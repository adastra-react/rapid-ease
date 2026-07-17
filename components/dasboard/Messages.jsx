"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../auth/ProtectedRoute";
import contactMessageService from "@/app/store/services/contactMessageService";
import Header from "./Header";
import Sidebar from "./Sidebar";

const colors = {
  heading: "#1f2a56",
  body: "#44516b",
  muted: "#6b7280",
  subtle: "#94a3b8",
  searchBg: "#f5f7fb",
  errorBg: "#dc2626",
  errorText: "#fff7f7",
  panelBorder: "#d8e1ee",
};

const formatTimestamp = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatShortTimestamp = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const buildReplyEmailLink = (message) => {
  if (!message?.email) return "";

  const subject = encodeURIComponent("Reply from RapidEase876");
  const body = encodeURIComponent(
    `Hi ${message.name || "there"},\n\nThanks for reaching out to RapidEase876.\n\nRegarding your message:\n"${message.message || ""}"\n\nBest,\nRapidEase876`
  );

  return `mailto:${message.email}?subject=${subject}&body=${body}`;
};

export default function Messages() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await contactMessageService.getAllMessages({ limit: 100 });
      const fetchedMessages = response.data?.messages || [];

      setMessages(fetchedMessages);
      setSelectedMessageId((currentId) => {
        if (currentId && fetchedMessages.some((item) => item._id === currentId)) {
          return currentId;
        }

        return fetchedMessages[0]?._id || null;
      });
      setError("");
    } catch (fetchError) {
      console.error("Failed to load contact messages:", fetchError);
      setError("Unable to load contact messages right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return messages;
    }

    return messages.filter((message) =>
      [message.name, message.email, message.phone, message.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [messages, searchTerm]);

  const selectedMessage =
    filteredMessages.find((message) => message._id === selectedMessageId) ||
    messages.find((message) => message._id === selectedMessageId) ||
    filteredMessages[0] ||
    null;

  const unreadCount = messages.filter(
    (message) => message.status === "unread"
  ).length;

  const handleSelectMessage = async (message) => {
    if (!message?._id) return;

    setSelectedMessageId(message._id);

    if (message.status !== "unread") {
      return;
    }

    const optimisticMessage = { ...message, status: "read" };
    updateMessageInState(optimisticMessage);

    try {
      const response = await contactMessageService.updateMessage(message._id, {
        status: "read",
      });
      updateMessageInState(response.data.contactMessage);
      setError("");
    } catch (updateError) {
      console.error("Failed to mark message as read:", updateError);
      updateMessageInState(message);
      setError("Unable to update this message right now.");
    }
  };

  const updateMessageInState = (updatedMessage) => {
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message._id === updatedMessage._id ? updatedMessage : message
      )
    );
  };

  const handleToggleStatus = async () => {
    if (!selectedMessage) return;

    const nextStatus = selectedMessage.status === "unread" ? "read" : "unread";

    try {
      const response = await contactMessageService.updateMessage(
        selectedMessage._id,
        { status: nextStatus }
      );
      updateMessageInState(response.data.contactMessage);
    } catch (updateError) {
      console.error("Failed to update message status:", updateError);
      setError("Unable to update this message right now.");
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    try {
      setIsDeleting(true);
      await contactMessageService.deleteMessage(selectedMessage._id);

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message._id !== selectedMessage._id)
      );
      setSelectedMessageId((currentId) =>
        currentId === selectedMessage._id ? null : currentId
      );
      setError("");
    } catch (deleteError) {
      console.error("Failed to delete message:", deleteError);
      setError("Unable to delete this message right now.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplyByEmail = () => {
    if (!selectedMessage) return;

    const mailtoLink = buildReplyEmailLink(selectedMessage);
    if (!mailtoLink || typeof window === "undefined") return;

    window.location.href = mailtoLink;
  };

  const handleCallCustomer = () => {
    if (!selectedMessage?.phone || typeof window === "undefined") return;

    window.location.href = `tel:${selectedMessage.phone}`;
  };

  return (
    <ProtectedRoute>
      <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}>
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className='dashboard__content'>
          <Header setSideBarOpen={setSideBarOpen} />

          <div className='dashboard__content_content'>
            <h1 className='text-30' style={{ color: colors.heading }}>
              Messages
            </h1>
            <p className='' style={{ color: colors.body }}>
              Contact form submissions from the website arrive here.
            </p>
            <div className='row y-gap-30 pt-60'>
              <div className='col-lg-4'>
                <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30'>
                  <div
                    className='dbSearch mb-20'
                    style={{ backgroundColor: colors.searchBg }}
                  >
                    <i
                      className='icon-search text-16'
                      style={{ color: colors.muted }}
                    ></i>
                    <input
                      type='search'
                      placeholder='Search messages'
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      style={{ color: colors.heading }}
                    />
                  </div>

                  <div className='d-flex items-center justify-between mb-10'>
                    <div className='text-14' style={{ color: colors.muted }}>
                      {messages.length} total
                    </div>
                    <div
                      className='text-14'
                      style={{ color: unreadCount ? "#ea3c3c" : colors.body }}
                    >
                      {unreadCount} unread
                    </div>
                  </div>

                  {isLoading ? (
                    <div className='text-14 py-20' style={{ color: colors.body }}>
                      Loading messages...
                    </div>
                  ) : filteredMessages.length ? (
                    <div
                      className='row y-gap-15 pt-10'
                      style={{
                        maxHeight: "720px",
                        overflowY: "auto",
                        paddingRight: "6px",
                      }}
                    >
                      {filteredMessages.map((message) => {
                        const isActive = selectedMessage?._id === message._id;

                        return (
                          <div key={message._id} className='col-12'>
                            <button
                              type='button'
                              onClick={() => handleSelectMessage(message)}
                              className='w-100 text-start rounded-12 px-20 py-15'
                              style={{
                                height: "112px",
                                overflow: "hidden",
                                border: isActive
                                  ? "1px solid rgba(234,60,60,0.35)"
                                  : "1px solid #eaedf3",
                                background: isActive
                                  ? "rgba(234,60,60,0.05)"
                                  : "#ffffff",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  display: "grid",
                                  gridTemplateColumns: "50px minmax(0, 1fr) 56px",
                                  columnGap: "10px",
                                  alignItems: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className='size-50 rounded-full flex-center text-14 fw-600 text-white'
                                  style={{
                                    background:
                                      message.status === "unread"
                                        ? "#ea3c3c"
                                        : "#526071",
                                  }}
                                >
                                  {getInitials(message.name) || "RE"}
                                </div>

                                <div
                                  className='d-grid'
                                  style={{
                                    minWidth: 0,
                                    height: "100%",
                                    gridTemplateRows: "20px 18px 20px",
                                    alignContent: "center",
                                    rowGap: "8px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <h5
                                    className='text-15 fw-500'
                                    style={{
                                      color: colors.heading,
                                      lineHeight: "20px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      margin: 0,
                                    }}
                                  >
                                    {message.name}
                                  </h5>
                                  <div
                                    className='text-13'
                                    style={{
                                      color: colors.muted,
                                      lineHeight: "18px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {message.email}
                                  </div>
                                  <div
                                    className='text-14'
                                    style={{
                                      color: colors.body,
                                      lineHeight: "20px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      width: "100%",
                                    }}
                                  >
                                    {message.message}
                                  </div>
                                </div>

                                <div
                                  className='d-flex flex-column items-end justify-between text-right'
                                  style={{
                                    height: "100%",
                                    minWidth: "56px",
                                    maxWidth: "56px",
                                  }}
                                >
                                  <div
                                    className='text-13'
                                    style={{
                                      color: colors.muted,
                                      lineHeight: "18px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {formatShortTimestamp(message.createdAt)}
                                  </div>
                                  <div
                                    className='d-inline-flex size-16 rounded-full text-8 text-white flex-center'
                                    style={{
                                      backgroundColor:
                                        message.status === "unread"
                                          ? "#ea3c3c"
                                          : "transparent",
                                      visibility:
                                        message.status === "unread"
                                          ? "visible"
                                          : "hidden",
                                    }}
                                  >
                                    1
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='text-14 py-20' style={{ color: colors.body }}>
                      No messages match your search.
                    </div>
                  )}

                  {error && (
                    <div
                      className='mt-20 rounded-12 px-15 py-10 text-14'
                      style={{
                        backgroundColor: colors.errorBg,
                        color: colors.errorText,
                      }}
                    >
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className='col-lg-8'>
                <div className='rounded-12 bg-white shadow-2 px-40 pt-30 pb-30 h-100'>
                  {selectedMessage ? (
                    <>
                      <div className='row x-gap-10 y-gap-10 justify-between items-center pb-20 border-1-bottom'>
                        <div className='col-auto'>
                          <div className='d-flex items-center'>
                            <div
                              className='size-50 rounded-full flex-center text-15 fw-600 text-white'
                              style={{
                                background:
                                  selectedMessage.status === "unread"
                                    ? "#ea3c3c"
                                    : "#526071",
                              }}
                            >
                              {getInitials(selectedMessage.name) || "RE"}
                            </div>

                            <div className='ml-10'>
                              <h5
                                className='text-15 lh-13 fw-500'
                                style={{ color: colors.heading }}
                              >
                                {selectedMessage.name}
                              </h5>
                              <div
                                className='text-14 lh-13'
                                style={{ color: colors.body }}
                              >
                                {selectedMessage.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='col-auto'>
                          <div
                            className='d-flex items-center flex-wrap justify-end'
                            style={{ gap: "12px" }}
                          >
                            <span
                              className={`rounded-200 px-15 py-5 text-12 fw-500 ${
                                selectedMessage.status === "unread"
                                  ? "bg-accent-1-05 text-accent-1"
                                  : "bg-light-1 text-dark-1"
                              }`}
                            >
                              {selectedMessage.status === "unread"
                                ? "Unread"
                                : "Read"}
                            </span>
                            <button
                              type='button'
                              onClick={handleToggleStatus}
                              className='button -sm -outline-accent-1 text-accent-1'
                              style={{ minWidth: "136px" }}
                            >
                              Mark as{" "}
                              {selectedMessage.status === "unread"
                                ? "Read"
                                : "Unread"}
                            </button>
                            <button
                              type='button'
                              onClick={handleDeleteMessage}
                              disabled={isDeleting}
                              className='button -sm border-1 text-dark-1'
                              style={{ minWidth: "88px" }}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className='row y-gap-20 pt-30'>
                        <div className='col-md-6'>
                          <div
                            className='text-12 uppercase fw-600 mb-5'
                            style={{ color: colors.subtle }}
                          >
                            Phone
                          </div>
                          <div className='text-15' style={{ color: colors.body }}>
                            {selectedMessage.phone}
                          </div>
                        </div>

                        <div className='col-md-6'>
                          <div
                            className='text-12 uppercase fw-600 mb-5'
                            style={{ color: colors.subtle }}
                          >
                            Received
                          </div>
                          <div className='text-15' style={{ color: colors.body }}>
                            {formatTimestamp(selectedMessage.createdAt)}
                          </div>
                        </div>

                        <div className='col-12'>
                          <div
                            className='text-12 uppercase fw-600 mb-10'
                            style={{ color: colors.subtle }}
                          >
                            Message
                          </div>
                          <div
                            className='bg-light-1 rounded-12 py-20 px-25 text-15 lh-18'
                            style={{
                              color: colors.body,
                              border: `1px solid ${colors.panelBorder}`,
                            }}
                          >
                            {selectedMessage.message}
                          </div>
                        </div>

                        <div className='col-12'>
                          <div
                            className='text-12 uppercase fw-600 mb-10'
                            style={{ color: colors.subtle }}
                          >
                            Quick Actions
                          </div>
                          <div
                            className='d-flex items-center flex-wrap'
                            style={{ gap: "14px" }}
                          >
                            <button
                              type='button'
                              onClick={handleReplyByEmail}
                              className='button -md -dark-1 bg-accent-1 text-white'
                              style={{ minWidth: "174px", justifyContent: "center" }}
                            >
                              Reply by Email
                            </button>
                            <button
                              type='button'
                              onClick={handleCallCustomer}
                              className='button -md border-1 text-dark-1'
                              style={{ minWidth: "174px", justifyContent: "center" }}
                            >
                              Call Customer
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='d-flex flex-column items-center justify-center text-center h-100 py-60'>
                      <h2
                        className='text-24 fw-600'
                        style={{ color: colors.heading }}
                      >
                        No message selected
                      </h2>
                      <p
                        className='text-15 mt-10 mb-0'
                        style={{ color: colors.body }}
                      >
                        New contact form submissions will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='text-center pt-30'>
              © Copyright Rapid Eases {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
