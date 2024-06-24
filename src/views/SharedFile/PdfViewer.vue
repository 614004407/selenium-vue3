<template>
  <div class="pdf-viewer">
    <canvas ref="pdfCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getDocument } from 'pdfjs-dist/webpack';

export default {
  name: 'PdfViewer',
  setup() {
    const pdfCanvas = ref(null);
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;

    function renderPage(num) {
      pageRendering = true;
      pdfDoc.getPage(num).then((page) => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
          if (!pageRendering) {
            return;
          } else {
            pageRendering = false;
            if (pageNumPending !== null) {
              renderPage(pageNumPending);
              pageNumPending = null;
            }
          }
        });
      });
      document.getElementById('pdfCanvas').appendChild(canvas);
    }

    onMounted(() => {
      const loadingTask = getDocument('path/to/your/pdf/file.pdf');
      loadingTask.promise.then((pdf) => {
        pdfDoc = pdf;
        renderPage(pageNum);
      });
    });

    return {
      pdfCanvas,
    };
  },
};
</script>
