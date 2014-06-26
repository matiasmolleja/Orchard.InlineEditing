using Orchard.UI.Resources;

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
            
            manifest
                .DefineScript("Mmr.InlineEditing.InitTiny")
                .SetUrl("init-tiny.js")
                .SetDependencies("jQuery");

            manifest
                .DefineScript("Mmr.InlineEditing.InitMarkdown")
                .SetUrl("init-markdown.js")
                .SetDependencies("jQueryUI");


            manifest.DefineStyle("Mmr.InlineEditing.OrchardMarkdown")
                .SetUrl("mmr-inline-editing-markdown.css");

            manifest.DefineScript("Mmr.InlineEditing.Markdown_Converter").SetUrl("markdown/Markdown.Converter.js");
            manifest.DefineScript("Mmr.InlineEditing.Markdown_Sanitizer").SetUrl("markdown/Markdown.Sanitizer.js").SetDependencies("Markdown_Converter");
            manifest.DefineScript("Mmr.InlineEditing.Markdown_Editor").SetUrl("markdown/Markdown.Editor.js").SetDependencies("Markdown_Sanitizer");


            // External Dependencies

            // Knockout
            manifest
                .DefineScript("Mmr.InlineEditing.Knockout-2.3.0")
                .SetUrl("knockout-2.3.0.js")
                .SetDependencies("jQuery");

            // At the thime of writing Orchard still uses version 3.5. For inline editing I preferred a newer version.
            // So until Orchard updates its version of TinyMce there will be two versions: 
            // the older one for the Dashboard and the new one for inline editing in the frontend.
            // I wrote a new version of the MediaLibrary TinyMce plugin in order to enable media items insertion.
            manifest
                .DefineScript("Mmr.InlineEditing.Tiny")
                .SetUrl("tinymce/tinymce.min.js")
                .SetDependencies("jQuery");


            // FontAwesome is used until I fix basic features. Then maybe I will replace it by image icons.
            manifest
                .DefineStyle("Mmr.FontAwesome.321")
                .SetUrl("font-awesome/css/font-awesome.min.css");


            // Toastr is used for notifications. The module uses JQuery Ajax calls to update the UI and I can't find
            // an easy way of using Orchard Framework notifications without reloading the page.
            // https://github.com/CodeSeven/toastr
            manifest
                .DefineScript("Mmr.InlineEditing.toastr")
                .SetUrl("toastr.min.js")
                .SetDependencies("jQuery");

            manifest
                .DefineStyle("Mmr.InlineEditing.toastr")
                .SetUrl("toastr.css");       
     

            // TopBar Dropdown
            // https://github.com/gilbitron/Dropit
            // The original script has been modified to enable fading of dropdown, hence the change in the name of the file.
            manifest.DefineScript("Mmr.InlineEditing.Dropit")
                .SetUrl("dropit/inline-dropit.js")
                .SetDependencies("jQuery");

            // Dialogextend to allow markdown jquery ui dialog be maximized
            // https://github.com/ROMB/jquery-dialogextend
            manifest.DefineScript("Mmr.InlineEditing.DialogExtend")
                .SetUrl("dialogextend/inline.jquery.dialogextend.js")
                .SetDependencies("jQueryUI");            
            
        }
    }
}