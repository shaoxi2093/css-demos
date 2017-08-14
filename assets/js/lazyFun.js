/**
 * Created by zy6266 on 2017/8/11.
 */
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyFun = function(options,cb) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null
        };

        function update() {
            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if (!$.belowthefold(this, settings)) {
                    $this.trigger("appear");
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        $container = (settings.container === undefined ||
        settings.container === window) ? $window : $(settings.container);

        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                update();
            });
        }
        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            $self.one("appear", function(){
                cb($self)
            });
        });
        return this;
    };


    $.belowthefold = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };


    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
