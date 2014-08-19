(function (inlineEditing, $, undefined) {

    //todo: reference json2.js library so ko.toJSON to work on older browsers: http://knockoutjs.com/documentation/json-data.html
    function InlineEditingPageViewModel() {
        var self = this;

        // Vars Populated from topbar view on first load.
        self.antiForgeryToken = null;
        self.updateSessionValuesUrl = '';
        self.updatePartsUrl = '';
        self.BaseUrl = '';

        
        // Editable Parts. Populated from each view on first load: body.wrapper, title.wrapper, widgettitle.wrapper
        self.parts = ko.observableArray([]);


        // Dirty Parts. To keep track of parts changed
        self.dirtyParts = ko.observableArray([]);
        self.isDirty = new ko.computed(function () {
            return self.dirtyParts().length > 0;
        }).extend({ throttle: 500 });

        self.bindHtmlFromMd = function (mybodypart) {
            return ko.computed({
                read: function () {
                    if (!mybodypart) {
                       return '';
                    }                   
                    if (typeof mybodypart.htmlFromMdown === 'function') {
                        return mybodypart.htmlFromMdown();
                    }
                }
            }, self);
            
        };


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
            self.updateSessionValues();
        });

        self.addEditors = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.addEditor();
            });
        };

        self.removeEditors = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.removeEditor();
            });            
        };

        self.cleanAfterSaving = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.cleanAfterSaving();
            });
            var dirtyPartsAfterSaving = ko.utils.arrayFilter(self.dirtyParts(), function (item) {
                return item.isDirty();
            });
            self.dirtyParts(dirtyPartsAfterSaving);            
        }

        self.resetToInitialValues = function () {
            ko.utils.arrayForEach(self.parts(), function (item) {
                item.returnToInitial();
            });
            self.dirtyParts([]);
        }

        self.cancelChanges = function () {
            self.resetToInitialValues();
            self.removeEditors();
            self.addEditors();
        }


        // Collapse bar
        self.isCollapsed = ko.observable(false);
        self.toggleCollapseBar = function () {
            var newValue = !self.isCollapsed();
            self.isCollapsed(newValue);            
        };

        self.isCollapsed.subscribe(function (newValue) {
            if (newValue!= self.isCollapsed) {
                self.updateSessionValues();                
            }            
        });



        // Markdown Dialog
        self.mddialogPreviewEnabled = ko.observable(false);
        self.toggleMddialogPreview = function () {
            var newValue = !self.mddialogPreviewEnabled();
            self.mddialogPreviewEnabled(newValue);
        }
        self.closeMarkdownDialog = function () {
           $('.mddialog-closer').dialog("close");
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

        self.updateSessionValues = function () {

            $.ajax({
                type: "POST",
                url: self.updateSessionValuesUrl,
                dataType: "json",
                traditional: true,
                data: {
                    editorMode: self.editorMode(),
                    isCollapsed : self.isCollapsed(),
                    __RequestVerificationToken: self.antiForgeryToken
                },
            }).done(function (result) {
                if (result) {
                    //console.log(notification.Message);
                } else {
                    //Notify('error', 'There was an error: nothing returned from the server.')
                    console.log('There was an error: nothing returned from the server.');
                }
            }).fail(function (result) {
                var notification = JSON.parse(result.responseText);
                Notify(notification.MsgType, notification.Message);
                console.log('There was an error when updating session values.');
            });
        }
    };

    

    // Main knokout viewmodel
    inlineEditing.IEPageVM = new InlineEditingPageViewModel();

    // Activates knockout.js
    ko.applyBindings(inlineEditing.IEPageVM);



}(window.inlineEditing = window.inlineEditing || {}, jQuery));






