/**
 * Represents the Webcall Widget Buttom
 * @param {string} webphone_url - The url to the webphone to open
 * @param {string} design - The design that the button will have ('top','top-corner','middle','bottom')
 * @param {string} align - Horizontal align of the button ('right','left')
 * @param {string} color - HTML valid color code to decorate the button
 * @returns {{create: create, changeDesign: changeDesign, changeColor: changeColor, resetColor: resetColor, changeHorizontalAlign: changeHorizontalAlign}}
 * @constructor
 */
function WebcallWidget(webphone_url,design,align,color) {
    console.log('--> WebcallWidget constructor()');
    var active_design;
    var webphone_widget_template = {
        'top': function () {
            /*
             <div id="webcall_widget_top">
                 <div id="webphone_button_top">
                     <div id="pulse-holder_top">
                         <div id="pulse-rays_top"></div>
                         <div id="pulse-rays1_top"></div>
                     </div>
                 </div>
             </div>
             */
        },
        'top-corner': function () {
            /*
             <div id="webcall_widget_top-corner">
                 <div id="webphone_button_top-corner">
                     <div id="pulse-holder_top-corner">
                         <div id="pulse-rays_top-corner"></div>
                         <div id="pulse-rays1_top-corner"></div>
                     </div>
                 </div>
             </div>
             */
        },
        'middle': function () {
            /*
             <div id="webcall_widget_middle">
                 <div id="webphone_button_middle">
                 </div>
             </div>
             */
        },
        bottom: function () {
            /*
             <div id="webcall_widget_bottom">
                 <div id="webphone_button_bottom">
                     <div id="pulse-holder_bottom">
                         <div id="pulse-rays_bottom"></div>
                         <div id="pulse-rays1_bottom"></div>
                     </div>
                 </div>
             </div>
             */
        }
    };
    var default_color = '#FD554D';
    var active_color;
    var active_align;
    var valid_design = ['top', 'top-corner', 'middle', 'bottom'];
    var valid_align = ['right', 'left'];

    Array.prototype.contains = function(element) {
        return this.indexOf(element) > -1;
    };

    function heredoc(text) {
        var heredoc = text.toString();
        heredoc = heredoc.replace(/(^.*\{\s*\/\*\s*)/g, '');
        heredoc = heredoc.replace(/(\s*\*\/\s*}.*)$/g, '');
        return heredoc;
    }

    function appendWebphone(new_design) {
        active_design = new_design;
        document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', heredoc(webphone_widget_template[new_design]));
    }

    function openWebphone() {

        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var webphone_popup_height = 480;
        var webphone_popup_width = 640;

        var left = ((width / 2) - (webphone_popup_width / 2)) + dualScreenLeft;
        var top = ((height / 2) - (webphone_popup_height / 2)) + dualScreenTop;

        var webphone_popup = window.open(webphone_url, "_blank", "height=" + webphone_popup_height + ",width=" + webphone_popup_width + ",top=" + top + ",left=" + left + ",location=0,menubar=0,status=1,toolbar=0,resizable=0,scrollbars=0");
        webphone_popup.focus();

        function setWebphoneTitle(title) {
            webphone_popup.onload = function () {
                try {
                    webphone_popup.document.title = title;
                } catch (e) {
                    console.log(e);
                }
            };
        }

        setWebphoneTitle("IVRPowers Webphone");
    }

    function addActions(new_design) {
        document.getElementById('webcall_widget_' + new_design).addEventListener('click', function (event) {
            openWebphone();
            event.preventDefault();
        });
    }

    function isFlashInstalled() {
        var hasFlash = false;
        try {
            var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (fo) {
                hasFlash = true;
            }
        } catch (e) {
            if (navigator.mimeTypes
                && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
                && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
                hasFlash = true;
            }
        }
        return hasFlash;
    }

    /**
     * It starts the Webcall Button and displays it into the web
     */
    function create() {
      /**
        if (!isFlashInstalled()) {
            console.error('The web browser does not suppor flash, the Webcall Widget could not be created');
            return;
        }
        if (!valid_design.contains(design)) {
            console.error(design + ' is not a valid design. It must be one of (' + valid_design.toString() + ')');
            return;
        }
        if (!valid_align.contains(align)) {
            console.error(align + ' is not a valid align. It must be one of (' + valid_align.toString() + ')');
            return;
        }
        */
        console.log('--> WebcallWidget create()');
        appendWebphone(design);
        addActions(design);
        changeColor(color);
        changeHorizontalAlign(align);
        console.log('<-- WebcallWidget create()');
    }

    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };

    /**
     * To switch the current design of the button
     * @param {string} new_design - The new button design ('top','top-corner','middle','bottom')
     */
    function changeDesign(new_design) {
        if (!valid_design.contains(new_design)) {
            console.error(new_design + ' is not a valid design. It must be one of (' + valid_design.toString() + ')');
            return;
        }
        document.getElementById('webcall_widget_' + active_design).remove();
        appendWebphone(new_design);
        changeColor(active_color);
        changeHorizontalAlign(active_align);
        addActions(new_design);
    }

    /**
     * To switch the current color of the button
     * @param {string} new_color - HTML valid color code
     */
    function changeColor(new_color) {
        document.getElementById('webcall_widget_' + active_design).style.backgroundColor = new_color;

        if (isNotMiddleDesign()) {
            document.getElementById('pulse-rays_' + active_design).style.borderColor = new_color;
            document.getElementById('pulse-rays1_' + active_design).style.borderColor = new_color;
        }

        active_color = new_color;

        function isNotMiddleDesign() {
            return active_design != 'middle';
        }
    }

    function resetColor() {
        changeColor(default_color);
    }

    /**
     * To switch the horizontal align of the button
     * @param {string} new_align - Horizontal align ('right','left')
     */
    function changeHorizontalAlign(new_align) {

        if (!valid_align.contains(new_align)) {
            console.error(new_align + ' is not a valid align. It must be one of (' + valid_align.toString() + ')');
            return;
        }

        if (isTopCornerDesign()) {
            document.getElementById('webcall_widget_' + active_design).style.left = (isAlignRight() ? 'auto' : '0');
            document.getElementById('webcall_widget_' + active_design).style.right = (isAlignRight() ? '0' : 'auto');

            document.getElementById('webcall_widget_' + active_design).style.transform = (isAlignRight() ? 'none' : 'scaleX(-1)');

            document.getElementById('webphone_button_' + active_design).style.left = (isAlignRight() ? 'auto' : '0');
            document.getElementById('webphone_button_' + active_design).style.right = (isAlignRight() ? '0' : 'auto');

            document.getElementById('pulse-rays_' + active_design).style.left = (isAlignRight() ? 'auto' : '-45px');
            document.getElementById('pulse-rays_' + active_design).style.right = (isAlignRight() ? '-45px' : 'auto');

            document.getElementById('pulse-rays1_' + active_design).style.left = (isAlignRight() ? 'auto' : '-45px');
            document.getElementById('pulse-rays1_' + active_design).style.right = (isAlignRight() ? '-45px' : 'auto');
        } else if (isMiddleDesign()) {
            document.getElementById('webcall_widget_' + active_design).style.left = (isAlignRight() ? 'auto' : '-5px');
            document.getElementById('webcall_widget_' + active_design).style.right = (isAlignRight() ? '-5px' : 'auto');

            document.getElementById('webcall_widget_' + active_design).style.transform = (isAlignRight() ? 'none' : 'scaleX(-1)');
        } else {
            document.getElementById('webcall_widget_' + active_design).style.left = (isAlignRight() ? 'auto' : '60px');
            document.getElementById('webcall_widget_' + active_design).style.right = (isAlignRight() ? '60px' : 'auto');

            document.getElementById('webphone_button_' + active_design).style.left = (isAlignRight() ? 'auto' : '0');
            document.getElementById('webphone_button_' + active_design).style.right = (isAlignRight() ? '0' : 'auto');

            document.getElementById('pulse-rays_' + active_design).style.left = (isAlignRight() ? 'auto' : '-40px');
            document.getElementById('pulse-rays_' + active_design).style.right = (isAlignRight() ? '-40px' : 'auto');

            document.getElementById('pulse-rays1_' + active_design).style.left = (isAlignRight() ? 'auto' : '-40px');
            document.getElementById('pulse-rays1_' + active_design).style.right = (isAlignRight() ? '-40px' : 'auto');
        }

        active_align = new_align;

        function isTopCornerDesign() {
            return active_design == 'top-corner';
        }

        function isMiddleDesign() {
            return active_design == 'middle';
        }

        function isAlignRight() {
            return new_align == 'right';
        }
    }

    return {
        create: create,
        changeDesign: changeDesign,
        changeColor: changeColor,
        resetColor: resetColor,
        changeHorizontalAlign: changeHorizontalAlign
    }

}
