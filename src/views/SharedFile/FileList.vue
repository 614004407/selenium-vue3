<template>
  <BasicModal :title="props.title" :canFullscreen="false" destroyOnClose width="1200px" :centered="true"
              :showOkBtn="false" cancelText="关闭" :cancelText="'关闭'">
    <div style="position: relative;max-height: 700px">
      <div style="margin-bottom: 10px">
        当前文件：
        <a-select
          ref="select"
          v-model:value="fileUrl"
          style="width: 300px"
          @change="handleChange"
        >
          <a-select-option v-for="a in option" :value="a">{{ a.split("/")[(a.split("/").length - 1)] }}
          </a-select-option>
        </a-select>
        <a-button style="margin-left: 15px" type="primary" @click="Download"> 下载</a-button>
      </div>
      <div style="height: 650px;">
        <PdfView :file="fileMessage"></PdfView>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
import BasicModal from "/@/components/Modal/src/BasicModal.vue";
import { reactive, ref, watch } from "vue";
import { BasicColumn, BasicTable, useTable } from "/@/components/Table";
import { downloadFile } from "@/api/common/api";

const [registerTable, { setPagination, reload }] = useTable({});
//获取父页面传递的数据
const props = defineProps({
  userData: { type: Object },
  title: { type: String }
});
let fileUrl = ref("");
let option = ref([]);
let fileMessage = reactive({
  id: "",
  fileName: "文件.pdf",
  downloadUrl: ""
});

function handleChange() {
  fileMessage.downloadUrl = 'http://139.9.215.117:8091/selenium/sys/common/static/' + fileUrl.value;
  fileMessage.fileName = fileUrl.value
}

function Download(){
  const urls = 'http://139.9.215.117:8091/selenium/sys/common/static/' + fileUrl.value
  const name = fileUrl.value.split("/").at(-1)
  const x = new window.XMLHttpRequest()
  x.open('GET', urls, true)
  x.responseType = 'blob'
  x.onload = () => {
    const url = window.URL.createObjectURL(x.response)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }
  x.send()
}

watch(() => props.userData, () => {
  if (props.userData) {
    option.value = props.userData.data;
    fileUrl.value = props.userData.data[0]
    fileMessage.fileName = props.userData.data[0]
    fileMessage.downloadUrl = 'http://139.9.215.117:8091/selenium/sys/common/static/' + props.userData.data[0];
  }
}, { immediate: true, deep: true });

</script>

<style scoped lang="less">
:deep(.ant-descriptions-item-label) {
  width: 24%;
  min-width: 100px;
  max-width: 220px;
}

.tableBox {
  padding: 20px 20px -20px 20px;
  margin: 10px 20px 0 20px;
  height: 100%;

  :deep(.ant-table .cell) {
    line-height: 23px;
  }

  :deep(.ant-empty-normal) {
    margin: 150px 0;
  }

  :deep(.ant-table.ant-table-middle .ant-table-expanded-row-fixed) {
    height: 420px;
  }

  :deep(.ant-table-thead > tr > th) {
    background: #f8f8f9 !important;
    color: #515a64 !important;
    height: 40px !important;
    font-weight: bold;
  }

  ::-webkit-scrollbar {
    width: 0px;
    height: 8px;
  }
}
</style>
