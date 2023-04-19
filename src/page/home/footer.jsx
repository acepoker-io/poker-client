import React from 'react'
import logo from "../../assets/game/logo.png";
import {
    FaDiscord, FaEnvelope, FaGithub,
    // FaLocationArrow,
    FaMediumM,
    //   FaPhoneAlt,
    FaTwitter
} from 'react-icons/fa';
const Footer = () => {
    return (
        <div className='footer-section'>
            <div className="container">
                <div className="footer-Grid">
                    <div className="footer-logo">
                        <a href="https://wptpoker.io/"><img src={logo} alt="" /></a>
                        <div className="footer-descp">
                            <h4>WPT POKER</h4>
                            <p>  Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                            <h6>© 2023 - WPT Poker- All Rights Reserved</h6>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h5>Useful Links</h5>
                        <ul>
                            <li>Home</li>
                            <li>About</li>
                            <li>Services</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h5>Security & Privacy Links</h5>
                        <ul>
                            <li>Privacy Policy</li>
                            <li>Cookie Policy</li>
                            <li>Terms of Use</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h5>Contact Us</h5>
                        <ul>
                            {/* <li><FaPhoneAlt />454646645</li> */}
                            <li><FaEnvelope />email@address.com</li>
                            {/* <li><FaLocationArrow /> 1/5454 b-45, <br />
                                Office address, NYC
                            </li> */}
                        </ul>
                        <ul className='social-links'>
                            <li><a href="https://twitter.com/WptPoker_io" target="_blank" rel="noopener noreferrer"><FaTwitter /></a></li>
                            <li><a href="https://medium.com/@WptPoker_io" target="_blank" rel="noopener noreferrer"><FaMediumM /></a></li>
                            <li><a href="https://docs.wptpoker.io/wpt-poker-docs/" target="_blank" rel="noopener noreferrer"><FaGithub /></a></li>
                            <li><a href="https://discord.gg/wptpoker" target="_blank" rel="noopener noreferrer"><FaDiscord /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Footer