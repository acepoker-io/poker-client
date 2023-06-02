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
                            <li><a href="https://zealy.io/c/acepoker" target="_blank" rel="noopener noreferrer"><Zealy /></a></li>
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


const Zealy = () => {
    return (
<svg role="img" aria-label="Logo" width="26" height="26" viewBox="0 0 84 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.37693 7.24204L2.21093 7.07439L2.19659 10.2718L2.19499 10.9383C2.19404 11.4575 2.19278 12.3538 2.19152 13.8639C2.189 16.8839 2.18648 22.3606 2.18648 32.1883V33.4507L5.93775 37.234C4.45243 38.1765 2.96008 39.1081 1.46088 40.0289L0.0117395 40.919L0 61.9962L17.303 79.4581L18.4389 79.533C39.6703 80.9317 61.5054 79.3798 81.9636 72.2615L84 71.553V46.2255L79.5741 41.7618C80.3282 41.011 81.0806 40.2538 81.8275 39.492L82.7005 38.6015V37.3491C82.7005 36.4847 82.7031 31.9577 82.7056 27.6449L82.7114 17.974L64.8894 0L63.1155 0.599323C44.6964 6.82238 24.941 8.27802 5.37693 7.24204ZM64.0755 3.48918L79.6887 19.2356C79.6887 19.2356 79.6786 35.6178 79.6786 37.3491C78.9365 38.1061 78.1881 38.8592 77.4372 39.6067C76.7181 40.3225 75.9966 41.0331 75.2759 41.737L80.9781 47.4879V69.3804C61.0119 76.3276 39.6051 77.8732 18.6359 76.4917L3.02263 60.7351L3.03271 42.6319C4.74009 41.5832 6.43886 40.5206 8.12874 39.4436C9.00082 38.8879 9.87053 38.3283 10.7378 37.7649L5.2084 32.1883C5.2084 21.7569 5.21124 16.2286 5.21391 13.3372C5.21627 10.7806 5.21849 10.2856 5.21849 10.2856C6.22478 10.3388 7.23201 10.3856 8.23997 10.4256C27.065 11.1728 46.1422 9.54808 64.0755 3.48918Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.21844 10.2855C25.0188 11.334 45.1819 9.87248 64.0754 3.48917L79.6887 19.2356C79.6887 19.2356 79.6786 35.6178 79.6786 37.3491C78.2256 38.8311 76.749 40.2981 75.2759 41.737L80.978 47.4879V69.3804C61.0119 76.3275 39.605 77.8732 18.6358 76.4917L3.02258 60.7351L3.03267 42.6319C5.62116 41.042 8.18985 39.4201 10.7378 37.7649L5.20836 32.1883C5.20836 12.5337 5.21844 10.2855 5.21844 10.2855Z" fill="#354c9c"></path><path d="M73.6348 27.2004V35.9777C63.8941 45.3443 54.1535 53.5121 44.4229 60.7961C54.5967 60.1155 64.7603 58.4799 74.9442 55.5135C74.9442 58.7542 74.9442 61.9848 74.9442 65.2255C60.9023 69.3297 46.8706 70.884 32.8388 70.884C30.1191 70.884 27.3994 70.8231 24.6797 70.7113V61.9339C34.4203 55.6861 44.161 48.7882 53.8916 40.8947C46.8908 41.7988 39.8899 42.1849 32.8891 42.1849C30.8745 42.1849 28.87 42.1544 26.8554 42.0934C26.8554 38.8527 26.8554 35.6221 26.8554 32.3814C28.8498 32.4424 30.8343 32.4728 32.8288 32.4728C46.4274 32.4728 60.026 31.0201 73.6247 27.1902L73.6348 27.2004Z" fill="white"></path></svg>

)
}
