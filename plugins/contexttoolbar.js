if (!RedactorPlugins) var RedactorPlugins = {};

(function ($) {
  RedactorPlugins.contexttoolbar = function () {
    var $_contextToolbar = null;
    var $_shownDropdown = null;
    var options = null;

    var keys = [37, 38, 39, 40];   // left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    };

    function keydown(e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
          preventDefault(e);
          return;
        }
      }
    };

    function wheel(e) {
      preventDefault(e);
    };

    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
      }
      window.onmousewheel = document.onmousewheel = wheel;
      document.onkeydown = keydown;
    };

    function enableScroll() {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
      }
      window.onmousewheel = document.onmousewheel = document.onkeydown = null;
    };


    return {
      init: function () {
        $_contextToolbar = this.contexttoolbar.createToolbar();

        options = this.opts.contexttoolbar || {};

        this.contexttoolbar.loadButtons();
        this.core.getBox().append($_contextToolbar);

        this.$toolbar = this.$toolbar.add($_contextToolbar);

        this.core.getEditor().on('contextmenu.showtoolbar', this.contexttoolbar.showToolbar.bind(this));
        this.opts.dropdownShownCallback = this.contexttoolbar.onDropdownShown.bind(this);

        $(document).on('click', this.contexttoolbar.hideToolbar.bind(this));
        
         //close on ESC
        var that = this;
        $(document).keydown(function (e) {
          if (e.keyCode === 27) {
            that.contexttoolbar.hideToolbar();
          }
        });
        
        this.$toolbar.find('a.re-icon').on('click', this.contexttoolbar.observeDropdownShow.bind(this));
      },
      createToolbar: function () {
        return $('<ul></ul>')
            .addClass('redactor-toolbar')
            .addClass('redactor-context-toolbar')
            .css({
              'display': 'none',
              'position': 'absolute',
              'z-index': 99,
              'box-shadow': '0 0 8px rgba(0, 0, 0, 0.8)',
              'white-space': 'nowrap'
            });
      },
      loadButtons: function () {
        var _originButtons = this.opts.buttons;
        this.opts.buttons = options.buttons || _originButtons;

        var $_originToolbar = this.$toolbar;
        this.$toolbar = $_contextToolbar;

        this.toolbar.loadButtons();
        this.opts.buttons = _originButtons;

        // load plugins
        if (options.plugins) {
          var _originPlugins = this.opts.plugins;
          this.opts.plugins = options.plugins;
          this.build.plugins();
          this.opts.plugins = _originPlugins;
        }

        this.$toolbar = $_originToolbar;
      },
      showToolbar: function (event) {

        if (options.scroll === true) {
          $(document).on('scroll wheel mousewheel', this.contexttoolbar.hideToolbar.bind(this));
        } else if (options.scroll === false) {
          disableScroll();
        }
     
        event.preventDefault();
        var $buttons = $_contextToolbar.find('> li');
        var contextWidth = $buttons.length * this.$toolbar.find('> li').innerWidth();
        var $box = this.core.getBox();
        var generalWidth = $box.width();
        var offset = $box.offset();
        var cursorOffsetTop = 44;
        var posX = (event.pageX - offset.left - contextWidth / 2);
        var posY = (event.pageY - offset.top - cursorOffsetTop);

        // if left corner is outside of editor
        if ((event.pageX - contextWidth / 2) < offset.left) {
          posX = 0;
        }

        // if right corner is outside of editor
        if ((event.pageX + contextWidth / 2) > offset.left + generalWidth) {
          posX = generalWidth - contextWidth;
        }

        $_contextToolbar.css({
          'display': 'inline-block',
          'position': 'absolute',
          'left': posX + 'px',
          'top': posY + 'px',
          'width': contextWidth + 'px'
        })
            .stop(true, true)
            .fadeIn(150);
      },
      hideToolbar: function () {
        if ($_shownDropdown) {
          $_shownDropdown.fadeOut();
        }
        $_contextToolbar.fadeOut();

        if (options.hasOwnProperty('scroll') && options.scroll === false) {
          enableScroll();
        }
      },
      observeDropdownShow: function (event) {
        var $btn = $(event.target);
        var toolbarOffset = this.$toolbar.offset();
        var keyOffset = $btn.offset();
        var $dropdown = $btn.data('dropdown');

        if ($dropdown) {
          if (this.$toolbar.hasClass('toolbar-fixed-box')) {
            keyOffset.top -= toolbarOffset.top;
          }

          $_shownDropdown.css({
            'top': keyOffset.top + 32 + 'px',
            'left': keyOffset.left + 'px',
            'display': 'block'
          });
        }
      },
      onDropdownShown: function (data) {
        $_shownDropdown = data.dropdown;
      }
    };
  };
})(jQuery);
