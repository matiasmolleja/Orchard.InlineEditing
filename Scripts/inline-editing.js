(function (inlineEditing, $, undefined) {

    //todo: reference json2.js library so ko.toJSON to work on older browsers: http://knockoutjs.com/documentation/json-data.html
    function InlineEditingPageViewModel() {
        var self = this;

        self.title = ko.observable('a title');
        self.isOpen = ko.observable(false);
        self.open = function (e) {
            //console.log(e);
            //if (self.editorMode) {
                self.isOpen(true);
            //}
            //$(".markdowndialog").bind("clickoutside", function (event) {
            //    console.log('closing');
            //    console.log('is open?');
            //    if (inlineEditing.IEPageVM.isOpen()) {
            //        console.log('si');
            //        inlineEditing.IEPageVM.close();
            //    }
            //});

            
        }
        self.close = function () {
            self.isOpen(false);
        }
        


        self.markdownString = ko.observable('initial markdown');

        // Vars Populated from topbar view on first load.
        self.antiForgeryToken = null;
        self.updateSessionValuesUrl = '';
        self.updatePartsUrl = '';
        self.BaseUrl = '';
        
        //Settings
        self.dialogPrefixClassSetting = 'dialog';

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
                self.removeEditors();
                self.resetToInitialValues();
                
            }
            self.updateSessionValues(newValue);
        });

        self.addEditors = function () {
            console.log('adding editors');
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.addEditor();
            });
        };

        self.removeEditors = function () {
            console.log('removingdddd editors');
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.removeEditor();
            });

            //tinymce.remove();
        };

        self.cleanAfterSaving = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.cleanAfterSaving();
            });
            var dirtyPartsAfterSaving = ko.utils.arrayFilter(self.dirtyParts(), function (item) {
                return item.isDirty();
            });
            console.log('dirtypartsAfterSaving has ' + dirtyPartsAfterSaving.length + ' parts.');
            self.dirtyParts(dirtyPartsAfterSaving);
            console.log('dirtyparts has ' + self.dirtyParts().length + ' parts.');
        }

        self.resetToInitialValues = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.returnToInitial();
            });
            self.dirtyParts([]);

            ko.utils.arrayForEach(self.parts(), function (item) {

                //console.log('initial contents ' + item.InitialContents());
                //console.log('contents ' + item.Contents());
                
            });
        }

        self.cancelChanges = function () {
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
                    pageVM: ko.toJSON(inlineEditing.IEPageVM),
                    __RequestVerificationToken: self.antiForgeryToken
                },
            }).done(function (result) {
                if (result) {
                    var notification = result;
                    inlineEditing.notify(notification.ErrorType, notification.ErrorMessage);
                    // reset every part: content equals to initial content.
                    self.cleanAfterSaving();
                } else {
                    inlineEditing.notify('error', 'There was an error: nothing returned from the server.');

                }
            }).fail(function (result) {

                var returnedParts = JSON.parse(result.responseText);
                
                for (var i = 0; i < returnedParts.length; i++) {
                    var returnedPart = returnedParts[i];
                    var clientPartOnError = self.partFromIdAndTypeName(returnedPart.contentItemId, returnedPart.PartType);
                    clientPartOnError.errorMessage(returnedPart.ErrorMessage);
                    if (clientPartOnError.errorMessage() != "") {
                        inlineEditing.notify('error', clientPartOnError.errorMessage());
                    }
                    else
                    {
                        inlineEditing.notify('success', clientPartOnError.partType() + ':' + clientPartOnError.contentItemId + ' was saved ok');
                    }
                }
                self.cleanAfterSaving();

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
    inlineEditing.IEPageVM = new InlineEditingPageViewModel();

    // Activates knockout.js
    ko.applyBindings(inlineEditing.IEPageVM);



}(window.inlineEditing = window.inlineEditing || {}, jQuery));






