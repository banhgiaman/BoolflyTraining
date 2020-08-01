(function ($) {
  $.fn.slider = function (options) {
    "use strict";
    var defaults = {
      time: 2000,
      total: 4,
      isAuto: true,
      isDrag: true
    };

    if (typeof options !== "object") {
      options = {};
    } else {
      if (typeof options.time !== "number") {
        options.time = defaults.time;
      }
      if (typeof options.total !== "number" || options.total < 1) {
        options.total = defaults.total;
      }
      if (typeof options.isAuto !== "boolean") {
        options.isAuto = defaults.isAuto;
      }
    }

    var settings = $.extend({}, defaults, options);

    return this.each(function () {
      var $slider = $(this),
        $sliderList = $slider.children("ul"),
        $allButtons = $slider.find(".button"),
        $pagination = $slider.find("#pagination"),
        index = 1,
        interval,
        startDrag,
        $buttons = {
          forward: $allButtons.filter(".forward"),
          back: $allButtons.filter(".back")
        };

        settings.total = settings.total > $sliderList.children().length ? $sliderList.children().length : settings.total;
        settings.time = settings.time < 1000 ? 1000 : settings.time;

      var change = function () {
        $sliderList.css("transition", "margin-left 0.25s ease-in-out");
        $sliderList.css("margin-left", `${-800 * index}px`);
        $pagination.children("a").removeClass("active");
        $pagination.children(`a:nth-child(${index})`).addClass("active");
      };

      var renderFirstLast = function () {
        var htmlFirst = $sliderList.children(`li:nth-child(${settings.total})`).get(0).outerHTML,
          htmlLast = $sliderList.children(`li:first-child`).get(0).outerHTML;
        $sliderList.prepend(htmlFirst);
        $sliderList.children(`li:nth-child(${settings.total + 1})`).after(htmlLast);
      }

      var renderPagination = function () {
        let html = "";
        $pagination.empty();
        for (let i = 1; i <= settings.total; i++) {
          html += `<a data-id=${i}></a>`;
        }
        $pagination.append(html);
        $pagination.children("a:nth-child(1)").addClass("active");
      };

      renderPagination();
      renderFirstLast();

      var moveToFirst = function () {
        setTimeout(function () {
          $sliderList.css("transition", "none");
          $sliderList.css("margin-left", "-800px");
        }, 250);
      }

      var moveToLast = function () {
        setTimeout(function () {
          $sliderList.css("transition", "none");
          $sliderList.css("margin-left", `-${800 * settings.total}px`);
        }, 250);
      }

      var autoChange = function () {
        interval = setInterval(function () {
          index++;
          if (index === settings.total + 1) {
            change();
            $pagination.children("a:nth-child(1)").addClass("active");
            index = 1;
            moveToFirst();
          } else {
            change();
          };
        }, settings.time);
      };

      if (settings.isAuto === true) {
        $allButtons.mouseenter(function () {
          clearInterval(interval);
        });
        $allButtons.mouseleave(function () {
          autoChange();
        });
        $sliderList.mouseenter(function () {
          clearInterval(interval);
        });
        $sliderList.mouseleave(function () {
          autoChange();
        });
        autoChange();
      }

      $buttons.forward.on("click", function () {
        index++;
        change();
        if (index === settings.total + 1) {
          $pagination.children("a:nth-child(1)").addClass("active");
          index = 1;
          moveToFirst();
        }
      });

      $buttons.back.on("click", function () {
        index--;
        change();
        if (index === 0) {
          index = settings.total;
          $pagination.children(`a:nth-child(${settings.total})`).addClass("active");
          moveToLast();
        }
      })

      $pagination.children().on("click", function () {
        let value = $(this).data("id");
        index = value;
        change();
      });

      if (settings.isDrag === true) {
        $sliderList.mousedown(function (e) {
          startDrag = e.clientX;
          $sliderList.css("cursor", "grab");
          return false;
        });

        $sliderList.mousemove(function (e) {
          if (startDrag !== 0) {
            $sliderList.css("transition", "none");
            $sliderList.css("margin-left", `${-800 * index + e.clientX - startDrag}px`);
          }
        });

        $sliderList.mouseleave(function () {
          startDrag = 0;
          change();
        });

        $sliderList.mouseup(function (e) {
          if (startDrag > e.clientX) {
            $buttons.forward.click();
          } else if (startDrag < e.clientX) {
            $buttons.back.click();
          }
          $sliderList.css("cursor", "auto");
          startDrag = 0;
        });
      }
    });
  };
})(jQuery);

$(function () {
  $(".slider1").slider();
  $(".slider2").slider({ isAuto: false, isDrag: true, total: 99
   });
});