/* jquery.ui.muliselect.js
 *
 * URL: http://corydorning.com/projects/multiselect
 *
 * @author: Cory Dorning
 * @modified: 02/27/2012
 *
 * Multiselect is a jQuery UI widget that transforms a <select>
 * box to provide a better User Experience when you need to select
 * multiple items, without the need to use the CTRL key.
 *
 * 
 * @TODO
 * 
 *
 */

;(function($) {
  $.widget('ui.multiselect', {
    _version: 0.2,

    version: function() { return this._version; },
  
    // default options
    options: {
      change: function(){},
      deselect: function() {},
      label: '--Click & Pick All--',
      minWidth: 120,
      maxWidth: null,
      scroll: 0,
      select: function() {}
    },

    items: [],

    _create: function() {
      var self = this,
          $select = self.element.hide(),
          items = self.items = $select.children('option').map(function(){
            return {
              label: $(this).text(),
              value: $(this).text(),
              option: this // this stores a reference of the option element it belongs to
            };
          }).get();

      var $input = self.input = $('<div alt="Select ALL that apply. Used for statistics, not published." title="Select ALL that apply. Used for statistics, not published." class="ui-multiselect-input" />')
            .attr({
              // workaround to close menu on blur
              tabIndex: -1
            })
            .html('<span class="ui-multiselect-label" style="display: inline-block; margin: 2px; padding: 1px;">' + self.options.label + '</span>')
            .insertAfter($select)
            .autocomplete({
              delay: 0,
              minLength: 0,
              source: function(req, resp) {
                var srcItems = [];

                $.each(items, function(i, o) {
                  if (!o.option.selected) {
                    srcItems.push(o);
                  }
                });
                resp(srcItems);
              },
              select: function(ev, ui) {
                $.each(items, function(i, o) {
                  if (ui.item.option === o.option) {
                    self.select(i);
                  }
                });
              }
            })
            .addClass('ui-widget ui-widget-content ui-corner-all')
            .css({
              display: 'inline-block',
              minWidth: self.options.minWidth,
              maxWidth: self.options.maxWidth || 'auto',
              //padding: 1,
              //verticalAlign: 'middle',
			  width: 120,
			  fontSize: 'x-small'
            })
            .click(function() {
              //self.button.trigger('click');
			   // close if already visible
				  if ( $input.autocomplete('widget').is(':visible') ) {
					$input.autocomplete('close');
					return;
				  }

				  // work around a bug (likely same cause as #5265)
				  //$(this).blur();

				  // pass empty string as value to search for, displaying all results
				  $input.autocomplete('search', '');
				  $input.focus();
            });

	  /*
      self.button = $('<div>')
        .insertAfter($input)
        .button({
          icons: {
            primary: 'ui-icon-triangle-1-s'
          },
          text: false
        })
        .removeClass('ui-corner-all')
        .addClass('ui-corner-right')
        .css({
          height: $input.outerHeight(),
          verticalAlign: 'middle'
        })
        .click(function() {
          // close if already visible
          if ( $input.autocomplete('widget').is(':visible') ) {
            $input.autocomplete('close');
            return;
          }

          // work around a bug (likely same cause as #5265)
          $(this).blur();

          // pass empty string as value to search for, displaying all results
          $input.autocomplete('search', '');
          $input.focus();
        });
		*/

      if (self.options.scroll) {
        $('.ui-autocomplete').css({
          maxHeight: self.options.scroll,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '20px'
        });
      }
      
      $.each(items, function(i, o) {
        if (o.option.selected) {
          self.select(i);
        }
      });

    }, // _create

    destroy: function() {
      this.input.remove();
      this.button.remove();
      this.element.show();
      $.Widget.prototype.destroy.call( this );
    }, // destroy

    select: function(index) {
      var self = this,
          item = self.items[index];

      item.option.selected = true;
      
	  //05-15-2012
	  $(self.input).trigger("change");
	  
      $('<span class="ui-multiselect-item">' + item.label + '</span>')
        .button({
          icons: { secondary: 'ui-icon-close' }
        })
        .css({
          cursor: 'default',
          margin: 2,
		  fontSize: 'xx-small',
		  display: 'block'
        })
        .children('.ui-button-text')
          .css({
            lineHeight: 'normal',
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: '.5em'
          })
          .end()
        .children('.ui-icon-close')
          .css({
            cursor: 'pointer'
          })
          .click(function() {
            $(this).parent().remove();
			//$(this).parent().effect('puff').remove();
            self.deselect(item);
            return false;
          })
          .end()
        .appendTo(self.input);
        
        self.input.children('.ui-multiselect-label').hide();
        
        // call function on change
        self.options.change.call(item.option);
        
        // call function on select
        self.options.select.call(item.option);
    }, // select

    deselect: function(item) {
      var self = this;

      item.option.selected = false;

      if (!self.input.children('.ui-multiselect-item').length) {
        self.input.children('.ui-multiselect-label').show();
      }
      
	  //05-15-2012
	  $(self.input).trigger("change");
	  
      // call function on change
        self.options.change.call(item.option);
        
        // call function on deselect
        self.options.deselect.call(item.option);
    } // deselect

  }); // $.widget('multiselect')
})(jQuery);