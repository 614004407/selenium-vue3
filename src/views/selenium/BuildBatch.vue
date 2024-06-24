<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation" @edit="editInformation" @delete="deleteInformation" :upload="true"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  BuildBatchSchema,
  BuildBatchColumns,
  BuildBatchForm,
  BuildBatchData, removeProperty
} from "@/views/SharedFile/tableData";
import {
  getProjectAdd,
  getProjectDelete,
  getProjectDictionary,
  getProjectEdit,
  getProjectIDQuery,
  getProjectList
} from "@/api/selenium/project";
import { message, Modal } from "ant-design-vue";
import { getBatchAdd, getBatchDelete, getBatchEdit, getBatchList } from "@/api/selenium/batch";
import { getEnterpriseEnterpriselist } from "@/api/selenium/Enterprise";

const childmod = ref(null)
let area = ref([])
let totalnum = ref(0)
let ProjectDictionary = ref([])
let Enterpriselist = ref([])
let Enterpriselist1 = ref([])
let Enterpriselist2 = ref([])
//表格参数
let ChemicalsData = reactive({
  schemas:BuildBatchSchema(Enterpriselist,Enterpriselist1,Enterpriselist2),
  columns:BuildBatchColumns(Enterpriselist),
  form:BuildBatchForm(ProjectDictionary,Enterpriselist,Enterpriselist1,Enterpriselist2),
  data:[]
})
//查询条件
let queryList = {
  pageNo:1,
  pageSize:10,
  batchName:'',
  projectName:'',
  prosecutionMode:'',
  enterpriseId:'',
}
onMounted( () => {
  getEnterpriselist()
  getProjectlist()
  queryTable()
});

async function getEnterpriselist(){
  let res = await getEnterpriseEnterpriselist({})
  Enterpriselist.value = res.result
  let res1 = await getEnterpriseEnterpriselist({stats:'1'})
  Enterpriselist1.value = res1.result
  let res2 = await getEnterpriseEnterpriselist({stats:'2'})
  Enterpriselist2.value = res2.result
}

async function getProjectlist(){
  let res = await getProjectDictionary({})
  ProjectDictionary.value = res.result
}

function queryFunction(v){
  queryList.batchName = v.batchName
  queryList.projectName = v.projectName
  queryList.prosecutionMode = v.prosecutionMode
  queryList.enterpriseId = v.enterpriseId
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getBatchList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

async function addInformation(v){
  console.log(v);
  v.batchCompress = 'batchCompress'
  let res = await getBatchAdd(v)
  if(res.success){
    childmod.value.close()
    message.success(res.result);
    queryTable()
  }else{
    message.error(res.result);
  }
}

async function editInformation(v){
  let res = await getBatchEdit(v)
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
      let res = await getBatchDelete({id:v.id})
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
