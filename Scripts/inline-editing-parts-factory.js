function ClientPart(passedItemId, passedContents, passedPartType) {
    var self = this;
    self.partType = ko.observable(passedPartType);
    self.contentItemId = passedItemId;
    self.Contents = ko.observable(passedContents);

    //self.addEditor = function () {
    //    console.log('you should add an editor in the concrete part.');
    //};

    self.InitialContents = ko.observable(passedContents);
    self.isDirty = ko.computed(function () {
        var newval = (self.Contents() !== self.InitialContents())
        return newval;
    });

    self.isDirty.subscribe(function (newValue) {

        if (newValue == true) {
            var indexof = myIEPageVM.dirtyParts().indexOf(self);
            if (indexof == -1) {
                ko.utils.arrayPushAll(myIEPageVM.dirtyParts(), [self]);
            }

        }
        else {
            ko.utils.arrayRemoveItem(myIEPageVM.dirtyParts(), self);
        }
        myIEPageVM.dirtyParts.valueHasMutated();
    });
};

function giveMeABodyPart(passedItemId, passedContents, passedPartType) {

    var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

    clientPart.addEditor = function () {
        buildEditorForHtmlField(clientPart.contentItemId, "BodyPart");
    };

    return clientPart;
};

function giveMeATitlePart(passedItemId, passedContents, passedPartType) {

    var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

    clientPart.addEditor = function () {
        buildEditorForTextField(clientPart.contentItemId, "TitlePart");
    };

    return clientPart;
};


function giveMeAWidgetTitlePart(passedItemId, passedContents, passedPartType) {

    var clientPart = new ClientPart(passedItemId, passedContents, passedPartType);

    clientPart.addEditor = function () {
        buildEditorForTextField(clientPart.contentItemId, "WidgetTitlePart");
    };

    return clientPart;
};