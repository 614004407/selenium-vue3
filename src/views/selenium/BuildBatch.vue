<template>
  <ShareTable :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  BuildBatchSchema,
  BuildBatchColumns,
  BuildBatchForm,
  BuildBatchData
} from "@/views/SharedFile/tableData";

let area = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:BuildBatchSchema(),
  columns:BuildBatchColumns(),
  form:BuildBatchForm(),
  data:BuildBatchData
})
//查询条件
let queryList = {
  startNum:0,
  pageSize:10,
}
onMounted( () => {
  queryTable()
});

//获取列表数据
async function queryTable(){

}

function addInformation(v){
  console.log(v);
}

function queryFunction(v){
  queryList.startNum = (v.current-1) * v.pageSize
  queryList.pageSize = v.pageSize
  queryTable()
}
</script>

<style scoped>

</style>
