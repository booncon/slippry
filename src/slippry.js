/**
 * slippry v0.96 - Simple responsive content slider
 * http://slippry.com
 *
 * Author(s): Lukas Jakob Hafner - @saftsaak 
 *
 * Copyright 2013, booncon oy - http://booncon.com
 *
 * Thanks @ http://bxslider.com for the inspiration!
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

(function ($) {
  "use strict";
  var defaults;

  defaults = {
    // general elements & wrapper
    slippryWrapper: '<div class="slippry_box" />', // wrapper to wrap everything, including pager
    slideWrapper: '<div class="slide_box" />', // wrapper to wrap sildes & controls
    boxClass: 'slippry_list', // class that goes to original element
    elements: 'li', // elments cointaining slide content
    activeClass: 'active', // class for current slide
    fillerClass: 'filler', // class for element that acts as intrinsic placholder
    loadingClass: 'loading',

    // options
    adaptHeight: true, // height of the sliders adapts to current slide
    start: 1, // num (starting from 1), random
    loop: true, // first -> last & last -> first arrows
    captions: 'overlay', // Position: overlay, below, custom, false
    captionsClass: 'caption',
    initSingle: true, // initialise even if there is only one slide
    responsive: true,

    // pager
    usePager: true,
    pagerClass: 'pager',

    // controls
    useControls: true,
    controlClass: 'controls',
    prevClass: 'slip_prev',
    prevText: 'Previous',
    nextClass: 'slip_next',
    nextText: 'Next',
    hideOnEnd: true,

    // transitions
    transition: 'horizontal', // fade, horizontal, kenburns, false
    kenZoom: 1.4,
    slideMargin: 0, // spacing between slides (in %)
    transClass: 'transition',
    transTime: 1200, // time the transition takes (ms)
    transEase: 'swing', // easing to use in the animation
    continuous: true, // seamless first/ last transistion, only works with loop
    useCSS: true, // true, false -> fallback to js if no browser support

    //slideshow
    auto: true,
    autoDirection: 'next',
    autoHover: true,
    autoHoverDelay: 100,
    autoDelay: 500,
    pause: 3000,

    // callback functions
    onSliderLoad: function () { // before page transition starts
      return this;
    },
    onSlideBefore: function () { // before page transition starts
      return this;
    },
    onSlideAfter: function () {  // after page tarnsition happened
      return this;
    }
  };

  $.fn.slippry = function (options) {
    var slip, el, refresh, prepareFiller, setFillerProportions, init, updateCaption, initPager, initControls, ready,
      initCaptions, updatePager, doTransition, updateSlide, updateControls, updatePos, supports, preload, start;

    // reference to the object calling the function
    el = this;

    // if no elements just stop
    if (el.length === 0) {
      return this;
    }
    // support mutltiple elements
    if (el.length > 1) {
      el.each(function () {
        $(this).slippry(options);
      });
      return this;
    }

    // variable to access the slider settings across the plugin
    slip = {};
    slip.vars = {};

    supports = (function () {  // Thanks! http://net.tutsplus.com/tutorials/html-css-techniques/quick-tip-detect-css-support-in-browsers-with-javascript/
      var div = document.createElement('div'),
        vendors = ['Khtml', 'Ms', 'O', 'Moz', 'Webkit'],
        len = vendors.length;
      return function (prop) {
        if (prop in div.style) {
          return true;
        }
        prop = prop.replace(/^[a-z]/, function (val) {
          return val.toUpperCase();
        });
        while (len--) {
          if (vendors[len] + prop in div.style) {
            return true;
          }
        }
        return false;
      };
    }());

    ready = function () {
      if (slip.vars.fresh) {
        slip.vars.slippryWrapper.removeClass(slip.settings.loadingClass);
        slip.vars.fresh = false;
        if (slip.settings.auto) {
          el.startAuto();
        }
        slip.settings.onSliderLoad.call();
      } else {
        $('.' + slip.settings.fillerClass, slip.vars.slideWrapper).addClass('ready');
      }
      slip.settings.onSlideAfter.call(slip.vars.active);
    };

    // sets the aspect ratio of the filler element
    setFillerProportions = function ($slide) {
      var width, height, ratio, p_top, $filler;
      width = $slide.width();
      height = $slide.height();
      ratio = width / height;
      p_top = 1 / ratio * 100 + '%';  //cool intrinsic trick: http://alistapart.com/article/creating-intrinsic-ratios-for-video
      $filler = $('.' + slip.settings.fillerClass, slip.vars.slideWrapper);
      $filler.css({paddingTop: p_top}); // resizing without the need of js, true responsiveness :)
      ready();
    };

    // prepares a div to occupy the needed space
    prepareFiller = function () {
      if ($('.' + slip.settings.fillerClass, slip.vars.slideWrapper).length === 0) {
        slip.vars.slideWrapper.append($('<div class="' + slip.settings.fillerClass + '" />'));
      }
      if (slip.settings.adaptHeight === true) {  // if the slides shoud alwas adapt to their content
        setFillerProportions($('.' + slip.settings.activeClass, el));  // set the filler height on the active element
      } else {  // otherwise get the highest element
        var slides, $highest, height, count, loop;
        slides = $(slip.settings.elements, el);
        height = 0;
        loop = 0;
        count = slides.length;
        $(slides).each(function () {
          if ($(this).height() > height) {
            $highest = $(this);
            height = $highest.height();
          }
          loop = loop + 1;
          if (loop === count) {
            if ($highest === undefined) {
              $highest = $($(slides)[0]);
            }
            setFillerProportions($highest);
          }
        });
      }
    };

    updatePager = function () {
      if (slip.settings.usePager) {
        $('.pager li', slip.vars.slippryWrapper).removeClass('active');
        $($('.pager li', slip.vars.slippryWrapper)[slip.vars.active.index()]).addClass(slip.settings.activeClass);
      }
    };

    updateControls = function () {
      if (!slip.settings.loop && slip.settings.hideOnEnd) {
        $('.' + slip.settings.prevClass, slip.vars.slippryWrapper)[slip.vars.first ? 'hide' : 'show']();
        $('.' + slip.settings.nextClass, slip.vars.slippryWrapper)[slip.vars.last ? 'hide' : 'show']();
      }
    };

    updateCaption = function () {
      var caption, wrapper;
      if (slip.settings.captions !== false) {
        caption = slip.vars.active.attr('title');
        if (slip.settings.captions !== 'custom') {
          wrapper = $('.' + slip.settings.captionsClass, slip.vars.slippryWrapper);
        } else {
          wrapper = $('.' + slip.settings.captionsClass);
        }
        wrapper.html(caption).show();
        if (caption === undefined) {
          wrapper.hide();
        }
      }
    };

    el.startAuto = function () {
      if ((slip.vars.timer === undefined) && (slip.vars.delay === undefined)) {
        slip.vars.delay = window.setTimeout(function () {
          slip.vars.autodelay = false;
          slip.vars.timer = window.setInterval(function () {el.goToSlide(slip.settings.autoDirection); }, slip.settings.pause);
        }, slip.vars.autodelay ? slip.settings.autoHoverDelay : slip.settings.autoDelay);
      }
      if (slip.settings.autoHover) {
        slip.vars.slideWrapper.unbind('mouseenter').unbind('mouseleave').bind('mouseenter', function () {
          if (slip.vars.timer !== undefined) {
            slip.vars.hoverStop = true;
            el.stopAuto();
          } else {
            slip.vars.hoverStop = false;
          }
        }).bind('mouseleave', function () {
          if (slip.vars.hoverStop) {
            slip.vars.autodelay = true;
            el.startAuto();
          }
        });
      }
    };

    el.stopAuto = function () {
      window.clearInterval(slip.vars.timer);
      slip.vars.timer = undefined;
      window.clearTimeout(slip.vars.delay);
      slip.vars.delay = undefined;
    };

    // refreshes the already initialised slider
    refresh = function () {
      $(slip.settings.elements, el).removeClass(slip.settings.activeClass);
      slip.vars.active.addClass(slip.settings.activeClass);
      if (slip.settings.responsive) {
        prepareFiller();
      } else {
        ready();
      }
      updateControls();
      updatePager();
      updateCaption();
    };

    updateSlide = function () {
      refresh();
    };

    doTransition = function () {
      var pos, jump, old_left, old_pos, kenZoom, kenStart, kenX, kenY, animProp, cssProp;
      slip.settings.onSlideBefore.call(slip.vars.active);
      if (slip.settings.transition !== false) {
        slip.vars.moving = true;
        if (slip.settings.transition === 'kenburns') {
          if (!slip.settings.useCSS) {
            animProp = {};
            cssProp = {};
            slip.vars.active.css({top: 'auto', left: 'auto', bottom: 'auto', right: 'auto'});
            kenX = slip.vars.active.index() % 2 === 0 ? 'left' : 'right';
            kenY = slip.vars.active.index() % 2 === 0 ? 'top' : 'bottom';
            kenZoom = 100 * slip.settings.kenZoom;
            kenStart = 100 - kenZoom;
            cssProp[kenX] = kenStart + '%';
            cssProp[kenY] = kenStart + '%';
            cssProp.width = kenZoom + '%';
            animProp[kenX] = '0%';
            animProp[kenY] = '0%';
            slip.vars.active.css(cssProp).animate(animProp, {duration: slip.settings.pause + (slip.settings.transTime * 2), queue: false });
          }
          if (slip.vars.fresh) {
            $($(slip.settings.elements, el)).css('opacity', 0);
            slip.vars.active.css('opacity', 1).addClass('ken');
            slip.vars.moving = false;
          } else {
            if (slip.settings.useCSS) {
              slip.vars.old.addClass(slip.settings.transClass).css('opacity', 0);
              slip.vars.active.addClass(slip.settings.transClass).css('opacity', 1).addClass('ken');
              slip.vars.old.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                console.log('anim_end');
                slip.vars.old.removeClass(slip.settings.transClass).removeClass('ken');
                slip.vars.active.removeClass(slip.settings.transClass);
                slip.vars.moving = false;
                return this;
              });
            } else {
              slip.vars.old.addClass(slip.settings.transClass).animate({
                opacity: 0
              }, {duration: slip.settings.transTime, queue: false, easing: slip.settings.transEase, complete: function () {
                $(this).removeClass(slip.settings.transClass);
                slip.vars.moving = false;
              }});
              slip.vars.active.addClass(slip.settings.transClass).css('opacity', 0).animate({
                opacity: 1
              }, {duration: slip.settings.transTime, queue: false, easing: slip.settings.transEase, complete: function () {
                $(this).removeClass(slip.settings.transClass);
              }});
            }
          }
          updateSlide();
        } else if (slip.settings.transition === 'fade') {
          if (slip.vars.fresh) {
            $($(slip.settings.elements, el)).css('opacity', 0);
            slip.vars.active.css('opacity', 1);
            slip.vars.moving = false;
          } else {
            if (slip.settings.useCSS) {
              slip.vars.old.addClass(slip.settings.transClass).css('opacity', 0);
              slip.vars.active.addClass(slip.settings.transClass).css('opacity', 1);
              slip.vars.old.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                slip.vars.old.removeClass(slip.settings.transClass);
                slip.vars.active.removeClass(slip.settings.transClass);
                slip.vars.moving = false;
                return this;
              });
            } else {
              slip.vars.old.addClass(slip.settings.transClass).stop().animate({
                opacity: 0
              }, slip.settings.transTime, slip.settings.transEase, function () {
                $(this).removeClass(slip.settings.transClass);
                slip.vars.moving = false;
              });
              slip.vars.active.addClass(slip.settings.transClass).css('opacity', 0).stop().animate({
                opacity: 1
              }, slip.settings.transTime, slip.settings.transEase, function () {
                $(this).removeClass(slip.settings.transClass);
              });
            }
          }
          updateSlide();
        } else if (slip.settings.transition === 'horizontal') {
          pos = '-' + slip.vars.active.index() * (100 + slip.settings.slideMargin) + '%';
          if (slip.vars.fresh) {
            el.css('left', pos);
            slip.vars.moving = false;
          } else {
            if (slip.settings.continuous) {
              if (slip.vars.jump && (slip.vars.trigger !== 'pager')) {
                jump = true;
                old_pos = pos;
                if (slip.vars.first) {
                  old_left = 0;
                  slip.vars.active.css('left', slip.vars.count * (100 + slip.settings.slideMargin) + '%');
                  pos = '-' + slip.vars.count * (100 + slip.settings.slideMargin) + '%';
                } else {
                  old_left = (slip.vars.count - 1) * (100 + slip.settings.slideMargin) + '%';
                  slip.vars.active.css('left', -(100 + slip.settings.slideMargin) + '%');
                  pos = (100 + slip.settings.slideMargin) + '%';
                }
              }
            }
            slip.vars.active.addClass(slip.settings.transClass);
            if (slip.settings.useCSS) {
              el.addClass(slip.settings.transition);
              el.css('left', pos);
              el.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                el.removeClass(slip.settings.transition); // Thanks! http://blog.teamtreehouse.com/using-jquery-to-detect-when-css3-animations-and-transitions-end
                if (jump) {
                  slip.vars.active.css('left', old_left);
                  el.css('left', old_pos);
                }
                slip.vars.moving = false;
                return this;
              });
            } else {
              el.stop().animate({
                left: pos
              }, slip.settings.transTime, slip.settings.transEase, function () {
                if (jump) {
                  slip.vars.active.css('left', old_left);
                  el.css('left', old_pos);
                }
                slip.vars.moving = false;
                return this;
              });
            }
          }
          updateSlide();
        }
      } else {
        updateSlide();
      }
    };

    updatePos = function (slide) {
      slip.vars.first = false;
      slip.vars.last = false;
      if ((slide === 'prev') || (slide === 0)) {
        slip.vars.first = true;
      } else if ((slide === 'next') || (slide === slip.vars.count - 1)) {
        slip.vars.last = true;
      }
    };

    el.goToSlide = function (slide) {
      var current;
      if (!slip.vars.moving) {
        current = slip.vars.active.index();
        if (slide === 'prev') {
          if (current > 0) {
            slide = current - 1;
          } else if (slip.settings.loop) {
            slide = slip.vars.count - 1;
          }
        } else if (slide === 'next') {
          if (current < slip.vars.count - 1) {
            slide = current + 1;
          } else if (slip.settings.loop) {
            slide = 0;
          }
        } else {
          slide = slide - 1;
        }
        slip.vars.jump = false;
        if ((slide !== 'prev') && (slide !== 'next')) {
          updatePos(slide);
          slip.vars.old = slip.vars.active;
          slip.vars.active = $($(slip.settings.elements, el)[slide]);
          if (((current === 0) && (slide === slip.vars.count - 1)) || ((current === slip.vars.count - 1) && (slide === 0))) {
            slip.vars.jump = true;
          }
          doTransition();
        }
      }
    };

    el.goToNextSlide = function () {
      el.goToSlide('next');
    };

    el.goToPrevSlide = function () {
      el.goToSlide('prev');
    };

    initPager = function () {
      if ((slip.settings.usePager) && (slip.vars.count > 1)) {
        var count, loop, pager;
        count = $(slip.settings.elements, el).length;
        pager = $('<ul class="' + slip.settings.pagerClass + '" />');
        for (loop = 1; loop < count + 1; loop = loop + 1) {
          pager.append($('<li />').append($('<a href="#' + loop + '">' + (loop + 1) + '</a>')));
        }
        slip.vars.slippryWrapper.append(pager);
        $('.' + slip.settings.pagerClass + ' a', slip.vars.slippryWrapper).click(function () {
          slip.vars.trigger = 'pager';
          el.goToSlide(parseInt(this.hash.split('#')[1], 10));
          return false;
        });
        updatePager();
      }
    };

    initControls = function () {
      if ((slip.settings.useControls) && (slip.vars.count > 1)) {
        slip.vars.slideWrapper.append(
          $('<ul class="' + slip.settings.controlClass + '" />')
            .append('<li class="' + slip.settings.prevClass + '"><a href="#prev">' + slip.settings.prevText + '</a></li>')
            .append('<li class="' + slip.settings.nextClass + '"><a href="#next">' + slip.settings.nextText + '</a></li>')
        );
        $('.' + slip.settings.controlClass + ' a', slip.vars.slippryWrapper).click(function () {
          console.log('click: ' + slip.vars.moving);
          slip.vars.trigger = 'controls';
          el.goToSlide(this.hash.split('#')[1]);
          return false;
        });
        updateControls();
      }
    };

    initCaptions = function () {
      if (slip.settings.captions !== false) {
        if (slip.settings.captions === 'overlay') {
          slip.vars.slideWrapper.append('<div class="caption_wrap"><div class="' + slip.settings.captionsClass + '"></div></div>');
        } else if (slip.settings.captions === 'below') {
          slip.vars.slippryWrapper.append('<div class="' + slip.settings.captionsClass + '" />');
        }
      }
    };

    // actually show the first slide
    start = function () {
      el.goToSlide(slip.vars.active.index());
    };

    // wait for images, iframes to be loaded
    preload = function (slides) {
      var count, loop, elements;
      elements = $('img, iframe', slides);
      count = elements.length;
      if (count === 0) {
        start();
        return;
      }
      loop = 0;
      elements.each(function () {
        $(this).one('load', function () {
          if (++loop === count) {
            start();
          }
        }).each(function () {
          if (this.complete) {
            $(this).load();
          }
        });
      });
    };

    el.getCurrentSlide = function () {
      return slip.vars.active;
    };

    el.getSlideCount = function () {
      return slip.vars.count;
    };

    el.destroySlider = function () {
      if (slip.vars.fresh === false) {
        el.stopAuto();
        slip.vars.moving = false;
        $(slip.settings.elements, el).each(function () {
          if ($(this).data("cssBckup") !== undefined) {
            $(this).attr("style", $(this).data("cssBckup"));
          } else {
            $(this).removeAttr('style');
          }
          if ($(this).data("classBckup") !== undefined) {
            $(this).attr("class", $(this).data("classBckup"));
          } else {
            $(this).removeAttr('class');
          }
        });
        if (el.data("cssBckup") !== undefined) {
          el.attr("style", el.data("cssBckup"));
        } else {
          el.removeAttr('style');
        }
        if (el.data("classBckup") !== undefined) {
          el.attr("class", el.data("classBckup"));
        } else {
          el.removeAttr('class');
        }
        slip.vars.slippryWrapper.before(el);
        slip.vars.slippryWrapper.remove();
        slip.vars.fresh = undefined;
      }
    };

    el.reloadSlider = function () {
      el.destroySlider();
      init();
    };

    // initialises the slider, creates needed markup
    init = function () {
      var first;
      slip.settings = $.extend({}, defaults, options);
      slip.vars.count = $(slip.settings.elements, el).length;
      if (slip.settings.useCSS) { // deactivate css transitions on unsupported browsers
        if (!supports('transition')) {
          slip.settings.useCSS = false;
        }
      }
      el.data('cssBckup', el.attr('style'));
      el.data('classBackup', el.attr('class'));
      el.addClass(slip.settings.boxClass).wrap(slip.settings.slippryWrapper).wrap(slip.settings.slideWrapper);
      slip.vars.slideWrapper = el.parent();
      slip.vars.slippryWrapper = slip.vars.slideWrapper.parent().addClass(slip.settings.loadingClass);
      slip.vars.fresh = true;
      $(slip.settings.elements, el).each(function () {
        $(this).data('cssBckup', $(this).attr('style')).data('classBackup', $(this).attr('class')).addClass(slip.settings.transition);
        if (slip.settings.useCSS) {
          $(this).addClass('useCSS');
        }
        if (slip.settings.transition === 'horizontal') {
          $(this).css('left', $(this).index() * (100 + slip.settings.slideMargin) + '%');
        }
      });
      if ((slip.vars.count > 1) || (slip.settings.initSingle)) {
        if ($('.' + slip.settings.activeClass, el).index() === -1) {
          if (slip.settings.start === 'random') {
            first = Math.round(Math.random() * (slip.vars.count - 1));
          } else if (slip.settings.start > 0 && slip.settings.start < slip.vars.count) {
            first = slip.settings.start;
          } else {
            first = 0;
          }
          $($(slip.settings.elements, el)[first]).addClass(slip.settings.activeClass);
          slip.vars.active = $($(slip.settings.elements, el)[first]);
        } else {
          slip.vars.active = $('.' + slip.settings.activeClass, el);
        }
        initControls();
        initPager();
        initCaptions();
        preload($(slip.settings.elements, el));
      } else {
        return this;
      }
    };

    init(); // on startup initialise the slider

    return this;
  };
}(jQuery));