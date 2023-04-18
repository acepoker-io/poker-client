import React from 'react'
import logo from "../../assets/game/logo.png";
import { FaDiscord, FaEnvelope, FaGithub, FaLocationArrow, FaMediumM, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
const Footer = () => {
    return (
        <div className='footer-section'>
            <div className="container">
                <div className="footer-Grid">
                    <div className="footer-logo">
                        <img src={logo} alt="" />
                        <div className="footer-descp">
                            <h4>WPT POKER</h4>
                            <p>  Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
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
                            <li><FaPhoneAlt />454646645</li>
                            <li><FaEnvelope />email@address.com</li>
                            <li><FaLocationArrow /> 1/5454 b-45, <br />
                                Office address, NYC
                            </li>
                        </ul>
                        <ul className='social-links'>
                            <li><FaTwitter /></li>
                            <li><FaMediumM /></li>
                            <li><FaGithub /></li>
                            <li><FaDiscord /></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Footer