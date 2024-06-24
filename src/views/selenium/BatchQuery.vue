<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @resetFun="resetFun" @edit="addInformation" :TypeShow="5"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  BatchQuerySchema, BatchQueryColumns, BatchQueryData, removeProperty
} from "@/views/SharedFile/tableData";
import { getBatchList, gettableedit } from "@/api/selenium/batch";
import { getEnterpriseEnterpriselist } from "@/api/selenium/Enterprise";
import { getProjectAdd } from "@/api/selenium/project";
import { message } from "ant-design-vue";

const childmod = ref(null)
let area = ref([])
let totalnum = ref(0)
let Enterpriselist = ref([])
let Enterpriselist1 = ref([])
let Enterpriselist2 = ref([])
//表格参数
let ChemicalsData = reactive({
  schemas:BatchQuerySchema(Enterpriselist,Enterpriselist1,Enterpriselist2),
  columns:BatchQueryColumns(Enterpriselist),
  form:[],
  data:[]
})
//查询条件
let queryList = {
  batchName:'',
  projectName:'',
  batchProcessState:'',
  batchTreatmentState:'',
  prosecutionMode:'',
  enterpriseId:'',
  pageNo:1,
  pageSize:10,
}
onMounted( () => {
  getEnterpriselist()
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

async function addInformation(v){
  let res = await gettableedit(v)
  if(res.success){
    childmod.value.close()
    message.success(res.result);
    queryTable()
  }else{
    message.error(res.result);
  }
}

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getBatchList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

function resetFun(){
  queryTable()
}

function queryFunction(v){
  queryList.batchName = v.batchName
  queryList.projectName = v.projectName
  queryList.prosecutionMode = v.prosecutionMode
  queryList.enterpriseId = v.enterpriseId
  queryList.batchProcessState = v.batchProcessState
  queryList.batchTreatmentState = v.batchTreatmentState
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}
</script>

<style scoped>

</style>
