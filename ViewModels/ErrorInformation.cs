using Orchard.Environment.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mmr.InlineEditing.ViewModels
{
    [OrchardFeature("Mmr.InlineEditing")]
    public class ErrorInformation
    {
        public string ErrorType { get; set; }
        public string ErrorMessage { get; set; }
        public int ContentItemId { get; set; }
        public string PartName { get; set; }

        public ErrorInformation(string errorType, string errorMessage, int contentItemId, string partName)
        {
            ErrorType = errorType;
            ErrorMessage = errorMessage;
            ContentItemId = contentItemId;
            PartName = partName;
        }
        
    }
}