﻿(function (inlineEditing, $, undefined) {

    inlineEditing.insertImageHook = function (callback, idPostfix) {

        console.log(idPostfix);
        console.log('callback:');
        console.log(callback);
        //var idPostfix = $(this).attr('id').substr('wmd-input'.length);
        console.log('idpostfix es : ' + idPostfix);

        // see if there's an image selected that they intend on editing
        var wmd = $('#wmd-input' + idPostfix);
        var editImage, content = wmd.selection ? wmd.selection.createRange().text : null;

        // we wont use this on the admin. We want to use it in the frontend.
        //var adminIndex = location.href.toLowerCase().indexOf("/admin/");
        //if (adminIndex === -1) return;
        //var url = location.href.substr(0, adminIndex) + "/Admin/Orchard.MediaLibrary?dialog=true";
        var baseUrl = inlineEditing.IEPageVM.BaseUrl;
        var url = baseUrl + "/Admin/Orchard.MediaLibrary?dialog=true";

        $.colorbox({
            href: url,
            iframe: true,
            reposition: true,
            width: "90%",
            height: "90%",
            onLoad: function () {
                // hide the scrollbars from the main window
                $('html, body').css('overflow', 'hidden');
                console.log('mymodule is logging');
            },
            onClosed: function () {
                $('html, body').css('overflow', '');

                var selectedData = $.colorbox.selectedData;

                if (selectedData == null) // Dialog cancelled, do nothing
                    return;

                var newContent = '';
                for (var i = 0; i < selectedData.length; i++) {
                    var renderMedia = baseUrl + "/Admin/Orchard.MediaLibrary/MediaItem/" + selectedData[i].id + "?displayType=Raw";
                    $.ajax({
                        async: false,
                        type: 'GET',
                        url: renderMedia,
                        success: function (data) {
                            newContent += data;
                        }
                    });
                }

                var result = $.parseHTML(newContent);
                var img = $(result).filter('img');
                // if this is an image, use the callback which will format it in markdown
                if (img.length > 0 && img.attr('src')) {
                    callback(img.attr('src'));
                }

                    // otherwise, insert the raw HTML
                else {
                    if (wmd.selection) {
                        wmd.selection.replace('.*', newContent);
                    } else {
                        wmd.text(newContent);
                    }
                    callback();
                }
            }
        }



        );
        return true;
    };


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
    };

}(window.inlineEditing = window.inlineEditing || {}, jQuery));
