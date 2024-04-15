<template>
  <ShareTable :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  BatchQuerySchema, BatchQueryColumns, BatchQueryData, removeProperty
} from "@/views/SharedFile/tableData";
import { getBatchList } from "@/api/selenium/batch";

let area = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:BatchQuerySchema(),
  columns:BatchQueryColumns(),
  form:[],
  data:BatchQueryData
})
//查询条件
let queryList = {
  batchName:'',
  projectName:'',
  batchProcessState:'',
  batchTreatmentState:'',
  pageNo:1,
  pageSize:10,
}
onMounted( () => {
  queryTable()
});

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getBatchList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

function queryFunction(v){
  queryList.batchName = v.batchName
  queryList.projectName = v.projectName
  queryList.batchProcessState = v.batchProcessState
  queryList.batchTreatmentState = v.batchTreatmentState
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}
</script>

<style scoped>

</style>
