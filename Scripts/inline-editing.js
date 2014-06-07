//todo: reference json2.js library so ko.toJSON to work on older browsers: http://knockoutjs.com/documentation/json-data.html
function InlineEditingPageViewModel() {
    var self = this;
    
    // Vars Populated from topbar view on first load.
    self.antiForgeryToken = null;
    self.updateSessionValuesUrl = '';
    self.updatePartsUrl = '';

    // Editable Parts. Populated from each view on first load: body.wrapper, title.wrapper, widgettitle.wrapper
    self.parts = ko.observableArray([]);
        

    // Dirty Parts. To keep track of parts changed
    self.dirtyParts = ko.observableArray([]);
    self.isDirty = new ko.computed(function () {
        return self.dirtyParts().length > 0;
    });


    // EditorMode On/Off
    self.editorMode = ko.observable(false);
    self.toggleEditorMode = function () {
        var newValue = false;
        if (self.editorMode() == false) {
            newValue = true;
        }

        if ((newValue == false) && (self.isDirty())) {
            var confirmation = confirm('You have unsaved changes that will be lost.Are you sure?');
            if (confirmation == false) {
                return;
            }
            else {
                self.resetToInitialValues();
            }
        }
        self.editorMode(newValue);
    };

    self.editorMode.subscribe(function (newValue) {

        if (newValue == true) {
            self.addEditors();
        }
        else {
            self.resetToInitialValues();
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
    
    self.cleanAfterSaving = function () {
        ko.utils.arrayForEach(self.parts(), function (item) {
            item.cleanAfterSaving();
        });

        self.dirtyParts([]);

    }

    self.resetToInitialValues = function () {
        ko.utils.arrayForEach(self.parts(), function (item) {
            item.returnToInitial();
        });
        self.dirtyParts([]);
    }


    // Collapse bar
    self.isCollapsed = ko.observable(false);
    self.collapseBar = function () {
        var newValue = !self.isCollapsed();
        self.isCollapsed(newValue);
    };


    // helper functions
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


    // Server Calls
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
                var notification = result;
                Notify(notification.ErrorType, notification.ErrorMessage);
                // reset every part: content equals to initial content.
                self.cleanAfterSaving();
            } else {
                Notify('error', 'There was an error: nothing returned from the server.')
            }
        }).fail(function (result) {
            var notification = JSON.parse(result.responseText);
            Notify(notification.MsgType, notification.Message);
        });

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
                //console.log(notification.Message);
            } else {
                //Notify('error', 'There was an error: nothing returned from the server.')
                //console.log('There was an error: nothing returned from the server.');
            }
        }).fail(function (result) {
            var notification = JSON.parse(result.responseText);
            Notify(notification.MsgType, notification.Message);
        });
    }


};

// Main knokout viewmodel
var IEPageVM = new InlineEditingPageViewModel();
// Activates knockout.js
ko.applyBindings(IEPageVM);
