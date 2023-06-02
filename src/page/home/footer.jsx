import React from 'react'
import logo from "../../assets/game/logo.png";
import {
    FaDiscord, FaEnvelope,
    // FaLocationArrow,
    // FaMediumM,
    //   FaPhoneAlt,
    FaTwitter
} from 'react-icons/fa';
import { landingUrl } from '../../config/keys';
const Footer = () => {
    return (
        <div className='footer-section'>
            <div className="container">
                <div className="footer-Grid">
                    <div className="footer-logo">
                        <a href={landingUrl}><img src={logo} alt="logo" /></a>
                        <div className="footer-descp">
                            <h4>ACE POKER</h4>
                            <p>Deposit and Withdraw with Crypto, and Share 50% of Profits with Holders.</p>
                            <h6>© 2023 - ACE Poker- All Rights Reserved</h6>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h5>Useful Links</h5>
                        <ul>
                            <li><a href={landingUrl} target="_blank" rel="noopener noreferrer">Home</a></li>
                            <li><a href={`${ landingUrl }/#addaboutID`} target="_blank" rel="noopener noreferrer">About</a></li>
                            <li><a href={`${ landingUrl }/#playPoker`} target="_blank" rel="noopener noreferrer">Play Poker</a></li>
                            <li><a href={`${ landingUrl }/`} target="_blank" rel="noopener noreferrer">ACE Token</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h5>Security & Privacy Links</h5>
                        <ul>
                            <li><a href={`${ landingUrl }/privacy-policy-2/`} target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                            <li><a href={`${ landingUrl }/cookie-policy/`} target="_blank" rel="noopener noreferrer">Cookie Policy</a> </li>
                            <li><a href={`${ landingUrl }/terms-of-use/`} target="_blank" rel="noopener noreferrer">Terms of Use</a></li>
                            {/* <li><a href="https://docs.acepoker.io/ace-poker-docs/" target="_blank" rel="noopener noreferrer">Documentation</a></li> */}
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h5>Contact Us</h5>
                        <ul>
                            {/* <li><FaPhoneAlt />454646645</li> */}
                            <li><FaEnvelope /><a href="mailto:contact@acepoker.io">contact@acepoker.io</a></li>
                            {/* <li><FaLocationArrow /> 1/5454 b-45, <br />
                                Office address, NYC
                            </li> */}
                        </ul>
                        <ul className='social-links'>
                            <li><a href=" https://twitter.com/ACEPoker_io/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a></li>
                            <li><a href="https://medium.com/@acepoker/" target="_blank" rel="noopener noreferrer"><Medium /></a></li>
                            <li><a href="https://docs.acepoker.io/" target="_blank" rel="noopener noreferrer"><GitBook /></a></li>
                            <li><a href="https://discord.gg/" target="_blank" rel="noopener noreferrer"><FaDiscord /></a></li>
                            <li><a href="https://zealy.io/c/acepoker" target="_blank" rel="noopener noreferrer">Zealy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Footer


const GitBook = () => {
    return (
        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M10.802 17.77a.703.703 0 1 1-.002 1.406.703.703 0 0 1 .002-1.406m11.024-4.347a.703.703 0 1 1 .001-1.406.703.703 0 0 1-.001 1.406m0-2.876a2.176 2.176 0 0 0-2.174 2.174c0 .233.039.465.115.691l-7.181 3.823a2.165 2.165 0 0 0-1.784-.937c-.829 0-1.584.475-1.95 1.216l-6.451-3.402c-.682-.358-1.192-1.48-1.138-2.502.028-.533.212-.947.493-1.107.178-.1.392-.092.62.027l.042.023c1.71.9 7.304 3.847 7.54 3.956.363.169.565.237 1.185-.057l11.564-6.014c.17-.064.368-.227.368-.474 0-.342-.354-.477-.355-.477-.658-.315-1.669-.788-2.655-1.25-2.108-.987-4.497-2.105-5.546-2.655-.906-.474-1.635-.074-1.765.006l-.252.125C7.78 6.048 1.46 9.178 1.1 9.397.457 9.789.058 10.57.006 11.539c-.08 1.537.703 3.14 1.824 3.727l6.822 3.518a2.175 2.175 0 0 0 2.15 1.862 2.177 2.177 0 0 0 2.173-2.14l7.514-4.073c.38.298.853.461 1.337.461A2.176 2.176 0 0 0 24 12.72a2.176 2.176 0 0 0-2.174-2.174" /></svg>
    )
}

const Medium = () => {
    return (
        <svg width="80px" height="80px" viewBox="0 -55 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
            <g>
                <path d="M72.2009141,1.42108547e-14 C112.076502,1.42108547e-14 144.399375,32.5485469 144.399375,72.6964154 C144.399375,112.844284 112.074049,145.390378 72.2009141,145.390378 C32.327779,145.390378 0,112.844284 0,72.6964154 C0,32.5485469 32.325326,1.42108547e-14 72.2009141,1.42108547e-14 Z M187.500628,4.25836743 C207.438422,4.25836743 223.601085,34.8960455 223.601085,72.6964154 L223.603538,72.6964154 C223.603538,110.486973 207.440875,141.134463 187.503081,141.134463 C167.565287,141.134463 151.402624,110.486973 151.402624,72.6964154 C151.402624,34.9058574 167.562834,4.25836743 187.500628,4.25836743 Z M243.303393,11.3867175 C250.314,11.3867175 256,38.835526 256,72.6964154 C256,106.547493 250.316453,134.006113 243.303393,134.006113 C236.290333,134.006113 230.609239,106.554852 230.609239,72.6964154 C230.609239,38.837979 236.292786,11.3867175 243.303393,11.3867175 Z">

                </path>
            </g>
        </svg>
    )
}
