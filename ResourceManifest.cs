﻿using Orchard.UI.Resources;

namespace Mmr.InlineEditing
{
    // Define our scripts and styles in the Orchard's Way.
    public class ResourceManifest : IResourceManifestProvider
    {
        public void BuildManifests(ResourceManifestBuilder builder)
        {
            var manifest = builder.Add();

            // Custom styles and scripts for the module.
            manifest
                .DefineStyle("Mmr.InlineEditing.Style")
                .SetUrl("mmr-inlineediting.css");
            
            manifest
                .DefineScript("Mmr.InlineEditing.InlineEditing")
                .SetUrl("inline-editing.js")
                .SetDependencies("jQuery");
            
            manifest
                .DefineScript("Mmr.InlineEditing.PartsFactory")
                .SetUrl("inline-editing-parts-factory.js")
                .SetDependencies("jQuery");

            manifest
                .DefineScript("Mmr.InlineEditing.Helpers")
                .SetUrl("inline-editing-helpers.js")
                .SetDependencies("jQuery");
            

            // TinyMce 4.0.26 init and styles.
            // At the thime of writing Orchard still uses version 3.5. For inline editing I preferred a newer version.
            // So until Orchard updates its version of TinyMce there will be two versions: 
            // the older one for the Dashboard and the new one for inline editing in the frontend.
            // I wrote a new version of the MediaLibrary TinyMce plugin in order to enable media items insertion.
            manifest
                .DefineScript("Mmr.InlineEditing.InitTiny")
                .SetUrl("init-tiny.js")
                .SetDependencies("jQuery");
            
            manifest
                .DefineScript("Mmr.InlineEditing.Tiny")
                .SetUrl("tinymce/tinymce.min.js")
                .SetDependencies("jQuery");

            
            // Knockout to enable the kind of responsive UI I'm looking for.
            manifest
                .DefineScript("Mmr.InlineEditing.Knockout-2.3.0")
                .SetUrl("knockout-2.3.0.js")
                .SetDependencies("jQuery");


            // FontAwesome is used until I fix basic features. Then maybe I will replace it by image icons.
            manifest
                .DefineStyle("Mmr.FontAwesome.321")
                .SetUrl("font-awesome/css/font-awesome.min.css");


            // Toastr is used for notifications. The module uses JQuery Ajax calls to update the UI and I can't find
            // an easy way of using Orchard Framework notifications without reloading the page.
            manifest
                .DefineScript("Mmr.InlineEditing.toastr")
                .SetUrl("toastr.min.js")
                .SetDependencies("jQuery");

            manifest
                .DefineStyle("Mmr.InlineEditing.toastr")
                .SetUrl("toastr.css");       
     
            //// Marked to include markDown to html edition. Markdown is used only while editing a part. What is retrieved and sent to the browser is always html.
            //manifest
            //    .DefineScript("Mmr.InlineEditing.Marked")
            //    .SetUrl("marked/marked.min.js", "marked/lib/marked.js");
            
            manifest
                .DefineScript("Mmr.InlineEditing.InitMarkdown")
                .SetUrl("init-markdown.js")
                .SetDependencies("jQuery");

            manifest
                .DefineScript("Mmr.InlineEditing.MmrMarkDownMediaLibrary")
                .SetUrl("markdown/mmr-markdown-media-library.js")
                .SetDependencies("jQuery");

            manifest.DefineStyle("Mmr.InlineEditing.OrchardMarkdown")
                .SetUrl("mmr-inline-editing-markdown.css");

            //  Ben Alman's ClickOutside script. Used by markdown modal jquery ui dialog
            // https://github.com/cowboy/jquery-outside-events
            manifest.DefineScript("Mmr.InlineEditing.ClickOutside")
                .SetUrl("jquery.ba-outside-events.min.js")
                .SetDependencies("jQuery");

        }
    }
}