import React from 'react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="d-flex flex-column justify-content-center align-items-center gap-1">
      <section className="redes d-flex flex-column gap-3 pt-2">
        <img className="logo border-bottom" src="/images/logo/wePlaySport.png"  alt="LogoWePlaySport" />
        <div className="d-flex justify-content-center flex-nowrap gap-4 pb-2">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/socialMedia/instagram-6-24.png" alt="Instagram" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/socialMedia/twitter-x-24.png" alt="Twitter" />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/socialMedia/youtube-6-24.png" alt="YouTube" />
          </a>
        </div>
      </section>

      <div className="d-flex justify-content-center text-center w-100 bg-black text-white">
        <p className='copyright m-0'>Copyright @2025-2030 weplay.Todos los derechos reservados</p>
      </div>
    </footer>
  );
};
