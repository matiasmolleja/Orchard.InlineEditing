using Mmr.InlineEditing.ViewModels;
using Newtonsoft.Json;
using Orchard;
using Orchard.ContentManagement;
using Orchard.Core.Common.Models;
using Orchard.Core.Title.Models;
using Orchard.Data;
using Orchard.DisplayManagement;
using Orchard.Environment.Extensions;
using Orchard.Localization;
using Orchard.Logging;
using Orchard.Mvc;
using Orchard.Settings;
using Orchard.Widgets.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using System.Linq;

namespace Mmr.InlineEditing.Controllers
{
    [OrchardFeature("Mmr.InlineEditing")]
    [ValidateInput(false)]
    public class InlineEditingController : Controller
    {
        private readonly IContentManager _contentManager;
        private readonly ISiteService _siteService;
        private readonly IHttpContextAccessor _hca;

        public InlineEditingController(
            IHttpContextAccessor hca,
            IOrchardServices orchardServices,
            IContentManager contentManager,
            ITransactionManager transactionManager,
            ISiteService siteService,
            IShapeFactory shapeFactory)
        {

            _hca = hca;
            Services = orchardServices;
            _contentManager = contentManager;
            _siteService = siteService;
            T = NullLocalizer.Instance;
            Logger = NullLogger.Instance;
        }

        public IOrchardServices Services { get; private set; }
        public Localizer T { get; set; }
        public ILogger Logger { get; set; }



        [HttpPost]
        public JsonResult UpdateParts(string pageVM)
        {

            //Thread.Sleep(1500); Debug.
            InlineUpdatesViewModel updates = JsonConvert.DeserializeObject<InlineUpdatesViewModel>(pageVM);
                        
            List<InlineEditingPart> partsAfterUpdating = new List<InlineEditingPart>();

            // todo: add more validation cases here...
            if (updates == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                // todo: fix this. It wont work on the client.
                var errorClientNotification = new { MsgType = "error", Message = T("The updates are not valid.") }; //success-info-warning-error
                return Json(errorClientNotification);
            }


            foreach (var clientPart in updates.dirtyParts)
            {
                int contentItemId = (int)clientPart.contentItemId;
                var ci = _contentManager.Get(contentItemId);
                if (ci == null)
                {
                    clientPart.ErrorMessage = T("Content item can not be null").ToString();                    
                }                    

                if (clientPart.PartType.ToLower() == "bodypart")
                {
                    
                    var part = ci.As<BodyPart>();
                    
                    if (part == null)
                    {
                        clientPart.ErrorMessage = T("{0}:{1} Content item can not be null",  clientPart.PartType , clientPart.contentItemId.ToString()).ToString();                        
                    }
                    else
                    {
                        part.Text = clientPart.Contents;
                    }

                }
                else if (clientPart.PartType.ToLower() == "titlepart")
                {
                    var part = ci.As<TitlePart>();

                    if (part == null)
                    {
                        clientPart.ErrorMessage = T("{0}:{1} Content item can not be null", clientPart.PartType, clientPart.contentItemId.ToString()).ToString();                        
                    }
                    else
                    {
                        part.Title = clientPart.Contents;
                    }
                }
                else if (clientPart.PartType.ToLower() == "widgettitlepart")
                {
                    var part = ci.As<WidgetPart>();

                    if (part == null)
                    {
                        clientPart.ErrorMessage = T("{0}:{1} Content item can not be null", clientPart.PartType, clientPart.contentItemId.ToString()).ToString();                         
                    }
                    else
                    {
                        part.Title = clientPart.Contents;
                    }
                }
                
                partsAfterUpdating.Add(clientPart);

            }


            IEnumerable<InlineEditingPart> partsOnError = partsAfterUpdating.Where(p => p.ErrorMessage != string.Empty);
            if (partsOnError.Count() > 0)
            {
                // Removed when enabling  saving of only some of the parts of the bacth.
                // Todo: see if we can enable and still have this partial updates ability.
                // Services.TransactionManager.Cancel();
                
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(partsAfterUpdating);
            }


            Response.StatusCode = (int)HttpStatusCode.OK;
            var msg = new ErrorInformation("success", "Your changes has been accepted", 0, "-");
            var successClientNotification = msg;
            return Json(successClientNotification);
        }


        [HttpPost]
        public JsonResult UpdateSessionValues(bool editorMode, bool isCollapsed)
        {
            try
            {
                _hca.Current().Session["editorMode"] = editorMode;
                _hca.Current().Session["isCollapsed"] = isCollapsed;

                Response.StatusCode = (int)HttpStatusCode.OK;

                var successClientNotification = new { MsgType = "info", Message = "Your session values has been updated." };
                return Json(successClientNotification);

            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Session values can't be persisted.");
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                var errorClientNotification = new { MsgType = "warning", Message = T("Session values can't be persisted.") }; //info-warning-error                
                return Json(errorClientNotification);

            }

        }

    }
}