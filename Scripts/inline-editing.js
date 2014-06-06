//todo: reference json2.js library for ko.toJSON to work on older browsers: http://knockoutjs.com/documentation/json-data.html
    function InlineEditingPageViewModel() {
        var self = this;
        self.editorMode = ko.observable(false);
        self.isCollapsed = ko.observable(false);
        self.CurrentlyEditedItemId = ko.observable(0);
        self.antiForgeryToken = null;
        
        self.parts = ko.observableArray([]);

        self.dirtyParts = ko.observableArray([]);
        self.isDirty = new ko.computed(function () {
            return self.dirtyParts().length > 0;
        });

        self.updateSessionValuesUrl='';
        self.updatePartsUrl = '';

        self.toggleEditorMode = function () {            
            var newValue = false;
            if (self.editorMode() == false) {
                newValue = true;
            }
            self.editorMode(newValue);
        };

        self.collapseBar = function () {
            var newValue = !self.isCollapsed();
            self.isCollapsed(newValue);
        };
        
        self.saveEditedPage = function () {
        
            $.ajax({
                type: "POST",
                url: self.updatePartsUrl,
                dataType: "json",
                traditional: true,
                data: {                    
                    pageVM: ko.toJSON(IEPageVM),
                    __RequestVerificationToken: self.antiForgeryToken
                },
            }).done(function (result) {
                if (result) {
                    
                    var notification = result; // JSON.parse(result.responseText);
                    console.log('saved ok:' + notification.ErrorType + ':' + notification.ErrorMessage);
                    Notify(notification.ErrorType, notification.ErrorMessage);
                    // reset everypart: content equals to initial content.
                    self.cleanAfterSaving();
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

            self.updateSessionValues(newValue);
            
        });

        self.addEditors = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {                
                item.addEditor();                
            });
        };

        self.removeEditors = function () {
            tinymce.remove();
        };

        self.updateSessionValues = function (newValue) {

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
        }
        self.cleanAfterSaving = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.cleanAfterSaving();
            });

            self.dirtyParts([]);

        }


        // Utility functions 
        self.partFromIdAndTypeName = function (contentItemId, partTypeName) {
            partTypeName = partTypeName.toLowerCase();
            
            if (self.parts()[0] == undefined) {
               return 'null';
            }
            else {
                return ko.utils.arrayFirst(self.parts(), function (item) {
                    return ((contentItemId == item.contentItemId) && (partTypeName == item.partType().toString().toLowerCase()));
                });
            }
        };
    };


var IEPageVM = new InlineEditingPageViewModel();
// Activates knockout.js
ko.applyBindings(IEPageVM);



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