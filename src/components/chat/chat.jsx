/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */
import React, { useState, useRef, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import PropsTypes from "prop-types";
import { toast } from "react-toastify";
import userimg from "../../assets/profile.png";
import "./chat.css";
import { userInstance } from "../../utils/axios.config";
import UserContext from "../../context/UserContext";
import { socket } from "../../config/socketConnection";
import { timeDifference } from "../../utils/utils";
import EmojiPopup from "../emoji/emojiPopup";

function Chat({ open, handleClick, chatRef, openChatData = {} }) {
    const messagesEndRef = useRef(null);
    const { user } = useContext(UserContext);
    const [show, setShow] = useState(true);
    const scrollToBottomRef = useRef(null);
    const [chatMessage, setChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [allFriends, setAllFriends] = useState([]);
    const [receiverId, setReceiverId] = useState();
    const [receiverUserName, setReceiverUserName] = useState();
    const [copyOfData, setCopyOfData] = useState([]);
    const [searchData, setSearchData] = useState("");
    const [allChatUsers, setAllChatUsers] = useState([]);
    const [singleUsername, setSingleUsername] = useState("");
    const [singleUserProfile, setSingleUserProfile] = useState("");

    const scrollToBottom = () => {
        scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getAllFriends = async () => {
        try {
            const users = await userInstance().get("/getAllFriends");
            const friendsList = users?.data.users;
            setAllFriends([...friendsList]);
            setCopyOfData([...friendsList]);
        } catch (e) {
            const { data, message } = e.response.data;
            if (data !== 200) {
                toast.error(message, { toastId: "acceptRequest" });
                localStorage.clear()
            }
        }
    };

    const getAllChatUsers = async () => {
        if (user?.id) {
            try {
                const users = await userInstance().get("/chatlist");
                setAllChatUsers(
                    users?.data?.chatData.sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                    )
                );
                // setNotificationCount(users?.data?.unreadCount);
            } catch (e) {
                const { data, message } = e.response.data;
                if (data !== 200) {
                    toast.error(message, { toastId: "acceptRequest" });
                }
            }
        }
    };

    useEffect(() => {
        getAllFriends();
        getAllChatUsers();
    }, [user?.id]);

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatMessage) return;
        socket.emit("newchatMessage", {
            message: chatMessage,
            sender: user?.id,
            receiver: receiverId,
        });
        socket.emit("sendNotification", {
            message: "has sent you a new message",
            sender: user?.id,
            receiver: receiverId,
            recipientUserName: receiverUserName,
        });
        scrollToBottom();
        setChatMessage("");
    };

    const handleChooseFriend = async (id, userName) => {
        console.log("handleChooseFriend executed");
        setReceiverUserName(userName);
        setSingleUsername(userName);
        setShow(false);
        setReceiverId(id);
        const res = await userInstance().get(`/chats/${ user?.id }/${ id }`);
        setSearchData("");
        scrollToBottom();
        setChatMessages(res.data);
        getAllChatUsers();
    };

    useEffect(() => {
        if (Object.keys(openChatData).length !== 0) {
            handleChooseFriend(
                openChatData.id,
                openChatData.username,
                openChatData.profile
            );
        }
    }, [openChatData]);

    useEffect(() => {
        socket.on("message", (data) => {
            console.log("datamessageee", data);
            setChatMessages((prev) => [...prev, data]);
            getAllChatUsers();
            scrollToBottom();
        });
        return () => {
            socket.off("message");
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    });

    const handleSearch = (item) => {
        setSearchData(item);
        const filterData = copyOfData?.filter(
            (value) =>
                value?.username
                    ?.toLowerCase()
                    .includes(item?.toLowerCase()) ||
                value?.username?.toLowerCase().includes(item?.toLowerCase())
        );
        console.log("filterData", filterData);
        setAllFriends(filterData);
    };

    const handleSelectEmojiComment = (emoji) => {
        setChatMessage((old) => old + emoji);
    };

    const handleBlur = () => {
        window.scrollTo(0, 0);
    };
    return (
        <div className={`chat-wrapper ${ !open ? "expand" : "" }`} ref={chatRef}>
            <div className="chat-section">
                <div className="chat-header">
                    <div
                        className="chatheaderdown"
                        onClick={() => handleClick(!open)}
                        role="presentation"
                    >
                        <span
                            className={
                                "unread-alert"
                            }
                        >
                        </span>
                        <span className="chat-author">
                            <img
                                src={singleUsername && !singleUserProfile ? userimg : singleUsername && singleUserProfile ? singleUserProfile : userimg}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = userimg;
                                }}
                                alt="user"
                            />
                            Message
                        </span>
                    </div>


                    {!show && (
                        <div
                            className="chat-back"
                            onClick={() => {
                                setShow(true);
                                setSingleUserProfile("");
                                setSingleUsername("");
                            }}
                            role="presentation"
                        >
                            <i className="las la-angle-left" />
                        </div>
                    )}

                    <span
                        className="close-icon"
                        onClick={() => handleClick(!open)}
                        role="presentation"
                    >
                        <i className={`las la-${ !open ? "angle-up" : "angle-down" }`} />
                    </span>
                </div>

                {show ? (
                    <ChatUserList
                        handleChooseFriend={handleChooseFriend}
                        allFriends={allFriends}
                        allChatUsers={allChatUsers}
                        handleSearch={handleSearch}
                        searchData={searchData}
                        setSingleUserProfile={setSingleUserProfile}
                        setSingleUsername={setSingleUsername}
                        // notificationCount={notificationCount}
                        user={user}
                    // setNotificationCount={setNotificationCount}
                    />
                ) : (
                    <SingleChatUser
                        handleChatSubmit={handleChatSubmit}
                        setChatMessage={setChatMessage}
                        chatMessages={chatMessages}
                        chatMessage={chatMessage}
                        messagesEndRef={messagesEndRef}
                        handleSelectEmojiComment={handleSelectEmojiComment}
                        handleBlur={handleBlur}
                        scrollToBottomRef={scrollToBottomRef}
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}

Chat.propTypes = {
    open: PropsTypes.bool.isRequired,
    handleClick: PropsTypes.func.isRequired,
    chatRef: PropsTypes.arrayOf.isRequired,
    openChatData: PropsTypes.any,
};

Chat.defaultProps = {
    openChatData: {},
};

export default Chat;

function ChatUserList({
    handleChooseFriend,
    allFriends,
    handleSearch,
    searchData,
    allChatUsers,
    setSingleUserProfile,
    setSingleUsername,
    scrollToBottomRef,
    user,
    notificationCount,
    setNotificationCount,
}) {
    function createMarkup(text) {
        return { __html: text };
    }

    // const handleNotificationSeen = async () => {
    //     if (notificationCount !== 0 && user?.id) {
    //         const res = await notificationInstance().put(
    //             `/seenNotifications?id=${ user?.id }`,
    //             { withCredentials: true, credentials: "include" }
    //         );
    //         const count = res?.data?.resData;
    //         setNotificationCount(count);
    //     }
    // };

    const scrollBottoInChatHIstory = () => {
        // console.log("scrolling to");
        scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="chat-content">
            <div className="chat-search">
                <Form inline>
                    <Form.Control
                        type="text"
                        placeholder="Search User"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Button>
                        <i className="las la-search" />
                    </Button>
                </Form>
                {searchData.length > 0 && (
                    <ul>
                        {allFriends?.length > 0 ? (
                            <>
                                {" "}
                                {allFriends &&
                                    allFriends.map((el) => (
                                        <li
                                            role="presentation"
                                            onClick={() =>
                                                handleChooseFriend(el?.id, el?.username)
                                            }
                                        >
                                            <div className="chat-user-pic">
                                                <img
                                                    src={
                                                        el?.recipient?.profile
                                                            ? el?.recipient?.profile
                                                            : userimg
                                                    }
                                                    alt="user"
                                                />
                                            </div>
                                            <div className="chat-user-content">
                                                <h4>
                                                    {el?.username}
                                                </h4>
                                            </div>
                                        </li>
                                    ))}
                            </>
                        ) : (
                            <li>
                                <h6>No Data Found</h6>
                            </li>
                        )}
                    </ul>
                )}
            </div>
            <div className="chat-users">
                {allChatUsers &&
                    allChatUsers.map((el) => (
                        <div
                            className="chat-list unread-msg"
                            onClick={() => {
                                // handleNotificationSeen();
                                handleChooseFriend(el?.user?._id, el?.user?.username);
                                setSingleUserProfile(el?.user?.profile);
                                setSingleUsername(el?.user?.username);
                                scrollBottoInChatHIstory();
                            }}
                            role="presentation"
                        >
                            <div className="chat-user-pic">
                                <img
                                    src={el?.user?.profile ? el?.user?.profile : userimg}
                                    alt="user"
                                />
                            </div>
                            <div className="chat-user-content">
                                <h4>
                                    {el?.user?.username}
                                    <span>{timeDifference(el?.date)}</span>
                                </h4>
                                <p dangerouslySetInnerHTML={createMarkup(el?.lastMessage)} />
                            </div>
                            {el?.count > 0 && (
                                <span className="unread-alert">{el?.count}</span>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
ChatUserList.propTypes = {
    handleChooseFriend: PropsTypes.func.isRequired,
    allFriends: PropsTypes.arrayOf.isRequired,
    handleSearch: PropsTypes.func.isRequired,
    searchData: PropsTypes.string.isRequired,
    allChatUsers: PropsTypes.arrayOf.isRequired,
    setSingleUserProfile: PropsTypes.func.isRequired,
    setSingleUsername: PropsTypes.func.isRequired,
    scrollToBottomRef: PropsTypes.object.isRequired,
    user: PropsTypes.object.isRequired,
    notificationCount: PropsTypes.number.isRequired,
    setNotificationCount: PropsTypes.func.isRequired,
};

// SingleChatUser

function SingleChatUser({
    handleChatSubmit,
    setChatMessage,
    chatMessages,
    chatMessage,
    messagesEndRef,
    handleSelectEmojiComment,
    handleBlur,
    scrollToBottomRef,
}) {
    const wrapperRef = useRef();
    const { user } = useContext(UserContext);
    const [emojiShow, setEmojiShow] = useState(false);
    const handleShowEmoji = () => {
        setEmojiShow(!emojiShow);
    };
    const useOutsideAlerter = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setEmojiShow(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };
    useOutsideAlerter(wrapperRef);

    function createMarkup(text) {
        return { __html: text };
    }

    return (
        <div className="chat-content">
            <div className="chat-users chat-message-box" ref={messagesEndRef}>
                {chatMessages?.length ? (
                    chatMessages
                        ?.filter((item) => item?.message)
                        ?.map((chat) => (
                            <div
                                className={`msg ${ chat?.sender?.id === user?.id ? "right-msg" : "left-msg"
                                    }`}
                            >
                                <div className="msg-img">
                                    <img
                                        src={
                                            chat?.sender?.profile ? chat?.sender?.profile : userimg
                                        }
                                        alt="user"
                                    />
                                </div>

                                <div className="msg-bubble">
                                    <div className="msg-info">
                                        <div className="msg-info-name">
                                            {chat?.sender?.firstName}
                                        </div>
                                        <div className="msg-info-time">
                                            {/* {new Date(chat?.createdAt).toLocaleString()}
                    {" "} */}
                                            {timeDifference(chat?.createdAt) === -1 ? 1 : timeDifference(chat?.createdAt)}
                                        </div>
                                    </div>

                                    <div
                                        className="msg-text"
                                        dangerouslySetInnerHTML={createMarkup(chat?.message)}
                                    />
                                </div>
                            </div>
                        ))
                ) : (
                    <div>Start chat here</div>
                )}
                <span />

                <div
                    className="textClass"
                    style={{ float: "left", clear: "both" }}
                    ref={scrollToBottomRef}
                >
                    {null}
                </div>
            </div>

            <div className="chat-search chat-input">
                <Form onSubmit={handleChatSubmit} inline>
                    <Form.Control
                        type="text"
                        placeholder="Type message"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onBlur={handleBlur()}
                    />

                    <Button type="submit">
                        <i className="las la-paper-plane" />
                    </Button>
                    <div className="emojiBocx chatemoji" ref={wrapperRef}>
                        <div
                            className="emojiPopupdiv"
                            onClick={handleShowEmoji}
                            role="presentation"
                        >
                            <p>☺️</p>
                        </div>
                        {emojiShow && (
                            <EmojiPopup handleSelectEmoji={handleSelectEmojiComment} />
                        )}
                    </div>
                </Form>
            </div>
        </div>
    );
}

SingleChatUser.defaultProps = {
    chatMessage: "",
    messagesEndRef: [],
};
SingleChatUser.propTypes = {
    handleChatSubmit: PropsTypes.func.isRequired,
    setChatMessage: PropsTypes.func.isRequired,
    chatMessages: PropsTypes.array.isRequired,
    chatMessage: PropsTypes.string,
    messagesEndRef: PropsTypes.array,
    handleSelectEmojiComment: PropsTypes.func.isRequired,
    handleBlur: PropsTypes.func.isRequired,
    scrollToBottomRef: PropsTypes.object.isRequired,
};
