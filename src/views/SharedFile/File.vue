<template>
  <div style="height: 100%">
    <div class="d-flex f-jc-c" v-if="fileMessage.imgShow">
      <img :src="fileMessage.downloadUrl" />
    </div>

    <div v-show="fileMessage.fileName.endsWith('pdf')">

      <vue-office-pdf
        :src="fileMessage.downloadUrl"
        :style="{ width: '100%', height: '640px' }"
      />
    </div>

    <div v-show="fileMessage.fileName.endsWith('docx')">

      <div>
      <vue-office-docx
        :src="fileMessage.downloadUrl"
        :style="{ width: '100%', height: '640px',position: 'relative' ,textAlign: 'center',overflowY: 'auto'}"
      />
      </div>
    </div>

    <div v-if="fileMessage.audioShow">
      <audio id="myaudio" :src="fileMessage.downloadUrl" controls="controls" preload="preload">
        不支持audio标签
      </audio>
    </div>

    <div class="d-flex f-jc-c" v-if="fileMessage.videoShow">
      <video preload="auto" align="center" controls="true">
        <source :src="fileMessage.downloadUrl" type="video/mp4" />
      </video>
    </div>

    <div v-if="fileMessage.otherShow"></div>

  </div>
</template>

<script lang="ts" setup>
import VueOfficePdf from '@vue-office/pdf'
import VueOfficeDocx from "@vue-office/docx";
import Video from 'video.js';

import 'video.js/dist/video-js.css';
import { computed, onMounted, reactive, watch } from "vue";
import { isEmpty } from "lodash-es";

interface Props {

  file: any

}

interface Emits {

  (event: 'downLoadFile', id: string | number): void
}

interface FileMessage {

  fileId: string | number,

  fileName: string,

  downloadUrl: string,

  imgShow: boolean,

  docShow: boolean,

  pdfShow:boolean,

  excelShow: boolean,

  audioShow: boolean,

  videoShow: boolean,

  //其他不能预览的
  otherShow: boolean,

}

interface FileStyle {

  height: string,

  width: string
}

const $props = defineProps<Props>();

const $emits = defineEmits<Emits>();

const file = computed(() => $props.file);

// 文件信息
const fileMessage = reactive<FileMessage>({

  fileId: '',

  fileName: '',

  downloadUrl: '',

  imgShow: false,

  docShow: false,

  pdfShow:false,

  excelShow: false,

  audioShow: false,

  videoShow: false,

  //其他不能预览的
  otherShow: false,
})

const fileStyle = reactive<FileStyle>({

  height: '640px',

  width: '100%'

})

// 判断文件类型
const judgeFileType = () => {
  console.log(file.value);

  fileMessage.fileName = file.value.fileName;

  fileMessage.downloadUrl = file.value.downloadUrl;

  fileMessage.fileId = file.value.id;

  console.log(fileMessage.downloadUrl, 'fileMessage');

  if (

    fileMessage.fileName.endsWith('png') ||

    fileMessage.fileName.endsWith('jpg') ||

    fileMessage.fileName.endsWith('jpeg') ||

    fileMessage.fileName.endsWith('gif')

  ) {
    //图片
    fileMessage.imgShow = true;

  } else if (

    fileMessage.fileName.endsWith('docx') ||

    fileMessage.fileName.endsWith('doc') ||

    fileMessage.fileName.endsWith('pptx') ||

    fileMessage.fileName.endsWith('ppt') ||

    fileMessage.fileName.endsWith('txt')

  ) {

    //doc
    fileMessage.docShow = true;

  } else if (

    fileMessage.fileName.endsWith('pdf')

  ) {

    //doc
    fileMessage.pdfShow = true;

  } else if (fileMessage.fileName.endsWith('xlsx') || fileMessage.fileName.endsWith('xls')) {

    //excel
    fileMessage.excelShow = true;

  }
  else if (fileMessage.fileName.endsWith('mp3')) {

    fileMessage.audioShow = true;
  }
  else if (fileMessage.fileName.endsWith('mp4')) {

    fileMessage.videoShow = true;

  } else {

    // fileMessage.otherShow = true;
    $emits('downLoadFile', fileMessage.fileId);

  }

}

onMounted(async () => {

  await judgeFileType();

})

watch(() => $props.file, (newValue) => {
  !isEmpty(newValue) && judgeFileType()
}, {
  immediate: true,deep:true
})

</script>

<style scoped lang="less">
img {
  width: 50%;
}

audio {
  width: 100%;
}

video {
  width: 30%;
}

.child {
  // width: 100%;
  // height: 100%;
  scrolling: no;
  frameborder: 0;
  border: 0;
  marginwidth: 0;
  marginheight: 0;
}
</style>
