﻿(function (inlineEditing, $, undefined) {

    // Helper to unify toastr notifications through the UI
    inlineEditing.notify = function (MsgType, Message) {
        if (MsgType == 'error') {
            toastr.error(Message);
        }
        else if (MsgType == 'warning') {
            toastr.warning(Message);
        }
        else if (MsgType == 'success') {
            toastr.success(Message);
        }
        else {
            toastr.info(Message);
        }
    }

}(window.inlineEditing = window.inlineEditing || {}, jQuery));

