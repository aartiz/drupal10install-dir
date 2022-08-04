/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  Drupal.AjaxCommands.prototype.viewsHighlight = function (ajax, response, status) {
    $('.hilited').removeClass('hilited');
    $(response.selector).addClass('hilited');
  };

  Drupal.AjaxCommands.prototype.viewsSetForm = function (ajax, response, status) {
    const $form = $('.js-views-ui-dialog form');
    const $submitButtons = $(once('views-ajax-submit', $form.find('input[type=submit].js-form-submit, button.js-form-submit')));
    $submitButtons.on('click mousedown', function () {
      this.form.clk = this;
    });
    once('views-ajax-submit', $form).forEach(form => {
      const $form = $(form);
      const elementSettings = {
        url: response.url,
        event: 'submit',
        base: $form.attr('id'),
        element: form
      };
      const ajaxForm = Drupal.ajax(elementSettings);
      ajaxForm.$form = $form;
    });
  };

  Drupal.AjaxCommands.prototype.viewsShowButtons = function (ajax, response, status) {
    $('div.views-edit-view div.form-actions').removeClass('js-hide');

    if (response.changed) {
      $('div.views-edit-view div.view-changed.messages').removeClass('js-hide');
    }
  };

  Drupal.AjaxCommands.prototype.viewsTriggerPreview = function (ajax, response, status) {
    if ($('input#edit-displays-live-preview').is(':checked')) {
      $('#preview-submit').trigger('click');
    }
  };

  Drupal.AjaxCommands.prototype.viewsReplaceTitle = function (ajax, response, status) {
    const doc = document;
    const oldTitle = doc.title;
    const escapedSiteName = response.siteName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const re = new RegExp(`.+ (.) ${escapedSiteName}`);
    doc.title = oldTitle.replace(re, `${response.title} $1 ${response.siteName}`);
    document.querySelectorAll('h1.page-title').forEach(item => {
      item.textContent = response.title;
    });
  };

  Drupal.theme.tableDragChangedWarning = function () {
    return [];
  };

  Drupal.behaviors.livePreview = {
    attach(context) {
      $(once('views-ajax', 'input#edit-displays-live-preview', context)).on('click', function () {
        if ($(this).is(':checked')) {
          $('#preview-submit').trigger('click');
        }
      });
    }

  };
  Drupal.behaviors.syncPreviewDisplay = {
    attach(context) {
      $(once('views-ajax', '#views-tabset a')).on('click', function () {
        const href = $(this).attr('href');
        const displayId = href.substr(11);
        const viewsPreviewId = document.querySelector('#views-live-preview #preview-display-id');

        if (viewsPreviewId) {
          viewsPreviewId.value = displayId;
        }
      });
    }

  };
  Drupal.behaviors.viewsAjax = {
    collapseReplaced: false,

    attach(context, settings) {
      const baseElementSettings = {
        event: 'click',
        progress: {
          type: 'fullscreen'
        }
      };
      once('views-ajax', 'a.views-ajax-link', context).forEach(link => {
        const $link = $(link);
        const elementSettings = baseElementSettings;
        elementSettings.base = $link.attr('id');
        elementSettings.element = link;

        if ($link.attr('href')) {
          elementSettings.url = $link.attr('href');
        }

        Drupal.ajax(elementSettings);
      });
      once('views-ajax', 'div#views-live-preview a').forEach(link => {
        const $link = $(link);

        if (!$link.attr('href')) {
          return true;
        }

        const elementSettings = baseElementSettings;
        elementSettings.url = $link.attr('href');

        if (Drupal.Views.getPath(elementSettings.url).substring(0, 21) !== 'admin/structure/views') {
          return true;
        }

        elementSettings.wrapper = 'views-preview-wrapper';
        elementSettings.method = 'replaceWith';
        elementSettings.base = link.id;
        elementSettings.element = link;
        Drupal.ajax(elementSettings);
      });
      once('views-ajax', 'div#views-live-preview input[type=submit]').forEach(submit => {
        const $submit = $(submit);
        $submit.on('click', function () {
          this.form.clk = this;
          return true;
        });
        const elementSettings = baseElementSettings;
        elementSettings.url = $(submit.form).attr('action');

        if (Drupal.Views.getPath(elementSettings.url).substring(0, 21) !== 'admin/structure/views') {
          return true;
        }

        elementSettings.wrapper = 'views-preview-wrapper';
        elementSettings.method = 'replaceWith';
        elementSettings.event = 'click';
        elementSettings.base = submit.id;
        elementSettings.element = submit;
        Drupal.ajax(elementSettings);
      });
    }

  };
})(jQuery, Drupal, drupalSettings);