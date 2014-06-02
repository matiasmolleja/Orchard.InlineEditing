using System.Web.Mvc;
using Orchard.Mvc.Filters;
using Orchard.UI.Resources;
using Orchard.Core.Settings;
using Orchard.Security;
using Orchard.Security.Permissions;
using Orchard.ContentManagement;
using Orchard.Core.Contents;
using Orchard.Environment.Extensions;

/* What you're now looking at is an extension point for the available filters in this Orchard application.
 * Filters in Orchard work based on MVC's filters, so please read the short tutorial available at
 * http://www.asp.net/mvc/tutorials/older-versions/controllers-and-routing/understanding-action-filters-cs
 * if you're not yet familiar with the basic concept.
 * 
 * "Fast forwarding Memory to a more recent one."
 * 
 * As you now know, filters in MVC are implementations of one of the four basic filter interfaces
 * (IActionFilter, IAuthorizationFilter, IResultFilter, IExceptionFilter) and can be applied to actions
 * using attributes. You can stick with that, but Orchard provides a little addition to that. If your filter
 * class inherits from FilterProvider, your filter will be applied to every request (so you don't have to
 * add attributes to any action for the filter to be applied), but you have to perform a check in
 * the filter's method(s) to determine whether it's necessary to run the code in the given method,
 * e.g. by checking a condition related to the context.
 */

namespace Mmr.InlineEditing.Filters
{
    // In our example, we'll create a ResultFilter spiced with Orchard stuff. Notice that you have to derive
    // from FilterProvider unless you want to implement IFilterProvider directly.
    [OrchardFeature("Mmr.InlineEditing")]
    public class ResourceFilter : FilterProvider, IResultFilter
    {
        // Let's inject a ResourceManager to be able to manage static resources like scripts or stylesheets.
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
            
            // This is a simple and elegant way to check if we're on Admin UI or not.
            if (Orchard.UI.Admin.AdminFilter.IsApplied(filterContext.RequestContext)) return;
            // This way we can check if the current request renders a PartialView.
            if (filterContext.Result is PartialViewResult) return;
            
            
           
            //if (_authorizer.Authorize( Permissions.CreateEditPermission(form.ContentType), form, T("Cannot edit content")))
            //    return new HttpUnauthorizedResult();
            
            if (!_authorizer.Authorize(Orchard.Core.Contents.Permissions.EditContent)) return;
            
            _resourceManager.Require("script", "Mmr.InlineEditing.Knockout-2.3.0").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.Tiny").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.PartsFactory").AtFoot();
            _resourceManager.Require("script", "Mmr.InlineEditing.InlineEditing").AtFoot();

            //_resourceManager.Include("style", "Mmr.InlineEditing.Style").AtHead();
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