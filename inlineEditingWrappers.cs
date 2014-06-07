using Orchard;
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
                    displaying.ShapeMetadata.Wrappers.Add("InlineEditing_Body_Wrapper");
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