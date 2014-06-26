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

        self.isEmpty = ko.computed(function () {
            var returnvalue = (!self.Contents() || 0 === self.Contents().length);
            return returnvalue;
        })
    };

    
    // People who wants to extend genericClientPart to enable inline editing in its own parts should call this method.
    // Then simply add new properties to it, as we do in this same file.
    inlineEditing.createGenericClientPart  = function (passedItemId, passedContents, passedPartType) {
        return new ClientPart(passedItemId, passedContents, passedPartType)
    };


    inlineEditing.createBodyPart =  function (passedItemId, passedContents, passedPartType, flavor) {
        var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

        if (flavor != 'markdown') {

            clientPart.addEditor = function () {
                inlineEditing.buildEditorForHtmlField(clientPart.contentItemId, "BodyPart");
            };
            clientPart.removeEditor = function () {
                inlineEditing.removeTinymceEditor(clientPart.contentItemId, "BodyPart");
            }
        }
        else {
            
            
            // Add a new property in bodymarkdown to bind the dialog editor content to the actual bodypart div.
            clientPart.htmlFromMdown = ko.observable('');
            
            // prepulating htmlFromMdown. Needed before we load the markdown dialog with its editor.
            var cnv = Markdown.getSanitizingConverter();
            clientPart.htmlFromMdown(cnv.makeHtml(clientPart.InitialContents()));

            clientPart.addEditor = function () {
                inlineEditing.BuildMarkDownEditorForBody("BodyPart", clientPart, inlineEditing.IEPageVM.BaseUrl, true);
            };
            clientPart.removeEditor = function () {
                inlineEditing.RemoveMarkDownEditor(clientPart);
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
