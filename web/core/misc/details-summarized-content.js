/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(($, Drupal) => {
  function DetailsSummarizedContent(node) {
    this.$node = $(node);
    this.setupSummary();
  }

  $.extend(DetailsSummarizedContent, {
    instances: []
  });
  $.extend(DetailsSummarizedContent.prototype, {
    setupSummary() {
      this.$detailsSummarizedContentWrapper = $(Drupal.theme('detailsSummarizedContentWrapper'));
      this.$node.on('summaryUpdated', $.proxy(this.onSummaryUpdated, this)).trigger('summaryUpdated').find('> summary').append(this.$detailsSummarizedContentWrapper);
    },

    onSummaryUpdated() {
      const text = this.$node.drupalGetSummary();
      this.$detailsSummarizedContentWrapper.html(Drupal.theme('detailsSummarizedContentText', text));
    }

  });
  Drupal.behaviors.detailsSummary = {
    attach(context) {
      DetailsSummarizedContent.instances = DetailsSummarizedContent.instances.concat(once('details', 'details', context).map(details => new DetailsSummarizedContent(details)));
    }

  };
  Drupal.DetailsSummarizedContent = DetailsSummarizedContent;

  Drupal.theme.detailsSummarizedContentWrapper = () => `<span class="summary"></span>`;

  Drupal.theme.detailsSummarizedContentText = text => text ? ` (${text})` : '';
})(jQuery, Drupal);