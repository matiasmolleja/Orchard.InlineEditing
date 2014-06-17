The Inline Editing Module provides inline editing to Orchard. It allows a non technical user to quickly edit the content of the site without having to go to the Dashboard and locate the content items that he/she wants to edit. This way an user simply needs to browse the site and edit the content in place.

To achieve this the module uses knockout and ajax so the user experience is very fluid with minimal page reloads.

Right now it works with body, title and widget title parts.

For body parts the module shows a Markdown editor or a TinyMCE editor depending on what flavor the body has.

To use it, simply enable the module,  log in with an user account that has edit permissions and use the top bar.

Once you enable Editor Mode in the top bar you can edit contents.

The module informs you if you have unsaved changes and emits a warning if you try to leave the page without saving.

Note:
Because it relies heavily in tinymce, It uses and includes tinyMCE 4 for the frontend without interfering with the backend. In the future, when/if Orchard updates tinyMCE to the latest version, it will use the tinymce module.
