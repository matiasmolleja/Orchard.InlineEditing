(function (inlineEditing, $, undefined) {


    function ClientPart(passedItemId, passedContents, passedPartType) {
        var self = this;
        self.partType = ko.observable(passedPartType);
        self.contentItemId = passedItemId;
        self.Contents = ko.observable(passedContents);
        self.InitialContents = ko.observable(passedContents);
        self.isDirty = ko.computed(function () {
            var newval = (self.Contents() !== self.InitialContents())
            return newval;
        });

        self.isDirty.subscribe(function (newValue) {

            if (newValue == true) {
                var indexof = inlineEditing.IEPageVM.dirtyParts().indexOf(self);
                if (indexof == -1) {
                    ko.utils.arrayPushAll(inlineEditing.IEPageVM.dirtyParts(), [self]);
                }
            }
            else {
                ko.utils.arrayRemoveItem(inlineEditing.IEPageVM.dirtyParts(), self);
            }
            inlineEditing.IEPageVM.dirtyParts.valueHasMutated();
        });
        self.cleanAfterSaving = function () {
            var c = self.Contents();
            self.InitialContents(c);
        };
        self.returnToInitial = function () {
            var c = self.InitialContents();
            self.Contents(c);
        };
    };

    inlineEditing.createBodyPart =  function (passedItemId, passedContents, passedPartType) {

        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        clientPart.addEditor = function () {
            inlineEditing.buildEditorForHtmlField(clientPart.contentItemId, "BodyPart");
        };

        return clientPart;
    };

    inlineEditing.createTitlePart= function (passedItemId, passedContents, passedPartType) {

        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        clientPart.addEditor = function () {
            inlineEditing.buildEditorForTextField(clientPart.contentItemId, "TitlePart");
        };

        return clientPart;
    };


    inlineEditing.createWidgetTitlePart = function (passedItemId, passedContents, passedPartType) {

        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        clientPart.addEditor = function () {
            inlineEditing.buildEditorForTextField(clientPart.contentItemId, "WidgetTitlePart");
        };

        return clientPart;
    }

}(window.inlineEditing = window.inlineEditing || {}, jQuery));
