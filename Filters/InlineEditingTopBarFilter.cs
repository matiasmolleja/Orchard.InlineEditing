using Orchard;
using Orchard.DisplayManagement;
using Orchard.Environment.Extensions;
using Orchard.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Mmr.InlineEditing.Filters
{
    [OrchardFeature("Mmr.InlineEditing")]
    public class InlineEditingTopBarFilter : FilterProvider, IResultFilter
    {
        private readonly IWorkContextAccessor _wca;
        private readonly IShapeFactory _shapeFactory;

        public InlineEditingTopBarFilter(IWorkContextAccessor workContextAccessor, IShapeFactory shapeFactory)
        {
            _wca = workContextAccessor;
            _shapeFactory = shapeFactory;
        }

        public void OnResultExecuting(ResultExecutingContext filterContext)
        {
            if(filterContext.Result as ViewResult == null)  return;
            if (Orchard.UI.Admin.AdminFilter.IsApplied(filterContext.RequestContext)) return;
            if (filterContext.Result is PartialViewResult) return;

            _wca.GetContext(filterContext).Layout.Zones["Body"].Add(_shapeFactory.Create("InlineEditing_TopBar"), ":before");

        }

        public void OnResultExecuted(ResultExecutedContext filterContext) { }
        

    }
}