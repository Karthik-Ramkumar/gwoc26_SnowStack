import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import studioHeaderBg from '../images/gallery/studio_header.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import './Studio.css';
import 'aframe';

const API_BASE_URL = '/api';

function Studio() {
  const [showTour, setShowTour] = useState(false);
  const [exhibitions, setExhibitions] = useState([]);
  const [pastPopups, setPastPopups] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [tourSettings, setTourSettings] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Refs for custom navigation
  const popupsPrevRef = useRef(null);
  const popupsNextRef = useRef(null);
  const galleryPrevRef = useRef(null);
  const galleryNextRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exhibitionsRes, popupsRes, galleryRes, tourRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/studio/exhibitions/`),
          axios.get(`${API_BASE_URL}/studio/past-popups/`),
          axios.get(`${API_BASE_URL}/studio/gallery/`),
          axios.get(`${API_BASE_URL}/studio/tour-settings/`)
        ]);

        setExhibitions(exhibitionsRes.data.results || exhibitionsRes.data);
        setPastPopups(popupsRes.data.results || popupsRes.data);
        setGalleryImages(galleryRes.data.results || galleryRes.data);
        setTourSettings(tourRes.data);
      } catch (error) {
        console.error('Error fetching studio data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePrevExhibition = () => {
    setCarouselIndex(prev =>
      prev === 0 ? Math.max(0, exhibitions.length - 1) : prev - 1
    );
  };

  const handleNextExhibition = () => {
    setCarouselIndex(prev =>
      prev === exhibitions.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCardPosition = (index) => {
    if (index === carouselIndex) return 'center';
    if (index === carouselIndex - 1 || (carouselIndex === 0 && index === exhibitions.length - 1)) return 'side left';
    if (index === carouselIndex + 1 || (carouselIndex === exhibitions.length - 1 && index === 0)) return 'side right';
    return 'hidden';
  };

  return (
    <div className="studio-page">
      {/* ================= HERO SECTION ================= */}
      <header className="studio-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url('/static/images/gallery/studiobg1.jpg')" }}>
        <div className="studio-hero-content">
          <h1>The Studio</h1>
          <p>
            A quiet space for slow craft and shared making. Here, clay takes form through
            patience and intention — each piece shaped by hand, guided by tradition,
            and imbued with the spirit of mindful creation.
          </p>
        </div>
      </header>

      {/* ================= LOCATION SECTION ================= */}
      <section
        className="studio-location"
        style={{ backgroundImage: "url('/static/images/gallery/visitus.png')" }}
      >
        <div className="studio-location-container">
          <div className="studio-address">
            <h2>Visit Us</h2>
            <div className="studio-address-text">
              <span>Silent Zone, Opp. Airport</span>
              <span>R.S. No. 811 Paikee, Plot No. 311</span>
              <span>Surat–Dumas Road</span>
              <span>Surat, Gujarat</span>
            </div>
            <a
              href="https://maps.google.com/maps?q=21.130000,72.724000"
              target="_blank"
              rel="noopener noreferrer"
              className="studio-directions-btn"
            >
              Get Directions →
            </a>

            <button
              className="studio-tour-btn"
              onClick={() => setShowTour(true)}
            >
              360° VIRTUAL STUDIO TOUR
            </button>
          </div>
          <div className="studio-map-wrapper">
            <iframe
              src="https://maps.google.com/maps?q=21.130000,72.724000&hl=en&z=14&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Basho Studio Location"
            />
          </div>
        </div>
      </section>

      {/* ================= 360 TOUR OVERLAY ================= */}
      {showTour && (
        <div className="tour-overlay">
          <button
            className="tour-close-btn"
            onClick={() => setShowTour(false)}
          >
            Close 360° View
          </button>
          <a-scene embedded style={{ width: '100%', height: '100%' }}>
            <a-assets>
              <img id="sky360" src={tourSettings?.image_url || `${process.env.PUBLIC_URL || ''}/images/gallery/36.png`} crossOrigin="anonymous" alt="360 view" />
            </a-assets>
            <a-sky src="#sky360" rotation="0 -130 0"></a-sky>
            <a-camera position="0 0 0" look-controls="enabled: true; touchEnabled: true"></a-camera>
          </a-scene>
        </div>
      )}

      {/* ================= STUDIO DETAILS (Visit & Policies) ================= */}
      <section
        className="studio-info-section alt-bg"
        style={{ backgroundImage: "url('/static/images/gallery/vstd.png')" }}
      >
        <div className="studio-info-container">
          <div className="studio-info-grid">
            <div className="info-column">
              <h2>Visit & Collection</h2>
              <ul className="studio-info-list">
                <li>Studio visits are by prior appointment only</li>
                <li>Collections can be viewed and purchased directly from the studio</li>
                <li>Custom orders may be discussed during visits</li>
                <li>Studio pickups are available for confirmed orders</li>
                <li>Visitors are encouraged to take their time and engage with the process</li>
              </ul>
            </div>
            <div className="info-column">
              <h2>Studio Policies</h2>
              <ul className="studio-info-list">
                <li>Visits and workshops require prior confirmation</li>
                <li>Clay pieces are handcrafted; natural variations are part of the process</li>
                <li>No refunds on custom-made orders once production begins</li>
                <li>Handle pieces with care during studio visits</li>
                <li>Photography is allowed unless otherwise specified</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UPCOMING EXHIBITIONS ================= */}
      <section className="studio-exhibitions">
        <h2>Upcoming Pop-ups & Exhibitions</h2>

        {exhibitions.length > 0 ? (
          <>
            <div className="carousel-container">
              <div className="carousel-track">
                {exhibitions.map((exhibition, index) => {
                  const position = getCardPosition(index);
                  if (position === 'hidden') return null;

                  return (
                    <div
                      key={exhibition.id}
                      className={`carousel-card ${position}`}
                    >
                      {exhibition.image_url && (
                        <img
                          src={exhibition.image_url}
                          alt={exhibition.title}
                          className="carousel-card-image"
                        />
                      )}
                      <div className="carousel-card-content">
                        <h3>{exhibition.title}</h3>
                        <div className="location">{exhibition.location}</div>
                        <div className="dates">
                          {formatDate(exhibition.start_date)} — {formatDate(exhibition.end_date)}
                        </div>
                        <p>{exhibition.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {exhibitions.length > 1 && (
              <div className="carousel-nav">
                <button
                  className="carousel-btn"
                  onClick={handlePrevExhibition}
                  aria-label="Previous exhibition"
                >
                  ←
                </button>
                <button
                  className="carousel-btn"
                  onClick={handleNextExhibition}
                  aria-label="Next exhibition"
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="carousel-placeholder">
            <p>No upcoming exhibitions at the moment. Check back soon for new events.</p>
          </div>
        )}
      </section>

      {/* ================= PAST POP-UPS - SWIPER CAROUSEL ================= */}
      {pastPopups.length > 0 && (
        <section className="studio-past-popups">
          <h2>Past Pop-up Showcases</h2>
          <div className="swiper-carousel-wrapper">
            {/* Custom Navigation Arrows */}
            <button
              ref={popupsPrevRef}
              className="swiper-nav-btn swiper-nav-prev"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
            <button
              ref={popupsNextRef}
              className="swiper-nav-btn swiper-nav-next"
              aria-label="Next slide"
            >
              <ChevronRight size={24} strokeWidth={2} />
            </button>

            <Swiper
              modules={[FreeMode, Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1.2}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              freeMode={{
                enabled: true,
                sticky: false,
                momentumRatio: 0.5
              }}
              speed={800}
              navigation={{
                prevEl: popupsPrevRef.current,
                nextEl: popupsNextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = popupsPrevRef.current;
                swiper.params.navigation.nextEl = popupsNextRef.current;
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3.5,
                  spaceBetween: 30,
                },
              }}
              className="past-popups-swiper"
            >
              {pastPopups.map(popup => (
                <SwiperSlide key={popup.id}>
                  <div className="popup-slide-card">
                    {popup.image_url ? (
                      <img src={popup.image_url} alt={popup.event_name} />
                    ) : (
                      <div className="popup-placeholder">
                        <span>{popup.event_name}</span>
                      </div>
                    )}
                    <div className="popup-slide-overlay">
                      <h4>{popup.event_name}</h4>
                      <span>{popup.city}, {popup.year}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ================= EVENT GALLERY - SWIPER CAROUSEL ================= */}
      {galleryImages.length > 0 && (
        <section className="studio-gallery">
          <h2>Event Gallery</h2>
          <div className="swiper-carousel-wrapper gallery-carousel">
            {/* Custom Navigation Arrows */}
            <button
              ref={galleryPrevRef}
              className="swiper-nav-btn swiper-nav-prev gallery-nav"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
            <button
              ref={galleryNextRef}
              className="swiper-nav-btn swiper-nav-next gallery-nav"
              aria-label="Next slide"
            >
              <ChevronRight size={24} strokeWidth={2} />
            </button>

            <Swiper
              modules={[FreeMode, Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1.2}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              freeMode={{
                enabled: true,
                sticky: false,
                momentumRatio: 0.5
              }}
              speed={800}
              navigation={{
                prevEl: galleryPrevRef.current,
                nextEl: galleryNextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = galleryPrevRef.current;
                swiper.params.navigation.nextEl = galleryNextRef.current;
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3.5,
                  spaceBetween: 30,
                },
              }}
              className="gallery-swiper"
            >
              {galleryImages.map(image => (
                <SwiperSlide key={image.id}>
                  <div
                    className="gallery-slide-item"
                    onClick={() => setLightboxImage(image.image_url)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Gallery image'}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ================= LIGHTBOX ================= */}
      <div
        className={`lightbox-overlay ${lightboxImage ? 'active' : ''}`}
        onClick={() => setLightboxImage(null)}
      >
        <button
          className="lightbox-close"
          onClick={() => setLightboxImage(null)}
          aria-label="Close lightbox"
        >
          ×
        </button>
        {lightboxImage && (
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImage} alt="Gallery enlarged" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Studio;
