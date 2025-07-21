document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('input[id$="_content"], input[id$="_contentSpoiler"]').forEach(function (input) {
    input.addEventListener("input", function () {
      const idBase = input.id.replace(/(_content|_contentSpoiler)$/, '');
      const isSpoiler = input.id.endsWith("_contentSpoiler");
      const previewId = idBase + (isSpoiler ? "_spoiler_preview" : "_preview");
      const previewEl = document.getElementById(previewId);

      if (previewEl) {
        if (previewEl.tagName === "IMG") {
          // Image preview
          previewEl.src = input.value;
        } else if (previewEl.tagName === "I") {
          // Font Awesome icon preview
          previewEl.className = input.value;
        }
      }
    });
  });
});