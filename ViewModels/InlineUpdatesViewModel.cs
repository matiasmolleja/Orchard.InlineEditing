using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mmr.InlineEditing.ViewModels
{
    public class InlineUpdatesViewModel
    {
        public bool EditorMode { get; set; }
        public IEnumerable<InlineEditingBodyPart>  bodyParts { get; set; }
        public IEnumerable<InlineEditingTitlePart> titleParts{ get; set; }
        public IEnumerable<InlineEditingWidgetTitlePart> widgetTitleParts { get; set; }

    }

    public class InlineEditingBodyPart
    {
        public int contentItemId { get; set; }
        public string Contents { get; set; }
        public bool isCurrentlyEditedItem { get; set; }
    }

    public class InlineEditingTitlePart
    {
        public int contentItemId { get; set; }
        public string Contents { get; set; }
        public bool isCurrentlyEditedItem { get; set; }

    }


    public class InlineEditingWidgetTitlePart
    {
        public int contentItemId { get; set; }
        public string Contents { get; set; }
        public bool isCurrentlyEditedItem { get; set; }

    }


    
//function WidgetTitlePart(passedItemId, passedContents) {
//    var self = this;
//    self.contentItemId = passedItemId;
//    self.titleContents = ko.observable(  passedContents + ":" + self.contentItemId);
//    self.isCurrentlyEditedItem = ko.observable(false);
//};


//function TitlePart(passedItemId, passedContents) {
//    var self = this;
//    self.contentItemId = passedItemId;
//    self.titleContents = ko.observable(passedContents + ":" + self.contentItemId);
//    self.isCurrentlyEditedItem = ko.observable(false);
//};

}