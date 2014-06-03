﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mmr.InlineEditing.ViewModels
{
    public class InlineUpdatesViewModel
    {
        public bool EditorMode { get; set; }
        public IEnumerable<InlineEditingPart> parts { get; set; }
        public IEnumerable<InlineEditingPart> dirtyParts { get; set; }

    }

    public class InlineEditingPart
    {
        public int contentItemId { get; set;  }
        public string Contents { get; set; }
        public string PartType { get; set; }
        
    }
    public class InlineEditingBodyPart
    {
        public int contentItemId { get; set; }
        public string Contents { get; set; }
    }

    public class InlineEditingTitlePart
    {
        public int contentItemId { get; set; }
        public string Contents { get; set; }
    }


    public class InlineEditingWidgetTitlePart
    {
        public int contentItemId { get; set; }
        public string Contents { get; set; }
    }
}