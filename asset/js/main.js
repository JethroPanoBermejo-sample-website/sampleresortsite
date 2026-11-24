document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.js-open-booking');
  const closeModalBtn = document.querySelector('.modal-close-btn');
  const bookingForm = document.getElementById('bookingForm');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('is-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('is-open')) {
          siteNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (
        siteNav.classList.contains('is-open') &&
        !siteNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const searchForm = document.querySelector('.js-search-form');

  if (searchForm && bookingModal) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sCheckin = document.getElementById('searchCheckin')?.value;
      const sCheckout = document.getElementById('searchCheckout')?.value;
      const sGuests = document.getElementById('searchGuests')?.value;
      const sRoom = document.getElementById('searchRoom')?.value;

      if (sCheckin && document.getElementById('checkin')) {
        document.getElementById('checkin').value = sCheckin;
      }
      if (sCheckout && document.getElementById('checkout')) {
        document.getElementById('checkout').value = sCheckout;
      }
      if (sGuests && document.getElementById('guests')) {
        document.getElementById('guests').value = sGuests;
      }
      if (sRoom && document.getElementById('roomType')) {
        document.getElementById('roomType').value = sRoom;
      }

      bookingModal.showModal();
    });
  }

  if (bookingModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedRoom = btn.getAttribute('data-room');
        if (selectedRoom && document.getElementById('roomType')) {
          document.getElementById('roomType').value = selectedRoom;
        }
        bookingModal.showModal();
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        bookingModal.close();
      });
    }

    bookingModal.addEventListener('click', (e) => {
      const rect = bookingModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        bookingModal.close();
      }
    });

    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const guests = document.getElementById('guests').value;
        const roomType = document.getElementById('roomType').value;

        alert(`Thank you for choosing Holiday AngJet Resort!\n\nBooking Request Received:\n• Room: ${roomType}\n• Check-in: ${checkin || 'Not specified'}\n• Check-out: ${checkout || 'Not specified'}\n• Guests: ${guests}\n\nOur concierge will contact you shortly.`);
        bookingModal.close();
        bookingForm.reset();
      });
    }
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value;
      const topic = document.getElementById('contactTopic')?.value;
      alert(`Thank you, ${name || 'Guest'}!\n\nYour message regarding "${topic}" has been transmitted to the Holiday AngJet Resort concierge desk.\nWe will respond promptly.`);
      contactForm.reset();
    });
  }

  const cottageTabs = document.querySelectorAll('.cottage-tab');
  const cottageCards = document.querySelectorAll('.cottage-card');

  if (cottageTabs.length > 0) {
    cottageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        cottageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.getAttribute('data-category');
        cottageCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  const promoVideo = document.getElementById('resortPromoVideo');
  const playBtn = document.getElementById('explorePlayBtn');
  const videoCard = document.getElementById('exploreVideoCard');
  const chapterItems = document.querySelectorAll('.explore-menu-item');

  if (promoVideo && playBtn && videoCard) {
    const playIcon = playBtn.querySelector('.icon-play');
    const pauseIcon = playBtn.querySelector('.icon-pause');
    let hideTimer = null;

    const hideControlsAfterDelay = () => {
      clearTimeout(hideTimer);
      if (!promoVideo.paused && !promoVideo.ended) {
        hideTimer = setTimeout(() => {
          videoCard.classList.remove('show-controls');
        }, 1500);
      }
    };

    const showControlsBriefly = () => {
      videoCard.classList.add('show-controls');
      hideControlsAfterDelay();
    };

    const updatePlayState = (isPlaying) => {
      if (isPlaying) {
        videoCard.classList.add('is-playing');
        playBtn.classList.add('is-playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';

        hideControlsAfterDelay();
      } else {
        clearTimeout(hideTimer);
        videoCard.classList.remove('is-playing');
        videoCard.classList.add('show-controls');
        playBtn.classList.remove('is-playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    };

    const togglePlay = () => {
      if (promoVideo.paused || promoVideo.ended) {
        promoVideo.play().then(() => {
          updatePlayState(true);
        }).catch(err => {
          console.warn('Video play prevented:', err);
        });
      } else {
        promoVideo.pause();
        updatePlayState(false);
      }
    };

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    videoCard.addEventListener('click', (e) => {

      if (!e.target.closest('.explore-overlay-menu')) {
        togglePlay();
      }
    });

    videoCard.addEventListener('mousemove', () => {
      if (!promoVideo.paused && !promoVideo.ended) {
        showControlsBriefly();
      }
    });

    videoCard.addEventListener('mouseleave', () => {
      if (!promoVideo.paused && !promoVideo.ended) {
        clearTimeout(hideTimer);
        videoCard.classList.remove('show-controls');
      }
    });

    videoCard.addEventListener('touchstart', () => {
      if (!promoVideo.paused && !promoVideo.ended) {
        showControlsBriefly();
      }
    }, { passive: true });

    promoVideo.addEventListener('play', () => updatePlayState(true));
    promoVideo.addEventListener('pause', () => updatePlayState(false));
    promoVideo.addEventListener('ended', () => updatePlayState(false));

    chapterItems.forEach(item => {
      const btn = item.querySelector('.explore-menu-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetTime = parseFloat(item.getAttribute('data-time') || '0');

          chapterItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          if (promoVideo.duration && targetTime < promoVideo.duration) {
            promoVideo.currentTime = targetTime;
          } else if (promoVideo.duration) {

            const index = Array.from(chapterItems).indexOf(item);
            promoVideo.currentTime = (index / chapterItems.length) * promoVideo.duration;
          }

          if (promoVideo.paused) {
            promoVideo.play().then(() => updatePlayState(true)).catch(() => {});
          } else {
            showControlsBriefly();
          }
        });
      }
    });
  }

  const reviewsData = [
    {
      author: 'Esther Howard',
      role: 'Marketing Director • Verified Stay',
      avatar: './asset/images/avatar-esther.avif',
      text: '"From the moment we arrived via the private boat transfer, Holiday AngJet Resort exceeded every expectation. The serene lagoon views, exquisite sunset dining, and impeccable concierge care made our retreat truly unforgettable."'
    },
    {
      author: 'Marcus Vance',
      role: 'Architect & Travel Writer • 5-Night Stay',
      avatar: './asset/images/avatar-marcus.avif',
      text: '"The balance between pristine coastal wilderness and elevated luxury craftsmanship is breathtaking. The overwater boardwalk pavilions and crystal reef lagoon define sustainable hospitality at its absolute best."'
    },
    {
      author: 'Sophia Chen',
      role: 'Eco-Tourism Specialist • Verified Guest',
      avatar: './asset/images/avatar-sophia.avif',
      text: '"A transformative island sanctuary. Waking up to panoramic turquoise water, enjoying fresh organic cuisine, and knowing the resort runs on 100% clean solar microgrids made this our favorite tropical holiday."'
    }
  ];

  let currentReviewIdx = 0;
  const reviewCardBox = document.getElementById('reviewCardBox');
  const reviewAvatar = document.getElementById('reviewAvatar');
  const reviewAuthor = document.getElementById('reviewAuthor');
  const reviewRole = document.getElementById('reviewRole');
  const reviewText = document.getElementById('reviewText');
  const prevReviewBtn = document.getElementById('prevReviewBtn');
  const nextReviewBtn = document.getElementById('nextReviewBtn');

  const renderReview = (idx) => {
    if (!reviewCardBox || !reviewsData[idx]) return;
    reviewCardBox.style.opacity = '0';
    reviewCardBox.style.transform = 'translateY(-4px)';

    setTimeout(() => {
      const rev = reviewsData[idx];
      if (reviewAvatar) {
        reviewAvatar.src = rev.avatar;
        reviewAvatar.alt = rev.author;
      }
      if (reviewAuthor) reviewAuthor.textContent = rev.author;
      if (reviewRole) reviewRole.textContent = rev.role;
      if (reviewText) reviewText.textContent = rev.text;

      reviewCardBox.style.opacity = '1';
      reviewCardBox.style.transform = 'translateY(0)';
    }, 200);
  };

  if (prevReviewBtn) {
    prevReviewBtn.addEventListener('click', () => {
      currentReviewIdx = (currentReviewIdx - 1 + reviewsData.length) % reviewsData.length;
      renderReview(currentReviewIdx);
    });
  }

  if (nextReviewBtn) {
    nextReviewBtn.addEventListener('click', () => {
      currentReviewIdx = (currentReviewIdx + 1) % reviewsData.length;
      renderReview(currentReviewIdx);
    });
  }

  const offerSlides = document.querySelectorAll('.offer-slide');
  const offersPrevBtn = document.getElementById('offersPrevBtn');
  const offersNextBtn = document.getElementById('offersNextBtn');
  let currentOfferIdx = 0;

  const showOfferSlide = (idx) => {
    if (!offerSlides.length) return;
    offerSlides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === idx) {
        slide.classList.add('active');
      }
    });
  };

  if (offersPrevBtn && offersNextBtn && offerSlides.length > 0) {
    offersPrevBtn.addEventListener('click', () => {
      currentOfferIdx = (currentOfferIdx - 1 + offerSlides.length) % offerSlides.length;
      showOfferSlide(currentOfferIdx);
    });

    offersNextBtn.addEventListener('click', () => {
      currentOfferIdx = (currentOfferIdx + 1) % offerSlides.length;
      showOfferSlide(currentOfferIdx);
    });
  }
});
