using Orchard;
using Orchard.DisplayManagement;
using Orchard.Environment.Extensions;
using Orchard.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Orchard.Security;

namespace Mmr.InlineEditing.Filters
{
    [OrchardFeature("Mmr.InlineEditing")]
    public class InlineEditingTopBarFilter : FilterProvider, IResultFilter
    {
        private readonly IWorkContextAccessor _wca;
        private readonly IShapeFactory _shapeFactory;
        private readonly IAuthorizer _authorizer;

        public InlineEditingTopBarFilter(
            IWorkContextAccessor workContextAccessor,
            IShapeFactory shapeFactory,
            IAuthorizer authorizer)
        {
            _wca = workContextAccessor;
            _shapeFactory = shapeFactory;
            _authorizer = authorizer;
        }

        public void OnResultExecuting(ResultExecutingContext filterContext)
        {
            if(filterContext.Result as ViewResult == null)  return;
            if (Orchard.UI.Admin.AdminFilter.IsApplied(filterContext.RequestContext)) return;
            if (filterContext.Result is PartialViewResult) return;
            if (!_authorizer.Authorize(Orchard.Core.Contents.Permissions.EditContent)) return;           


            _wca.GetContext(filterContext).Layout.Zones["Body"].Add(_shapeFactory.Create("InlineEditing_TopBar"), ":before");

        }

        public void OnResultExecuted(ResultExecutedContext filterContext) { }

    }
}