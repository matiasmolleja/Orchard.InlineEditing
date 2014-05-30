// MODEL PARTS
function BodyPart(passedItemId, passedContents) {
    var self = this;
    self.isDirty = false;
    self.contentItemId = passedItemId;
    self.Contents = ko.observable(passedContents);
    self.isCurrentlyEditedItem = ko.observable(false);
};


function WidgetTitlePart(passedItemId, passedContents) {
    var self = this;    
    self.contentItemId = passedItemId;
    self.isDirty = false;
    self.Contents = ko.observable(passedContents);
    self.isCurrentlyEditedItem = ko.observable(false);
};


function TitlePart(passedItemId, passedContents) {
    var self = this;
    self.contentItemId = passedItemId;
    self.isDirty = false;
    self.Contents = ko.observable(passedContents);
    self.isCurrentlyEditedItem = ko.observable(false);
};
//todo: reference json2.js library for ko.toJSON to work on older browsers: http://knockoutjs.com/documentation/json-data.html
    function InlineEditingPageViewModel() {
        var self = this;
        self.name = "a name";
        self.editorsAlreadyLoaded = false;
        self.editorMode = ko.observable(false);
        self.CurrentlyEditedItemId = ko.observable(0);
        self.antiForgeryToken=null,
        self.bodyParts = ko.observableArray([]);
        self.widgetTitleParts = ko.observableArray([]);
        self.titleParts = ko.observableArray([]);
        self.updateSessionValuesUrl;
        self.saveDraftActionUrl;

        // logic to show and hide Action Buttons on the ui
        self.showEditorIconForContentsPart = ko.computed(function () {
            return (self.editorMode()); //&& (!self.contentsPart().isCurrentlyEditedItem());
        });
        self.showActionsButtonsForContentsPart = ko.computed(function () {
            return (self.editorMode()); // && (self.contentsPart().isCurrentlyEditedItem());
        });

        self.toggleEditorMode = function () {
            
            var newValue = false;
            if (self.editorMode() == false) {
                newValue = true;
            }
            self.editorMode(newValue);
            
            
        };
        // Operations

        //self.cancelContentPartEditing = function () {
        //    self.contentsPart().isCurrentlyEditedItem(false);
        //};

        
        self.saveEditedPage = function () {
            console.log('trying to save the contents' + self.antiForgeryToken);
            //var folderPath = $(this).data('media-path');
            console.log( 'version : ' + tinyMCE.majorVersion);// + '.' + tinymce.minorVersion;

            for (var i = 0; i < self.bodyParts().length; i++) {
                var bp = self.bodyParts()[i];
                var bpItemId = bp.contentItemId;
                console.log('bodypart' + bp + ':' + bpItemId);
                var idofcontrol = 'mce_BodyPart_' + bpItemId;
                console.log(idofcontrol);
                bp.Contents = tinyMCE.get(idofcontrol).getContent();
                console.log(idofcontrol);
            }

            for (var i = 0; i < self.titleParts().length; i++) {
                var tp = self.titleParts()[i];
                var tpItemId = tp.contentItemId;
                var idofcontrol = 'mce_TitlePart_' + tpItemId;
                tp.Contents = tinyMCE.get(idofcontrol).getContent({ format: 'text' });
                console.log(tp.titleContents);
                console.log(idofcontrol);
            }

            for (var i = 0; i < self.widgetTitleParts().length; i++) {
                var wtp = self.widgetTitleParts()[i];
                var wtpItemId = wtp.contentItemId;
                console.log('widget title part ' + wtp + ':' + wtpItemId);
                wtp.Contents = tinyMCE.get('mce_WidgetTitlePart_' + wtpItemId).getContent({ format: 'text' });
            }

            

            //var mceContents = $("#mce_bodyPart_12").getContent();
            //var retrievedMceContents = tinyMCE.get('mce_bodyPart_' + contentsContentItemId).getContent();
            
            //console.log("retrieved with id dinamic: " + retrievedMceContents);

            $.ajax({
                type: "POST",
                url: self.saveDraftActionUrl,
                dataType: "json",
                traditional: true,
                data: {                    
                    pageVM: ko.toJSON(myIEPageVM),
                    __RequestVerificationToken: self.antiForgeryToken
                },
            }).done(function (result) {
                if (result) {
                    var notification = result; // JSON.parse(result.responseText);
                    Notify(notification.MsgType, notification.Message);
                    console.log(notification.Message);

                } else {                    
                    Notify('error', 'There was an error: nothing returned from the server.')
                    console.log('There was an error: nothing returned from the server.');
                }
            }).fail(function (result) {
                var notification= JSON.parse(result.responseText);
                Notify(notification.MsgType, notification.Message);                
                console.log(notification.MsgType + ':' + notification.Message);
            });

        };

        self.editorMode.subscribe(function (newValue) {

            console.log("Editor mode is: " + newValue);

            if ((newValue == true) && (self.editorsAlreadyLoaded == false)) {

                console.log("initializing editors");
                console.log("bodyparts length: " + self.bodyParts().length);
                for (var i = 0; i < self.bodyParts().length; i++) {
                    console.log("initializing editors for bodyparts");
                    var itemId = self.bodyParts()[i].contentItemId;
                    buildEditorForHtmlField(itemId, "BodyPart");
                    console.log("initializing editors for bodyparts");

                };
                console.log("title parts length: " + self.titleParts().length);
                for (var i = 0; i < self.titleParts().length; i++) {
                    
                    var itemId = self.titleParts()[i].contentItemId;
                    buildEditorForTextField(itemId, "TitlePart");
                    console.log("initializing editors for titlepars");
                };
                console.log("widgettitle parts length: " + self.widgetTitleParts().length);
                for (var i = 0; i < self.widgetTitleParts().length; i++) {
                    var itemId = self.widgetTitleParts()[i].contentItemId;
                    buildEditorForTextField(itemId, "WidgetTitlePart");
                    console.log("initializing editors for widgetTitleParts");
                };


            }
            //update session with editor mode. todo: check if it is better using cookies.
            $.ajax({
                type: "POST",
                url: self.updateSessionValuesUrl,
                dataType: "json",
                traditional: true,
                data: {
                    editorMode: newValue,
                    __RequestVerificationToken: self.antiForgeryToken
                },
            }).done(function (result) {
                if (result) {
                    //var notification = result; // JSON.parse(result.responseText);
                    //Notify(notification.MsgType, notification.Message);
                    //console.log(notification.Message);

                } else {
                    //Notify('error', 'There was an error: nothing returned from the server.')
                    //console.log('There was an error: nothing returned from the server.');
                }
            }).fail(function (result) {
                var notification = JSON.parse(result.responseText);
                Notify(notification.MsgType, notification.Message);
                console.log(notification.MsgType + ':' + notification.Message);
            });
            

        });

    };

var myIEPageVM = new InlineEditingPageViewModel();
// Activates knockout.js
ko.applyBindings(myIEPageVM);



var Notify = function (MsgType, Message) {

    if (MsgType== 'error') {
        toastr.error(Message);
    }
    else if(MsgType == 'warning') {
        toastr.warning(Message);
    }
    else if(MsgType == 'success')
    {        
        toastr.success(Message);
    }
    else {
        toastr.info(Message);
    }    
}