using Orchard;
using Orchard.ContentManagement;
using Orchard.ContentManagement.MetaData;
using Orchard.Core.Contents;
using Orchard.Data;
using Orchard.DisplayManagement;
using Orchard.Localization;
using Orchard.Logging;
using Orchard.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Web;
using System.Web.Mvc;
using Orchard.UI.Notify;
using Orchard.Mvc.Extensions;
using Orchard.Core.Common.Models;
using Orchard.Mvc;
using Orchard.Services;
using Mmr.InlineEditing.ViewModels;
using System.Net;
using Orchard.Core.Title.Models;
using Orchard.Widgets.Models;
using Orchard.Exceptions;
using System.IO;
using System.Threading;
using Orchard.Environment.Extensions;

// Todo: enable localization through the use of T()
// Todo: tinymce editors are still enabled when editormode is off.
// Todo: spinner floated to the right. Or inside the Save Button, replacing the disk icon.
// Todo: limit scope of my scripts as explained in Dojo Course.
// Todo: minify css and script files (don't forget the tinyMce MediaLibrary plugin).
// Todo: check different themes.
// Todo: warning when leaving the page with unsaved changes.
// Todo: warning when switching off editorMode if unsaved changes.
// Todo: new lines in body give error.
// Todo: title parts and widget title parts should not have new lines. Or, if it can, it should escape invalid characters.
// Todo: check if we can delete DecodeHtml.
// Todo: topbar is hiding title. See if we can apply some css to the body to move it down the height of the topbar. Or at least allow collapsing of topbar.

namespace Mmr.InlineEditing.Controllers
{
    [OrchardFeature("Mmr.InlineEditing")]
    [ValidateInput(false)]
    public class InlineEditingController : Controller , IUpdateModel
    {

        private readonly IContentManager _contentManager;
        private readonly IContentDefinitionManager _contentDefinitionManager;
        private readonly ITransactionManager _transactionManager;
        private readonly ISiteService _siteService;
        private readonly IWorkContextAccessor _wca;
        private readonly IHttpContextAccessor _hca;

        public InlineEditingController(
            IWorkContextAccessor wca,
            IHttpContextAccessor hca,
            IOrchardServices orchardServices,
            IContentManager contentManager,
            IContentDefinitionManager contentDefinitionManager,
            ITransactionManager transactionManager,
            ISiteService siteService,
            IShapeFactory shapeFactory) {
                _wca = wca;
                _hca = hca;
                Services = orchardServices;
                _contentManager = contentManager;
                _contentDefinitionManager = contentDefinitionManager;
                _transactionManager = transactionManager;
                _siteService = siteService;
                T = NullLocalizer.Instance;
                Logger = NullLogger.Instance;                
        }

        public IOrchardServices Services { get; private set; }
        public Localizer T { get; set; }
        public ILogger Logger { get; set; }

        

        [HttpPost]
        public JsonResult ChangeTextAjax(string pageVM)
        {

            //Thread.Sleep(1500);
           InlineUpdatesViewModel updates= JsonConvert.DeserializeObject<InlineUpdatesViewModel>(pageVM);

           List<ErrorInformation> errors = new List<ErrorInformation>();
            // todo: add more validation cases here...
            if (updates==null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                var errorClientNotification = new { MsgType = "error", Message = T("The updates are not valid.") }; //success-info-warning-error
                return Json(errorClientNotification);
            }

            

            foreach (var clientPart in updates.dirtyParts)
            {
                int contentItemId = (int)clientPart.contentItemId;
                var ci = _contentManager.Get(contentItemId);
                if (ci == null)
                    errors.Add(new ErrorInformation("error", "content item can not be null", contentItemId, "BodyPart"));

                if (clientPart.PartType.ToLower()== "bodypart")
                {

                    var part = ci.As<BodyPart>();

                    if (part == null)
                        errors.Add(new ErrorInformation("error", "content item can not be null", contentItemId, "BodyPart"));


                    part.Text = clientPart.Contents;

                }
                else if (clientPart.PartType.ToLower() == "titlepart")
                {
                    var part = ci.As<TitlePart>();

                    if (part == null)
                        errors.Add(new ErrorInformation("error", "content item can not be null", contentItemId, "TitlePart"));


                    part.Title = clientPart.Contents;
                }
                else if (clientPart.PartType.ToLower() == "widgettitlepart")
                {
                    var part = ci.As<WidgetPart>();

                    if (part == null)
                        errors.Add(new ErrorInformation("error", "content item can not be null", contentItemId, "WidgetTitlePart"));


                    part.Title = clientPart.Contents;
                }
                
            }

            if (errors.Count>0)
            {
                Services.TransactionManager.Cancel();
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                
                var errorClientNotification = new { MsgType = "error", Message = "FUNCIONA LA VALIDACION." }; //info-warning-error

                return Json(errorClientNotification);
            }
            
            
            Response.StatusCode = (int)HttpStatusCode.OK;
            var msg = new ErrorInformation("success", "Your changes has been accepted", 0, "-");
            var successClientNotification = msg;
               return Json(successClientNotification);        
        
        
        }


        [HttpPost]
        public JsonResult UpdateSessionValues(bool editorMode)
        {
            try
            {
                _hca.Current().Session["editorMode"] = editorMode;

                Response.StatusCode = (int)HttpStatusCode.OK;

                var successClientNotification = new { MsgType = "info", Message = "Your changes has been accepted" };
                return Json(successClientNotification);                 
        
            }
            catch (Exception ex)
            {               
                Logger.Error(ex, "Editor Mode can't be persisted.");
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                var errorClientNotification = new { MsgType = "warning", Message = T("Editor Mode can't be persisted.") }; //info-warning-error                
                return Json(errorClientNotification);

            }
            
        }

        [HttpPost]
        public ActionResult Publish(int id, string returnUrl)
        {
            var contentItem = _contentManager.GetLatest(id);
            if (contentItem == null)
                return HttpNotFound();

            if (!Services.Authorizer.Authorize(Permissions.PublishContent, contentItem, T("Couldn't publish content")))
                return new HttpUnauthorizedResult();

            _contentManager.Publish(contentItem);

            
            Services.Notifier.Information(string.IsNullOrWhiteSpace(contentItem.TypeDefinition.DisplayName) ? T("That content has been published.") : T("That {0} has been published.", contentItem.TypeDefinition.DisplayName));


            //todo repair invalid url behavior.
            return this.RedirectLocal(returnUrl, () => RedirectToAction("List"));
        }

        //todo: remove this, IUpdater is not needed at this moment.
        public void AddModelError(string key, LocalizedString errorMessage)
        {
            ModelState.AddModelError(key, errorMessage.ToString());
        }

        public new bool TryUpdateModel<TModel>(TModel model, string prefix, string[] includeProperties, string[] excludeProperties) where TModel : class
        {
            throw new NotImplementedException();
        }

        //private string DecodeHtml(string htmlEncodedString)
        //{            
        //    StringWriter writer = new StringWriter();
        //    Server.HtmlDecode(htmlEncodedString, writer);
        //    return writer.ToString();            
        //}
    }
}