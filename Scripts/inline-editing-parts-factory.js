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

var giveMeADirtynessIndicator = function ()
{    var self = this;
    self.name = ko.observable('dirtyname');
    self.shouldShow = ko.observable(true);
    return self;
}