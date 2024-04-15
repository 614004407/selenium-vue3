<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation" @edit="editInformation" @delete="deleteInformation" :TypeShow="2"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  ConfigurForm, ConfigurColumns, ConfigurData, ConfigurSchema, removeProperty
} from "@/views/SharedFile/tableData";
import { getBatchAdd, getBatchDelete, getBatchEdit, getBatchInfo, getBatchList } from "@/api/selenium/batch";
import { message, Modal } from "ant-design-vue";
import { getDatasheetAdd, getDatasheetDelete, getDatasheetEdit, getDatasheetList } from "@/api/selenium/datasheet";

const childmod = ref(null)
let BatchInfo = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:ConfigurSchema(),
  columns:ConfigurColumns(),
  form:ConfigurForm(BatchInfo),
  data:[]
})
//查询条件
let queryList = {
  datasheetName:'',
  batchName:'',
  pageNo:0,
  pageSize:10,
}
onMounted( () => {
  queryTable()
  getBatchinfo()
});

async function getBatchinfo(){
  let res = await getBatchInfo({})
  BatchInfo.value = res.result
}

function queryFunction(v){
  queryList.batchName = v.batchName
  queryList.datasheetName = v.datasheetName
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getDatasheetList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

async function addInformation(v){
  console.log(v);
  let res = await getDatasheetAdd(v)
  if(res.success){
    childmod.value.close()
    message.success(res.result);
    queryTable()
  }else{
    message.error(res.result);
  }
}

async function editInformation(v){
  console.log(v)
  let res = await getDatasheetEdit(v)
  if(res.success){
    childmod.value.close()
    message.success(res.result);
    queryTable()
  }else{
    message.error(res.result);
  }
}

async function deleteInformation(v) {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除所选项目？',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      let res = await getDatasheetDelete({id:v.id})
      if(res.success){
        message.success('删除成功！');
        queryTable()
      }else{
        message.warning('删除失败！');
      }
    },
  });
}
</script>

<style scoped>

</style>
