<template>
  <ShareTable :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  BatchQuerySchema, BatchQueryColumns, BatchQueryData,
} from "@/views/SharedFile/tableData";

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
  startNum:0,
  pageSize:10,
}
onMounted( () => {
  queryTable()
});

//获取列表数据
async function queryTable(){

}

function queryFunction(v){
  queryList.startNum = (v.current-1) * v.pageSize
  queryList.pageSize = v.pageSize
  queryTable()
}
</script>

<style scoped>

</style>
