(function (inlineEditing, $, undefined) {

    // Builds Inline Editor for body with a markdown flavor. 
    inlineEditing.BuildMarkDownEditorForBody = function (partName, part, baseUrl, resettingToInitial) {

        // Step One: Build Editor
        BuildMarkDownEditor(partName, part, baseUrl, resettingToInitial);

        //Step Two: Build jQuery UI Dialog
        BuildMarkDownDialog(part);

    };


    // Initializes a markdown editor. Most of the code is for enabling Orchard Media Library.
    var BuildMarkDownEditor = function (partName, part, baseUrl, resettingToInitial) {

        var mdconverter = Markdown.getSanitizingConverter();

        //Markdown Editor
        var idPostfix = '-bodypart' + part.contentItemId;

        var isFirstLoad = true;


        mdconverter.hooks.chain("preConversion", function (text) {
            if (isFirstLoad) {
                part.InitialContents(text);
                isFirstLoad = false;
            }
            part.Contents(text);


            return text;

        });
        mdconverter.hooks.chain("postConversion", function (text) {

            part.htmlFromMdown(text);

            return text;
        });

        var editor = new Markdown.Editor(mdconverter, idPostfix);

        editor.hooks.set("insertImageDialog",

            function (callback) {

                // see if there's an image selected that they intend on editing
                var wmd = $('#wmd-input' + idPostfix);
                var editImage, content = wmd.selection ? wmd.selection.createRange().text : null;

                // we wont use this on the admin. We want to use it in the frontend.
                // this is one of the reasons why we can't simply use Orchard.Markdown Module. 
                //var adminIndex = location.href.toLowerCase().indexOf("/admin/");
                //if (adminIndex === -1) return;
                //var url = location.href.substr(0, adminIndex) + "/Admin/Orchard.MediaLibrary?dialog=true";

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

                    },
                    onClosed: function () {
                        $('html, body').css('overflow', '');

                        var selectedData = $.colorbox.selectedData;

                        // Dialog cancelled, do nothing
                        if (selectedData == null) {
                            callback();
                            return false;
                        }


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
            });

        editor.run();
    };

    // Initializes the jQuery UI dialog that will contain the editor.
    var BuildMarkDownDialog = function (part) {

        // jQuery UI Dialog for markdown editor.
        $(document).ready(function () {


            //If we don't set zIndex or set it to a very high value, the insert hyperlink dialog will be hidden by our own dialog.
            var options = {
                autoOpen: false,
                modal: true,
                dialogClass: 'mddialog',
                title: 'Markdown Editor',
                width: 600,
                height: 500,
                zIndex: 9997
            };
            // dialog-extend options
            var dialogExtendOptions = {
                'closable': true,
                'maximizable': true,
                'dblclick': 'maximize',
                'icons': {
                    'close': 'ui-icon-fa-remove',
                    'maximize': 'ui-icon-fa-plus',
                    'restore': 'ui-icon-fa-minus'
                }
            };

            var dclass = '.dialog-bodyPart-' + part.contentItemId;
            $(dclass).dialog(options).dialogExtend(dialogExtendOptions);

            $(".md-opener").click(function () {
                if (inlineEditing.IEPageVM.editorMode()) {
                    $(dclass).dialog("open");
                }
            });
        });
    };

    // Removing the editor. Called when Editor Mode is turned off
    inlineEditing.RemoveMarkDownEditor = function (part) {
        var mdconverter = Markdown.getSanitizingConverter();

        $('#wmd-preview-bodypart' + part.contentItemId).html(mdconverter.makeHtml(part.InitialContents()));
        $('#wmd-input-bodypart' + part.contentItemId).val(part.InitialContents());

        $('.dialog-bodyPart-' + part.contentItemId).dialog("close");
    };

}(window.inlineEditing = window.inlineEditing || {}, jQuery));




