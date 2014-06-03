﻿//todo: reference json2.js library for ko.toJSON to work on older browsers: http://knockoutjs.com/documentation/json-data.html
    function InlineEditingPageViewModel() {
        var self = this;
        self.editorMode = ko.observable(false);
        self.CurrentlyEditedItemId = ko.observable(0);
        self.antiForgeryToken = null;
        
        self.parts = ko.observableArray([]);
        self.dirtyness = new giveMeADirtynessIndicator();

        //self.aGivenPart = ko.computed giveMeABodyPart(56, 'passedContents', 'passedPartType');
        self.myPart = ko.computed(function (data) {
            console.log('computing' + data);
            return ko.observable('my computed' + data );
        });

        //function (data) {
           
        //    console.log(data);
        //    return ko.observable('ksdkjhkfs');
        //}

        self.dirtyParts = ko.observableArray([]);
        self.isDirty = new ko.computed(function () {
            return self.dirtyParts().length > 0;
        });

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


        
        self.saveEditedPage = function () {
            console.log('trying to save the contents' + self.antiForgeryToken);
            //var folderPath = $(this).data('media-path');
            console.log( 'version : ' + tinyMCE.majorVersion);// + '.' + tinymce.minorVersion;

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
                    console.log('saved ok:' + notification.ErrorType + ':' + notification.ErrorMessage);
                    Notify(notification.ErrorType, notification.ErrorMessage);
                    // reset everypart: content equals to initial content.
                    self.setInitialContentsEqualToContents();
                    //self.dirtyParts().removeAll();
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

            if (newValue == true) {
                self.addEditors();
            }
            else {
                self.removeEditors();
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

        // todo: the logic for creating an editor should reside on a function inside each part.(open to extension closed to modif).
        self.addEditors = function () {
            console.log('adding editors');
            ko.utils.arrayForEach(self.parts(), function (item) {                
                item.addEditor();                
            });                     

        };
        self.removeEditors = function () {
            tinymce.remove();
        };

        self.setInitialContentsEqualToContents = function () {
            console.log('setInitialContentsEqualToContents');
            //for (var i = 0; i < myIEPageVM.bodyParts().length; i++) {
            //    var p = myIEPageVM.bodyParts()[i];
            //    var v = p.Contents;
            //    p.initialContents(v);
            //}

            //for (var i = 0; i < myIEPageVM.titleParts().length; i++) {
            //    var p = myIEPageVM.titleParts()[i];
            //    var v = p.Contents;
            //    p.initialContents(v);
            //}

            //for (var i = 0; i < myIEPageVM.widgetTitleParts().length; i++) {
            //    var p = myIEPageVM.widgetTitleParts()[i];
            //    var v = p.Contents;
            //    p.initialContents(v);
            //}
        }
        // todo: Delete make dirty and make clean
        self.makeDirty = function () {
        };
        self.makeClean = function () {
        };
        self.aMsg = ko.observable('hola');
        self.partFromId = function (data) {
            if (self.parts()[0] == undefined) {
                return 'unde';
            }
            else {
                //return self.parts()[0].isDirty();
                return ko.utils.arrayFirst(self.parts(), function (item) {
                    //console.log('pregunto is data: ' + data + ' equals to item.contentitemid:'  + item.contentItemId  );
                    return data === item.contentItemId;
                });
            }

            
        };
    };


var myIEPageVM = new InlineEditingPageViewModel();
// Activates knockout.js
ko.applyBindings(myIEPageVM);



var Notify = function (MsgType, Message) {
    console.log('notifiying...' + MsgType + ':' + Message);
    if (MsgType== 'error') {
        toastr.error(Message);
    }
    else if(MsgType == 'warning') {
        toastr.warning(Message);
    }
    else if(MsgType == 'success')
    {
        console.log('showing toastr');
        toastr.success(Message);
    }
    else {
        toastr.info(Message);
    }    
}