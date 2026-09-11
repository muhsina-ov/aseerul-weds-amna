/**
 * Wedding Royale Interactive Controller
 * Aseerul & Aleena Digital Wedding Invitation
 */

(function () {
  'use strict';

  // DOM Elements
  var overlay    = document.getElementById('weiOverlay');
  var videoWrap  = document.getElementById('weiVideoWrap');
  var video      = document.getElementById('weiVideo');
  var audio      = document.getElementById('weiAudio');
  var audioBtn   = document.getElementById('weiAudioBtn');
  var iconPause  = document.getElementById('weiIconPause');
  var iconPlay   = document.getElementById('weiIconPlay');
  var done       = false;

  // Start Wax Seal Unsealing Sequence
  function startVideo() {
    if (done) return;
    done = true;

    // Fade out envelope image
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 1200);
    }

    // Play unsealing video & background music
    if (videoWrap && video) {
      videoWrap.classList.add('wei-video-in');
      var vp = video.play();
      if (vp && vp.catch) {
        vp.catch(function () {
          // If video autoplay fails, gracefully skip to invitation
          endSequence();
        });
      }
    } else {
      endSequence();
    }

    if (audio) {
      audio.volume = 0.85;
      var ap = audio.play();
      if (ap && ap.catch) ap.catch(function () {});
    }
  }

  // End Wax Seal Video and Reveal Floating Controls
  function endSequence() {
    if (videoWrap) {
      videoWrap.classList.remove('wei-video-in');
      videoWrap.classList.add('wei-video-out');
      setTimeout(function () {
        videoWrap.style.display = 'none';
      }, 1200);
    }

    // Show floating audio button
    if (audioBtn) {
      audioBtn.style.visibility = 'visible';
      audioBtn.style.opacity = '1';
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startVideo);
    overlay.addEventListener('touchstart', startVideo, { passive: true });
  }

  if (video) {
    // Fade video 0.8s before it ends
    video.addEventListener('timeupdate', function () {
      if (video.duration && video.currentTime >= video.duration - 0.8 && !video.dataset.fading) {
        video.dataset.fading = '1';
        endSequence();
      }
    });

    video.addEventListener('ended', function () {
      endSequence();
    });

    // Safety fallback: if video has not finished in 9 seconds, auto end
    setTimeout(function () {
      if (done && videoWrap && videoWrap.style.display !== 'none') {
        endSequence();
      }
    }, 9000);
  }

  // Audio button toggle
  if (audioBtn && audio) {
    audioBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function() {
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        }).catch(function(){});
      } else {
        audio.pause();
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
      }
    });
  }

  // --------------------------------------------------------------------------
  // COUNTDOWN TIMER
  // --------------------------------------------------------------------------
  function initCountdown() {
    var timerContainer = document.querySelector('[data-countdown-target]');
    if (!timerContainer) return;

    var targetStr = timerContainer.getAttribute('data-countdown-target');
    var targetDate = new Date(targetStr).getTime();

    var daysEl = document.getElementById('cdDays');
    var hoursEl = document.getElementById('cdHours');
    var minsEl = document.getElementById('cdMins');
    var secsEl = document.getElementById('cdSecs');

    function update() {
      var now = new Date().getTime();
      var diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
      if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
      if (minsEl) minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (secsEl) secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    update();
    setInterval(update, 1000);
  }

  // --------------------------------------------------------------------------
  // SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    var elements = document.querySelectorAll('.fade-in-on-scroll');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // --------------------------------------------------------------------------
  // PAGE SUITE NAVIGATION & ACTIVE PILL SYNC
  // --------------------------------------------------------------------------
  function initPageSuiteNav() {
    var pills = document.querySelectorAll('.suite-nav-pill');
    var pages = document.querySelectorAll('.invitation-page-sheet');
    if (!pills.length || !pages.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        var targetId = pill.getAttribute('data-target');
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          pills.forEach(function (p) { p.classList.remove('active'); });
          pill.classList.add('active');
        }
      });
    });

    // Sync active pill on scroll
    if ('IntersectionObserver' in window) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            pills.forEach(function (p) {
              if (p.getAttribute('data-target') === id) {
                p.classList.add('active');
              } else {
                p.classList.remove('active');
              }
            });
          }
        });
      }, { threshold: 0.4 });

      pages.forEach(function (page) {
        navObserver.observe(page);
      });
    }
  }

  // --------------------------------------------------------------------------
  // CALENDAR ADD EVENT HELPERS
  // --------------------------------------------------------------------------
  function createGoogleCalendarUrl(title, details, location, startISO, endISO) {
    var s = startISO.replace(/-|:|\.\d\d\d/g, '');
    var e = endISO.replace(/-|:|\.\d\d\d/g, '');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(title) +
      '&dates=' + encodeURIComponent(s + '/' + e) +
      '&details=' + encodeURIComponent(details) +
      '&location=' + encodeURIComponent(location);
  }

  window.addBaratToCalendar = function () {
    var url = createGoogleCalendarUrl(
      'Barat of Aseerul | Aseerul & Aleena Wedding',
      'Accompany the barat of Aseerul from Our Residence - Syed Shah maroof House to MNK Lawn, Lucknow.',
      'MNK Lawn, Lucknow',
      '20261107T083000Z',
      '20261107T133000Z'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  window.addManjhaToCalendar = function () {
    var url = createGoogleCalendarUrl(
      'Manjha Ceremony of Aseerul | Aseerul & Aleena Wedding',
      'We warmly invite you to share in our joy at the manjha ceremony for our dear brother Aseerul. Warm Regards - Zoya, Iqra & Zara.',
      'Galaxy Banquet & Lawn, behind Honda Dealership, Gulhariya, Gorakhpur',
      '20261106T133000Z',
      '20261106T173000Z'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  window.addWalimaToCalendar = function () {
    var url = createGoogleCalendarUrl(
      'Walima Dinner Reception: Aseerul & Aleena',
      'We are delighted to invite you for the walima dinner reception of our beloved son Aseerul with Aleena. Dinner: 8:00 PM Onwards. Venue: Harsh Vatika, Gorakhpur.',
      'Harsh Vatika, Taramandal Road, Near Zoo, Deoria Bypass Road, Gorakhpur',
      '20261110T143000Z',
      '20261110T183000Z'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Initialize once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    initCountdown();
    initScrollReveal();
    initPageSuiteNav();
  });

})();

