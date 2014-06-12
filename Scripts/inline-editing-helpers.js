(function (inlineEditing, $, undefined) {    

    // Helper to show markdown dialog. 
    //It is related to the viewmodel throug its methods "open", "close" and its observable propery "isOpen"
    ko.bindingHandlers.dialog = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            console.log(allBindingsAccessor);
            options.close = function () {
                console.log('close function');
                allBindingsAccessor().dialogVisible(false);
                console.log('unbinding clickoutside');
                $(".markdowndialog").unbind("clickoutside");
            };
            options.open = function () {
                console.log('open function');
                console.log('binding click outside. is open?');
                $(".markdowndialog").bind( "clickoutside", function(event){
                    console.log('is open?');
                    if (inlineEditing.IEPageVM.isOpen()) {
                        console.log('si');
                        //$(".markdowndialog").hide();
                        //inlineEditing.IEPageVM.close();
                    }
                });
            };

            $(element).dialog(options);


            //handle disposal 
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).dialog("destroy");
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            console.log('shouldBeOpen is :' + shouldBeOpen);
            var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible);
            $(element).dialog(shouldBeOpen ? "open" : "close");

        }
    };


    // Helper to unify toastr notifications through the UI
    inlineEditing.notify = function (MsgType, Message) {
        if (MsgType == 'error') {
            toastr.error(Message);
        }
        else if (MsgType == 'warning') {
            toastr.warning(Message);
        }
        else if (MsgType == 'success') {
            toastr.success(Message);
        }
        else {
            toastr.info(Message);
        }
    }

}(window.inlineEditing = window.inlineEditing || {}, jQuery));
