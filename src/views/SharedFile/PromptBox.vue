<template>
  <BasicModal destroyOnClose title="提示">
    {{title}}
    <template #footer>
      <a-button @click="handleClose">确认</a-button>
      <a-button @click="handleClose">取消</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
import  BasicModal  from '/@/components/Modal/src/BasicModal.vue';
import { onMounted, ref, watch } from "vue";
import {BasicColumn, BasicTable, useTable} from "/@/components/Table";
import { useModalInner } from "@/components/Modal";

let schemas = ref([])
let emit = defineEmits(['closeModal'])
//获取父页面传递的数据
const props = defineProps({
  userData: {type: Object},
  title:{
    type: String,
    default: '提示',
  },
})
let formdata = ref({})


function closeModal(){
  emit("closeModal")
}


watch(() => props.userData,   () => {
  if(props.userData){

  }
}, {immediate: true,deep: true});

</script>

<style scoped lang="less">
:deep(.ant-descriptions-item-label){
  width: 24%;
  min-width:100px;
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

  :deep(.ant-table.ant-table-middle .ant-table-expanded-row-fixed){
    height: 420px;
  }

  :deep(.ant-table-thead > tr > th) {
    background: #f8f8f9 !important;
    color: #515a64 !important;
    height: 40px!important;
    font-weight: bold;
  }
  ::-webkit-scrollbar {
    width: 0px;
    height: 8px;
  }
}
</style>
