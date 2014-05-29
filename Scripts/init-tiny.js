//if (mediaLibraryEnabled) {
    mediaLibrary = "medialibrary";
//}

function buildEditorForHtmlField(contentItemId, partName) {
    tinymce.init({
        selector: ".mce_" + partName + "_" + contentItemId,
        inline: true,
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
