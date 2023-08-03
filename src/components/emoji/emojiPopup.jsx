import React from "react";
import PropTypes from "prop-types";
import "./emojiPopup.css";

const EmojiPopup = React.forwardRef(({ handleSelectEmoji }, ref) => {
    const str =
        "😀 😃 😄 😁 😆 😅 😂 🤣 🥲 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾";
    return (
        <div className="emoji-popup" ref={ref}>
            <div className="emoji-popup-content">
                {str.split(" ").map((emoji) => (
                    <span role="presentation" onClick={() => handleSelectEmoji(emoji)}>
                        {emoji}
                    </span>
                ))}
            </div>
        </div>
    );
});
EmojiPopup.propTypes = {
    handleSelectEmoji: PropTypes.func.isRequired,
};
export default EmojiPopup;
