;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Slideshow = factory();
  }

})(this, function() {

  'use strict';

  function Slideshow(el, options) {

    if (!el || !el.nodeType || el.nodeType !== 1) {
      throw new Error('SLIDESHOW ERROR - invalid element passed as first argument!');
    }

    //--- Default settings ---//
    this.settings = {
      allowSwipe: true,
      autoplay: false,
      controlsBelow: false,
      delay: 5000,
      loopSlides: true,
      navArrows: true,
      navNextClass: '',
      navPrevClass: '',
      playButton: false,
      playButtonClass: '',
      playLoop: -1,
      pauseOnUserNav: false,
      showIndicators: false,
      slideshowEl: el,
      startOnSlide: 1,
      transitionTime: 500,
      transitionTimingFunction: 'ease-out',
      transitionEffect: 'fade'
    };

    //--- Merge user options and default settings ---//
    for (let prop in options) {
      if (this.settings.hasOwnProperty(prop)) {
        this.settings[prop] = options[prop];
      }
    }

    this.init();

  }



  Slideshow.prototype.changeSlide = function(transitionTo, loopSlides) {
    if (!this.inTransition) {
      this.inTransition = true;

      let transitionFrom = this.currentSlide;
      let nextSlide = this.nextSlide;
      let prevSlide = this.prevSlide;
      let userTrigger = isFinite(transitionTo);
      let loopsRemaining = this.loopsRemaining;

      transitionTo = userTrigger ? transitionTo : nextSlide;
      loopSlides = loopSlides !== undefined ? loopSlides : this.settings.loopSlides;

      this.currentSlide = transitionTo;
      this.nextSlide = transitionTo === this.numSlides ? 1 : transitionTo + 1;
      this.prevSlide = transitionTo === 1 ? this.numSlides : transitionTo - 1;

      //--- Reset interval if user triggered slide change ---//
      if (userTrigger && this.intervalID !== null) {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(this.changeSlide.bind(this), this.settings.delay);
      }

      if (loopsRemaining !== -1) {
        //--- Decrement loopsRemaining when transitioning from last slide to first if slideshow is not paused ---//
        if (this.intervalID !== null && transitionFrom === this.numSlides && loopsRemaining > 0 && !userTrigger) {
          this.loopsRemaining--;

        //--- Increment loopsRemaining if user navigates from first slide to last slide (using prev arrow) and loopsRemaining is zero ---//
        } else if (userTrigger && loopsRemaining === 0 && transitionFrom === 1 && transitionTo === this.numSlides) {
          this.loopsRemaining++;
        }
      }


      //--- Transition slides from transitionFrom to transitionTo --//
      this.slideList[transitionFrom - this.slideIndexOffset].classList.remove('slideshow-current');
      this.slideList[transitionTo - this.slideIndexOffset].classList.add('slideshow-current');

      if (this.settings.transitionEffect === 'slide') {
        let slideToShow = transitionTo;
        let lastToFirst = transitionTo === 1 && transitionFrom === this.numSlides;
        let firstToLast = transitionTo === this.numSlides && transitionFrom === 1;

        if (loopSlides && (lastToFirst || firstToLast)) {
          slideToShow = transitionTo === 1 ? this.numSlides + 1 : 0;
          this.slideIsClone = true;
        }

        this.slideListEl.style.transition = this.transitionStyle;
        this.slideListEl.style.transform = `translateX(-${this.slideList[slideToShow - this.slideIndexOffset].offsetLeft}px)`;
      } else {
        this.slideList[transitionFrom - this.slideIndexOffset].style.opacity = 0;
        this.slideList[transitionTo - this.slideIndexOffset].style.opacity = 1;
      }

      //--- Change current indicator button to transitionTo ---//
      if (this.indicatorBtns) {
        this.indicatorBtns[transitionFrom - 1].classList.remove('slideshow-current');
        this.indicatorBtns[transitionTo - 1].classList.add('slideshow-current');
        this.numberIndicator.value = transitionTo;
      }

      //--- Stop the loop if user set loop count and it has been reached ---//
      if (this.intervalID !== null && transitionTo === this.numSlides && (loopsRemaining === 0 || loopsRemaining === null)) {
        this.loopsRemaining = this.settings.playLoop === 0 ? null : this.settings.playLoop;
        this.pauseSlideshow();
      }

      setTimeout(() => {
        this.transitionEnd();
      }, this.settings.transitionTime);
    }
  };




  //--- http://detectmobilebrowsers.com/ ---//
  Slideshow.prototype.checkMobile = function() {
    let a = navigator.userAgent || navigator.vendor || window.opera;

    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
  };




  Slideshow.prototype.createEl = function(parent, nodeName, propsObj, evtListener) {
    let el = document.createElement(nodeName);

    for (let key in propsObj) {
      if (propsObj.hasOwnProperty(key)) {
        el.setAttribute(key,propsObj[key]);
      }
    }

    parent.appendChild(el);

    if (evtListener) {
      el.addEventListener(evtListener.event, evtListener.fn);
    }

    return el;
  };




  Slideshow.prototype.debounce = function(fn, wait, immediate) {
    let timeout;

    return function() {

      let context = this;
      let args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) {
          fn.apply(context, args);
        }
      };

      let callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        fn.apply(context, args);
      }
    };
  };




  Slideshow.prototype.handleSwipe = function(dir) {
    if (dir !== 0) {
      let transitionTo;

      switch (this.currentSlide + dir) {
        case 0:
          transitionTo = this.numSlides;
          break;
        case this.numSlides + 1:
          transitionTo = 1;
          break;
        default:
          transitionTo = this.currentSlide + dir;
      }

      this.changeSlide(transitionTo);
    }
  };




  Slideshow.prototype.handleSwipeEnd = function(e) {
    let eventObj = this.isMobile ? e.changedTouches[0] : e;
    let info = this.swipeInfo;

    info.distX = eventObj.pageX - info.startX;
    info.distY = eventObj.pageY - info.startY;
    info.elapsedTime = new Date().getTime() - info.startTime;

    if (info.elapsedTime <= info.allowedTime && Math.abs(info.distX) >= info.threshold && Math.abs(info.distY) <= info.restraint) {
      info.dir = info.distX < 0 ? 1 : -1;
      this.handleSwipe(info.dir);
    }
  };




  Slideshow.prototype.handleSwipeStart = function(e) {
    let eventObj = this.isMobile ? e.changedTouches[0] : e;
    let info = this.swipeInfo;

    info.dir = 0;
    info.dist = 0;
    info.startX = eventObj.pageX;
    info.startY = eventObj.pageY;
    info.startTime = new Date().getTime();
  };




  Slideshow.prototype.indicatorHandler = function(e) {
    e.preventDefault();

    let transitionTo = parseInt(e.target.getAttribute('data-slide'),10);
    transitionTo = transitionTo > 0 && transitionTo <= this.numSlides ? transitionTo : null;
    if (transitionTo && transitionTo !== this.currentSlide) {
      if (this.settings.pauseOnUserNav) {
        this.pauseSlideshow();
      }

      this.changeSlide(transitionTo, false);
    }
  };




  Slideshow.prototype.init = function() {
    let settings = this.settings;
    let slideshowEl = settings.slideshowEl;
    let btnLocation = settings.controlsBelow ? 'slideshow-bottom ' : '';
    let slideListEl = slideshowEl.querySelector('.slideshow-slide-list');
    let btnClass;

    if (settings.controlsBelow || settings.showIndicators) {
      slideshowEl.classList.add('slideshow-padding');
    }

    this.isMobile = this.checkMobile();
    this.eventTrigger = this.isMobile ? 'touchstart' : 'click';

    //--- Create nav arrows ---//
    if (settings.navArrows) {
      btnClass = (`slideshow-nav-btn slideshow-prev ${btnLocation + settings.navPrevClass}`).trim();
      this.navPrev = this.createEl(slideshowEl, 'button', {'class': btnClass, 'aria-label': 'previous'}, {'event': this.eventTrigger, fn: this.navHandler.bind(this)});

      btnClass = (`slideshow-nav-btn slideshow-next ${btnLocation + settings.navNextClass}`).trim();
      this.navNext = this.createEl(slideshowEl, 'button', {'class': btnClass, 'aria-label': 'next'}, {'event': this.eventTrigger, fn: this.navHandler.bind(this)});

      if(!settings.controlsBelow) {
        let navPosition = (slideListEl.clientHeight - this.navNext.clientHeight)/2;
        this.navNext.style.top = `${navPosition}px`;
        this.navPrev.style.top = `${navPosition}px`;
      }
    }

    //--- Create pause/play button ---//
    if (settings.playButton) {
      btnClass = (`slideshow-play-btn ${(settings.autoplay === false ? 'slideshow-paused ' : '') + btnLocation + settings.playButtonClass}`).trim().replace(/\s+/g, ' ');
      this.playButton = this.createEl(slideshowEl, 'button', {'class': btnClass, 'aria-label': 'play'}, {'event': this.eventTrigger, fn: this.playHandler.bind(this)});
    }

    this.slideList = slideshowEl.getElementsByClassName('slideshow-slide');
    this.numSlides = this.slideList.length;

    //--- Create slide indicators ---//
    if (settings.showIndicators) {
      this.indicators = this.createEl(slideshowEl, 'ul', { class: 'slideshow-indicators', 'aria-label': 'current slide' });
      this.indicatorBtns = [];

      let indicatorEl;
      indicatorEl = this.createEl(this.indicators, 'li', { class: 'slideshow-indicator slideshow-number-indicator' });
      indicatorEl.innerHTML = `Slide <input class="slideshow-slide-number"> of ${this.numSlides}`;
      this.numberIndicator = slideshowEl.querySelector('.slideshow-slide-number');

      for (let i = 0; i < this.numSlides; i++) {
        indicatorEl = this.createEl(this.indicators, 'li', { class: 'slideshow-indicator slideshow-dot-indicator' });
        this.indicatorBtns[i] = this.createEl(indicatorEl, 'button', { class: 'slideshow-indicator-btn', 'data-slide': i + 1 });
      }

      this.indicatorsWidth = this.indicators.clientWidth;
      this.setIndicatorType();

      if (!settings.controlsBelow) {
        this.indicators.style.left = '50%';
        this.indicators.style.transform = 'translateX(-50%)';
      } else {
        this.indicators.style.right = '0px';
      }
    }

    this.currentSlide = settings.startOnSlide > 0 && settings.startOnSlide < this.numSlides ? settings.startOnSlide : 1;
    this.nextSlide = this.currentSlide + 1 < this.numSlides ? this.currentSlide + 1 : 0;
    this.prevSlide = this.currentSlide - 1 > 0 ? this.currentSlide - 1 : this.numSlides;

    this.slideIndexOffset = settings.transitionEffect !== 'slide' || (settings.transitionEffect === 'slide' && !settings.loopSlides) ? 1 : 0;

    this.slideList[this.currentSlide - this.slideIndexOffset].classList.add('slideshow-current');

    //--- Set transition properties ---//
    this.transitionStyle = `${settings.transitionEffect === 'fade' ? 'opacity' : 'transform'} ${(settings.transitionTime)/1000.0}s ${settings.transitionTimingFunction}`;
    this.inTransition = false;

    //--- Create clone of first and last slide ---//
    if (settings.transitionEffect === 'slide') {
      this.slideListEl = slideListEl;
      this.slideListEl.classList.add('slideshow-float');

      if (settings.loopSlides) {
        let cloneFirst = this.slideList[0].cloneNode(true);
        let cloneLast = this.slideList[this.numSlides - 1].cloneNode(true);

        this.slideListEl.appendChild(cloneFirst);
        this.slideListEl.insertBefore(cloneLast, this.slideList[0]);
      }

      this.setSlideWidth();

    //--- Set opacity on slides and transition effect ---//
    } else {
      for (let j = 0; j < this.numSlides; j++) {
        if (j === settings.startOnSlide - 1) {
          this.slideList[j].style.opacity = 1;
        } else {
          this.slideList[j].style.opacity = 0;
        }
      }

      setTimeout(function() {
        for (let j = 0; j < this.numSlides; j++) {
          if (settings.transitionEffect) {
            this.slideList[j].style.transition = this.transitionStyle;
          }
        }
      }.bind(this), 0);
    }

    this.loopsRemaining = settings.playLoop === 0 ? null : settings.playLoop - 1;

    if (settings.delay <= settings.transitionTime) {
      this.settings.delay = settings.transitionTime + 10;
    }

    //--- Register event listeners ---//
    let resizeFn = () => {
      if (this.settings.transitionEffect === 'slide') {
        this.setSlideWidth();
      }

      if (this.settings.showIndicators) {
        this.setIndicatorType();
      }
    };
    let debouncedResize = this.debounce(resizeFn,200);
    window.addEventListener('resize', debouncedResize);

    if (settings.showIndicators) {
      this.indicators.addEventListener(this.eventTrigger, this.indicatorHandler.bind(this));
      this.indicatorBtns[this.currentSlide - 1].classList.add('slideshow-current');

      this.numberIndicator.value = this.currentSlide;
      this.numberIndicator.addEventListener('change', this.numberIndicatorHandler.bind(this));
    }

    if (settings.allowSwipe) {
      this.swipeInfo = {
        dir: 0,
        startX: null,
        startY: null,
        distX: null,
        distY: null,
        threshold: 150,
        restraint: 100,
        allowedTime: 500,
        elapsedTime: null,
        startTime: null
      };

      slideListEl.addEventListener(this.isMobile ? 'touchstart' : 'mousedown', this.handleSwipeStart.bind(this));
      slideListEl.addEventListener(this.isMobile ? 'touchend' : 'mouseup', this.handleSwipeEnd.bind(this));
    }

    //--- If autoplay is set to true, play slideshow ---//
    if (settings.autoplay) {
      this.playSlideshow();
    } else {
      this.intervalID = null;
    }
  };



  Slideshow.prototype.navHandler = function(e) {
    e.preventDefault();

    let currentSlide = this.currentSlide;
    let transitionTo;

    if (e.target === this.navNext) {
      transitionTo = currentSlide === this.numSlides ? 1 : currentSlide + 1;
    } else {
      transitionTo = currentSlide > 1 ? currentSlide - 1 : this.numSlides;
    }

    if (this.settings.pauseOnUserNav) {
      this.pauseSlideshow();
    }

    this.changeSlide(transitionTo, this.settings.loopSlides);
  };




  Slideshow.prototype.numberIndicatorHandler = function() {
    let slide = parseInt(this.numberIndicator.value, 10);
    if (slide > 0 && slide <= this.numSlides && slide !== this.currentSlide) {
      if (this.settings.pauseOnUserNav) {
        this.pauseSlideshow();
      }
      this.changeSlide(slide, false);
    } else {
      this.numberIndicator.value = this.currentSlide;
    }
  };




  Slideshow.prototype.pauseSlideshow = function() {
    clearInterval(this.intervalID);
    this.intervalID = null;

    if (this.playButton) {
      this.playButton.classList.add('slideshow-paused');
    }
  };




  Slideshow.prototype.playHandler = function(e) {
    e.preventDefault();

    if (this.intervalID) {
      this.pauseSlideshow();
    } else {
      this.playSlideshow();
    }
  };




  Slideshow.prototype.playSlideshow = function() {
    this.intervalID = setInterval(this.changeSlide.bind(this), this.settings.delay);

    if (this.playButton) {
      this.playButton.classList.remove('slideshow-paused');
    }
  };




  Slideshow.prototype.setIndicatorType = function() {
    let navBtns = this.navNext ? (this.navNext.clientWidth + this.navPrev.clientWidth) : 0;
    let playBtn = this.playButton ? this.playButton.clientWidth : 0;
    let controlsWidth = this.settings.controlsBelow ?  (navBtns + playBtn) : 0;

    if (this.settings.slideshowEl.clientWidth - controlsWidth < this.indicatorsWidth) {
      this.indicators.classList.add('slideshow-show-number');
    } else {
      this.indicators.classList.remove('slideshow-show-number');
    }
  };




  Slideshow.prototype.setSlideWidth = function() {
    let numSlides = this.settings.loopSlides ? this.numSlides + 2 : this.numSlides;
    let containerWidth = this.settings.slideshowEl.clientWidth;

    for (let i = 0; i < numSlides; i++) {
      this.slideList[i].style.width = `${containerWidth}px`;
    }

    this.slideListEl.style.width = `${containerWidth * numSlides}px`;
    this.slideListEl.style.transform = `translateX(-${this.slideList[this.currentSlide - this.slideIndexOffset].offsetLeft}px)`;
  };




  Slideshow.prototype.transitionEnd = function() {
    if (this.inTransition) {
      if (this.settings.transitionEffect === 'slide') {
        this.slideListEl.style.transition = null;

        if (this.slideIsClone) {
          this.slideListEl.style.transform = `translateX(-${this.slideList[this.currentSlide].offsetLeft}px)`;
          this.slideIsClone = false;
        }
      }

      this.inTransition = false;
    }
  };




  return function(el, options) {
    return new Slideshow(el, options);
  };

});