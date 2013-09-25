/**
 * slippry v0.2 - Simple responsive content slider
 * http://slippry.com
 *
 * Author(s): Lukas Jakob Hafner - @saftsaak 
 *
 * Copyright 2013, booncon oy - http://booncon.com
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

(function ($) {
  "use strict";
  var defaults;

  defaults = {
    slippryWrapper: '<div class="slippry_box" />',
    slideWrapper: '<div class="slide_box" />',
    boxClass: 'slippry_list',
    elements: 'li',
    activeClass: 'active',
    useControls: true,
    usePager: true,
    prevText: 'Previous',
    nextText: 'Next',
    fillerClass: 'filler',
    adaptHeight: true,
    randomStart: false,
    infinite: true, // implement hide controls on end
    captions: 'overlay', //overlay, below, false
    initSingle: false
  };

  $.fn.slippry = function (options) {
    var slip, el, refresh, prepareFiller, setFillerProportions, init, goToSlide, initPager, initControls, initCaptions, updatePager;

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

    // sets the aspect ratio of the filler element
    setFillerProportions = function ($slide) {
      var width, height, ratio, p_top;
      width = $slide.width();
      height = $slide.height();
      ratio = width / height;
      p_top = 1 / ratio * 100 + '%';  //cool intrinsic trick: http://alistapart.com/article/creating-intrinsic-ratios-for-video
      $('.' + slip.settings.fillerClass, slip.vars.slideWrapper).css({paddingTop: p_top}); // resizing without the need of js, true responsiveness :)
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

    goToSlide = function (slide) {
      var $slides, count, current;
      $slides = $(slip.settings.elements, el);
      count = $slides.length;
      current = $('.' + slip.settings.activeClass, el).index();
      if (slide === 'prev') {
        if (current > 0) {
          slide = current - 1;
        } else if (slip.settings.infinite) {
          slide = count - 1;
        }
      } else if (slide === 'next') {
        if (current < count - 1) {
          slide = current + 1;
        } else if (slip.settings.infinite) {
          slide = 0;
        }
      }
      if ((slide !== 'prev') && (slide !== 'next')) {
        $(slip.settings.elements, el).removeClass(slip.settings.activeClass);
        $($(slip.settings.elements, el)[slide]).addClass(slip.settings.activeClass);
        slip.vars.active = $($(slip.settings.elements, el)[slide]);
        updatePager();
        if (slip.settings.captions !== false) {
          $('.caption', slip.vars.slippryWrapper).text(slip.vars.active.attr('title'));
        }
      }
    };

    initPager = function () {
      if (slip.settings.usePager) {
        var count, loop, pager;
        count = $(slip.settings.elements, el).length;
        pager = $('<ul class="pager" />');
        for (loop = 0; loop < count; loop = loop + 1) {
          pager.append($('<li />').append($('<a href="#' + loop + '"></a>')));
        }
        slip.vars.slippryWrapper.append(pager);
        $('.pager a').click(function () {
          goToSlide(this.hash.split('#')[1]);
          return false;
        });
        updatePager();
      }
    };

    initControls = function () {
      if (slip.settings.useControls) {
        slip.vars.slideWrapper.append(
          $('<ul class="controls" />')
            .append('<li class="slip_prev"><a href="#prev">' + slip.settings.prevText + '</a></li>')
            .append('<li class="slip_next"><a href="#next">' + slip.settings.nextText + '</a></li>')
        );
        $('.controls a').click(function () {
          goToSlide(this.hash.split('#')[1]);
          return false;
        });
      }
    };

    initCaptions = function () {
      if (slip.settings.captions !== false) {
        if (slip.settings.captions === 'overlay') {
          slip.vars.slideWrapper.append('<div class="caption_wrap"><div class="caption"></div></div>');
        } else if (slip.settings.captions === 'below') {
          slip.vars.slippryWrapper.append('"<div class="caption" />');
        }
        $('.caption', slip.vars.slippryWrapper).text(slip.vars.active.attr('title'));
      }
    };

    // refreshes the already initialised slider
    refresh = function () {
      prepareFiller();
    };

    // initialises the slider, creates needed markup
    init = function () {
      var start;
      slip.settings = $.extend({}, defaults, options);
      if ($('.' + slip.settings.activeClass, el).index() === -1) {
        if (slip.settings.randomStart) {
          start = Math.round(Math.random() * ($(slip.settings.elements, el).length - 1));
        } else {
          start = 0;
        }
        $($(slip.settings.elements, el)[start]).addClass(slip.settings.activeClass);
        slip.vars.active = $($(slip.settings.elements, el)[start]);
      } else {
        slip.vars.active = $('.' + slip.settings.activeClass, el);
      }
      el.addClass(slip.settings.boxClass).wrap(slip.settings.slippryWrapper).wrap(slip.settings.slideWrapper);
      slip.vars.slideWrapper = el.parent();
      slip.vars.slippryWrapper = slip.vars.slideWrapper.parent();
      initControls();
      initPager();
      initCaptions();
      refresh();
    };

    this.reset = function () {
      console.log('reset');
      // el.parent().parent().append(el).remove(el.parent()); // implement this properly todo : delete all the created objects
      // init(); // re-initialise
    };

    init(); // on startup initialise the slider

    return this;
  };
}(jQuery));