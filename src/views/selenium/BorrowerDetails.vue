<template>
  <BasicModal destroyOnClose title="借款人明细" width="1400px" :showOkBtn="false" :height="700">
    <ShareList :ChemicalsData="ChemicalsData" :ExcelBut="true" :totalnum="totalnum" @queryFunction="queryFunction"></ShareList>
    <template #footer>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
import  BasicModal  from '/@/components/Modal/src/BasicModal.vue';
import ShareList from '/@/views/SharedFile/ShareList.vue'
import {onMounted, reactive, ref} from "vue";
import {
  BorrowerDetailsColumns,
  BorrowerDetailsData,
  BorrowerDetailsSchema

} from "@/views/SharedFile/tableData";

let area = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:BorrowerDetailsSchema(),
  columns:BorrowerDetailsColumns(),
  form:[],
  data:BorrowerDetailsData
})
//查询条件
let queryList = {
  XMMC:'',
  XMLY:'',
  WJLX:'',
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
