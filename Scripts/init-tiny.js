//if (mediaLibraryEnabled) {
    mediaLibrary = "medialibrary";
//}

function buildEditorForHtmlField(contentItemId, partName) {
    tinymce.init({
        selector: ".mce_" + partName + "_" + contentItemId,
        inline: true,
        setup: function (editor) {
            editor.on('change', function (e) {
                console.log('change event', e);
                var part = getPartFromEditorId(e.target.id);
                //todo: differentiate between bodyparts(format:html) and titleParts(format:text)
                part.Contents(editor.getContent());
                console.log('contents changed to:' + part.Contents());
            })
        },
        menubar: false,
        plugins: [
            "advlist autolink lists  medialibrary link",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "cancel undo redo| styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | medialibrary link",
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
                var part = getPartFromEditorId(e.target.id);
                //todo: differentiate between bodyparts(format:html) and titleParts(format:text)
                part.Contents(editor.getContent({ format: 'text' }));
                console.log('contents changed to:' + part.Contents());
            })
        },
        menubar: false,
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste save"
        ],
        toolbar: "cancel undo redo ",
        entity_encoding : "raw",
        valid_elements: "*[*]",
        // shouldn't be needed due to the valid_elements setting, but TinyMCE would strip script.src without it.
        extended_valid_elements: "script[type|defer|src|language]"

    });
}


function getPartFromEditorId(editorSelector) {

    var slices = editorSelector.split("_");
    var partType = slices[1].toString().toLowerCase();
    var editorId = slices[2];
    
    
    for (var i = 0; i < myIEPageVM.parts().length; i++) {
        
        var p = myIEPageVM.parts()[i];
        if ((p.partType().toString().toLowerCase() == partType.toString().toLowerCase()) && (p.contentItemId == editorId)) {
              return p;
        }

    }
    
    //for (var i = 0; i < myIEPageVM.bodyParts().length; i++) {
    //    var p = myIEPageVM.bodyParts()[i];
    //    if (p.contentItemId==editorId) {
    //        return p;
    //    }
    //}
    
    //for (var i = 0; i < myIEPageVM.titleParts().length; i++) {
    //    var p = myIEPageVM.titleParts()[i];
    //    if (p.contentItemId == editorId) {
    //        return p;
    //    }
    //}

    //for (var i = 0; i < myIEPageVM.widgetTitleParts().length; i++) {
    //    var p = myIEPageVM.widgetTitleParts()[i];
    //    if (p.contentItemId == editorId) {
    //        return p;
    //    }
    //}

};
