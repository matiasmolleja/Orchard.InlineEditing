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
            var indexof = IEPageVM.dirtyParts().indexOf(self);
            if (indexof == -1) {
                ko.utils.arrayPushAll(IEPageVM.dirtyParts(), [self]);
            }
        }
        else {
            ko.utils.arrayRemoveItem(IEPageVM.dirtyParts(), self);
        }
        IEPageVM.dirtyParts.valueHasMutated();
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

function createBodyPart(passedItemId, passedContents, passedPartType) {

    var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

    clientPart.addEditor = function () {
        buildEditorForHtmlField(clientPart.contentItemId, "BodyPart");
    };

    return clientPart;
};

function createTitlePart(passedItemId, passedContents, passedPartType) {

    var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

    clientPart.addEditor = function () {
        buildEditorForTextField(clientPart.contentItemId, "TitlePart");
    };

    return clientPart;
};


function createWidgetTitlePart(passedItemId, passedContents, passedPartType) {

    var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

    clientPart.addEditor = function () {
        buildEditorForTextField(clientPart.contentItemId, "WidgetTitlePart");
    };

    return clientPart;
};
