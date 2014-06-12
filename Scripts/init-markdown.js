(function (inlineEditing, $, undefined) {

    inlineEditing.BuildMarkDownEditorForBody = function (contentItemId, partName) {
        //not implemented: not needed yet
    };

    inlineEditing.RemoveMarkDownEditor = function (contentItemId, partName) {
        //not implemented: not needed yet
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




