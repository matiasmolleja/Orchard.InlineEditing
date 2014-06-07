using Orchard.Environment.Extensions;
using Orchard.Mvc.Filters;
using Orchard.Security;
using Orchard.UI.Resources;
using System.Web.Mvc;

namespace Mmr.InlineEditing.Filters
{

    [OrchardFeature("Mmr.InlineEditing")]
    public class ResourceFilter : FilterProvider, IResultFilter
    {
        private readonly IResourceManager _resourceManager;
        private readonly IAuthorizer _authorizer;

        public ResourceFilter(IResourceManager resourceManager, IAuthorizer authorizer)
        {
            _resourceManager = resourceManager;
            _authorizer = authorizer;
        }
        
        // This method will be called after the action result is executed.
        public void OnResultExecuted(ResultExecutedContext filterContext) { }

        // This method will be called before the action result is executed.
        public void OnResultExecuting(ResultExecutingContext filterContext)
        {
            
            // We will show our UI only in frontend.
            if (Orchard.UI.Admin.AdminFilter.IsApplied(filterContext.RequestContext)) return;
            // This way we can check if the current request renders a PartialView.
            if (filterContext.Result is PartialViewResult) return;
            
            // Check edit permissions
            if (!_authorizer.Authorize(Orchard.Core.Contents.Permissions.EditContent)) return;
            
            // Load our scripts and styles. Defined in ResourceManifest.
            _resourceManager.Require("script", "Mmr.InlineEditing.Knockout-2.3.0").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.Tiny").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.PartsFactory").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.Helpers").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.InlineEditing").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.InitTiny").AtFoot();
            _resourceManager.Require("script", "jQueryColorBox").AtFoot();
            _resourceManager.Require("stylesheet", "jQueryColorBox");
            _resourceManager.Require("stylesheet", "Mmr.InlineEditing.Style");
            _resourceManager.Require("stylesheet", "Mmr.FontAwesome.321");
            _resourceManager.Require("script", "Mmr.InlineEditing.toastr");
            _resourceManager.Require("stylesheet", "Mmr.InlineEditing.toastr");

        }


    }
}