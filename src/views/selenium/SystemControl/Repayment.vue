<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation" @edit="editInformation" @delete="deleteInformation"  :TypeShow="1"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  RepaymentForm,
  RepaymentSchema,
  RepaymentColumns,
  RepaymentData, removeProperty
} from "@/views/SharedFile/tableData";
import { getBatchInfo } from "@/api/selenium/batch";
import { getDatasheetAdd, getDatasheetDelete, getDatasheetEdit, getDatasheetList } from "@/api/selenium/datasheet";
import { message, Modal } from "ant-design-vue";
import { getRepaymentAdd, getRepaymentDelete, getRepaymentEdit, getRepaymentList } from "@/api/selenium/repayment";

const childmod = ref(null)
let BatchInfo = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:RepaymentSchema(),
  columns:RepaymentColumns(),
  form:RepaymentForm(BatchInfo),
  data:[]
})
//查询条件
let queryList = {
  batchName:'',
  repaymentName:'',
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
  queryList.repaymentName = v.repaymentName
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getRepaymentList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

async function addInformation(v){
  console.log(v);
  let res = await getRepaymentAdd(v)
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
  let res = await getRepaymentEdit(v)
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
      let res = await getRepaymentDelete({id:v.id})
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
