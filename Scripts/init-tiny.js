//if (mediaLibraryEnabled) {
    mediaLibrary = "medialibrary";
//}

function buildEditorForHtmlField(contentItemId, partName) {
    tinymce.init({
        selector: ".mce_" + partName + "_" + contentItemId,
        inline: true,
        setup: function (editor) {
            editor.on('change', function (e) {
                var part = getPartFromEditorSelector(e.target.id);
                part.Contents(editor.getContent({ format: 'html' }));
            }),
            editor.on('undo', function (e) {
                editor.fire('change');                
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

function buildEditorForTextField(contentItemId, partName) {
    tinymce.init({
        selector: ".mce_" + partName + "_" + contentItemId,
        inline: true,
        setup: function (editor) {
            editor.on('change', function (e) {
                console.log('change event', e);
                var part = getPartFromEditorSelector(e.target.id);
                //todo: differentiate between bodyparts(format:html) and titleParts(format:text)
                part.Contents(editor.getContent({ format: 'text' }));
                console.log('contents changed to:' + part.Contents());
            }),
            editor.on('undo', function (e) {
                editor.fire('change');
            })
        },
        menubar: false,
        plugins: [            
            "contextmenu paste"
        ],
        toolbar: "undo redo ",
        entity_encoding : "raw",
        valid_elements: "*[*]",
        // shouldn't be needed due to the valid_elements setting, but TinyMCE would strip script.src without it.
        extended_valid_elements: "script[type|defer|src|language]"

    });
}
//"advlist autolink lists link image charmap print preview anchor",
//"searchreplace visualblocks code fullscreen",
//"insertdatetime media table contextmenu paste"

function getPartFromEditorSelector(editorSelector) {

    var slices = editorSelector.split("_");
    var partType = slices[1].toString().toLowerCase();
    var editorId = slices[2];
    
    
    for (var i = 0; i < IEPageVM.parts().length; i++) {
        
        var p = IEPageVM.parts()[i];
        if ((p.partType().toString().toLowerCase() == partType.toString().toLowerCase()) && (p.contentItemId == editorId)) {
              return p;
        }
    }    
};
