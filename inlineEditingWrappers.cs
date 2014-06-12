using Orchard;
using Orchard.ContentManagement;
using Orchard.Core.Common.Models;
using Orchard.Core.Common.Settings;
using Orchard.DisplayManagement.Descriptors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mmr.InlineEditing
{
    // We use this to attach our wrappers to the parts that will be editable: body, title, and widget title
    public class inlineEditingWrappers :IShapeTableProvider
    {
        public void Discover(ShapeTableBuilder builder)
        {

            builder.Describe("Parts_Common_Body").OnDisplaying(displaying =>
            {
                if (!displaying.ShapeMetadata.DisplayType.Contains("Admin"))
                {
                    ContentItem contentItem = (ContentItem)displaying.Shape.ContentItem; // Model.ContentItem;
                    BodyPart bodyPart = contentItem.As<BodyPart>();

                    var typePartSettings = bodyPart.Settings.GetModel<BodyTypePartSettings>();
                    var flavor = (typePartSettings != null && !string.IsNullOrWhiteSpace(typePartSettings.Flavor))
                               ? typePartSettings.Flavor
                               : bodyPart.PartDefinition.Settings.GetModel<BodyPartSettings>().FlavorDefault;

                    if (flavor!="markdown")
                    {
                        displaying.ShapeMetadata.Wrappers.Add("InlineEditing_Body_Wrapper");
                    }
                    else
                    {
                        displaying.ShapeMetadata.Wrappers.Add("InlineEditing_BodyMarkdown_Wrapper");
                    }


                    
                }

            });

            builder.Describe("Parts_Title").OnDisplaying(displaying =>
            {
                if (!displaying.ShapeMetadata.DisplayType.Contains("Admin"))
                {
                    displaying.ShapeMetadata.Wrappers.Add("InlineEditing_Title_Wrapper");
                }
            });

            builder.Describe("Widget").OnDisplaying(displaying =>
            {
                if (!displaying.ShapeMetadata.DisplayType.Contains("Admin"))
                {
                    displaying.ShapeMetadata.Wrappers.Remove("Widget_Wrapper");
                    displaying.ShapeMetadata.Wrappers.Add("InlineEditing_Widget_Wrapper");
                }
            });

        }
    }
}