if (!RedactorPlugins) var RedactorPlugins = {};

(function ($) {
  RedactorPlugins.fontSize = function () {
    var keys = [8, 33, 34, 35, 36, 37, 38, 39, 40];

    return {
      init: function () {
        var sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
        var dropdown = {};

        options = this.opts.fontSize || { defaultSize: '14' };

        $.each(sizes, function (i, s) {
          dropdown['sz' + i] = {
            title: s,
            func: function (e) {
              this.fontSize.onSelect(s);
            }
          };
        });

        var button = this.button.add('fontSizeList', "Font Size");
        button[0].innerHTML = options.defaultSize;
        this.core.getElement()[0].style.fontSize = options.defaultSize + 'px';
        this.button.addDropdown(button, dropdown);

        this.opts.dropdownShowCallback = function (dropdown, key, button) {
          if (dropdown.key === "fontSizeList") {
            $(".redactor-dropdown-box-fontSizeList").children().each(function (index, value) {
              $(value).css("font-size", value.text);
            });
          }
        }

        this.opts.clickCallback = function () {
          this.fontSize.caretChanged(this);
        };

        this.opts.keyupCallback = function (e) {
          var key = e.keyCode || e.which;
          if (keys.indexOf(key) === -1) return;

          this.fontSize.caretChanged(this);
        };
      },
      onSelect: function (size) {
        this.button.get('fontSizeList')[0].innerHTML = size;
        this.inline.format('span', 'style', 'font-size:' + size + 'px;');
      },
      caretChanged: function (t) {
        var node = t.sel.focusNode.nodeType == 3 ? t.sel.focusNode.parentNode : t.sel.focusNode;
        var size = window.getComputedStyle(node, null).getPropertyValue('font-size');

        size = size.replace(/px+/g, '');

        this.button.get('fontSizeList')[0].innerHTML = size;
      }
    }
  };
})(jQuery);
