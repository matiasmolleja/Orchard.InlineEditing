tinymce.PluginManager.add('medialibrary', function (editor, url) {
    // Add a button that opens a window
    editor.addButton('medialibrary', {
        image: url + '/img/picture_add.png',
        onclick: function () {

            $.colorbox({
                href: 'Admin/Orchard.MediaLibrary?dialog=true',
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

                    if (selectedData == null) // Dialog cancelled, do nothing
                        return;

                    var newContent = '';
                    for (var i = 0; i < selectedData.length; i++) {

                        var renderMedia = "Admin/Orchard.MediaLibrary/MediaItem/" + selectedData[i].id + "?displayType=Raw"
                        $.ajax({
                            async: false,
                            type: 'GET',
                            url: renderMedia,
                            success: function (data) {
                                newContent += data;
                            }
                        });
                    }

                    // reassign the src to force a refresh
                    tinyMCE.execCommand('mceReplaceContent', false, newContent);
                }

            });

        }
    });
});