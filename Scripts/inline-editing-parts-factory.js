﻿(function (inlineEditing, $, undefined) {


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

        // After saving parts this function is called.
        // The part only change to clean only if errorMessage == string
        self.cleanAfterSaving = function () {
            if (self.errorMessage() != "") {
                return;
            }
            var c = self.Contents();
            self.InitialContents(c);
        };
        self.returnToInitial = function () {
            var c = self.InitialContents();
            self.Contents(c);
        };
        self.errorMessage = ko.observable("");
    };

    inlineEditing.createBodyPart =  function (passedItemId, passedContents, passedPartType, flavor) {

        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        console.log('passed part type is : ' + passedPartType + flavor);
        if (flavor!= 'markdown') {
            clientPart.addEditor = function () {
                inlineEditing.buildEditorForHtmlField(clientPart.contentItemId, "BodyPart");
            };
            clientPart.removeEditor = function () {
                inlineEditing.removeTinymceEditor(clientPart.contentItemId, "BodyPart");
            }
        }
        else {
            clientPart.addEditor = function () {
                inlineEditing.BuildMarkDownEditorForBody(clientPart.contentItemId, "BodyPart");
            };
            clientPart.removeEditor = function () {
                // This is not implemented. We don't need to remove a markdown editor,
                // hidding it it's enough                
            }
        }

        return clientPart;
    };

    inlineEditing.createTitlePart= function (passedItemId, passedContents, passedPartType) {

        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        clientPart.addEditor = function () {
            inlineEditing.buildEditorForTextField(clientPart.contentItemId, "TitlePart");
        };

        clientPart.removeEditor = function () {
            inlineEditing.removeTinymceEditor(clientPart.contentItemId, "TitlePart");
        }


        return clientPart;
    };


    inlineEditing.createWidgetTitlePart = function (passedItemId, passedContents, passedPartType) {

        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        clientPart.addEditor = function () {
            inlineEditing.buildEditorForTextField(clientPart.contentItemId, "WidgetTitlePart");
        };

        clientPart.removeEditor = function () {
            inlineEditing.removeTinymceEditor(clientPart.contentItemId, "WidgetTitlePart");
        }

        return clientPart;
    }

}(window.inlineEditing = window.inlineEditing || {}, jQuery));
