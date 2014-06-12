(function (inlineEditing, $, undefined) {


    inlineEditing.buildEditorForHtmlField = function (contentItemId, partName) {
        tinymce.init({
            selector: ".mce_" + partName + "_" + contentItemId,
            inline: true,
            convert_urls: false,
            relative_urls: false,
            setup: function (editor) {
                editor.on('change', function (e) {
                    var part = getPartFromEditorSelector(e.target.id);
                    part.Contents(editor.getContent({ format: 'html' }));
                }),
                editor.on('undo', function (e) {
                    editor.fire('change');
                }),
                editor.on('remove', function (e) {
                    var part = getPartFromEditorSelector(e.target.id);
                    editor.setContent(part.Contents());
                }),
                editor.on('init', function (e) {
                    var part = getPartFromEditorSelector(e.target.id);
                    // What we get from server is different than what tinyMCE encodes.
                    // This is the way to be sure that comparisons between InitialContent and Contents works ok.
                    var encoded = editor.getContent({ format: 'html' })
                    part.Contents(encoded);
                    part.InitialContents(encoded);

                })
            },
            menubar: false,
            plugins: [
                "advlist autolink lists  medialibrary link",
                "insertdatetime media table contextmenu paste"
            ],
            toolbar: "undo redo| styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | medialibrary link",
            valid_elements: "*[*]",
            // shouldn't be needed due to the valid_elements setting, but TinyMCE would strip script.src without it.
            extended_valid_elements: "script[type|defer|src|language]"
        });
    }

    inlineEditing.buildEditorForTextField =  function (contentItemId, partName) {
        tinymce.init({
            selector: ".mce_" + partName + "_" + contentItemId,
            inline: true,
            setup: function (editor) {
                editor.on('change', function (e) {
                    var part = getPartFromEditorSelector(e.target.id);
                    part.Contents(editor.getContent({ format: 'text' }));
                }),
                editor.on('undo', function (e) {
                    editor.fire('change');
                }),
                editor.on('remove', function (e) {
                    var part = getPartFromEditorSelector(e.target.id);
                    editor.setContent(part.Contents());
                })
            },
            menubar: false,
            plugins: [
                "contextmenu paste"
            ],
            toolbar: "undo redo ",
            entity_encoding: "raw",
            valid_elements: "*[*]",
            // shouldn't be needed due to the valid_elements setting, but TinyMCE would strip script.src without it.
            extended_valid_elements: "script[type|defer|src|language]"

        });
    }
    
    inlineEditing.removeTinymceEditor = function (contentItemId, partName) {

        var ed = tinyMCE.get('mce_' + partName + '_' + contentItemId);
        if (ed != null) {            
            ed.remove();
        };        
    }
    function getPartFromEditorSelector(editorSelector) {

        var slices = editorSelector.split("_");
        var partType = slices[1].toString().toLowerCase();
        var editorId = slices[2];


        for (var i = 0; i < inlineEditing.IEPageVM.parts().length; i++) {

            var p = inlineEditing.IEPageVM.parts()[i];
            if ((p.partType().toString().toLowerCase() == partType.toString().toLowerCase()) && (p.contentItemId == editorId)) {
                return p;
            }
        }
    };

}(window.inlineEditing = window.inlineEditing || {}, jQuery));




