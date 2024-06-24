<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation" @edit="editInformation" @delete="deleteInformation"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  EnterpriseForm, EnterpriseSchema, EnterpriseColumns, removeProperty
} from "@/views/SharedFile/tableData";
import { getBatchRepaymentInfo } from "@/api/selenium/batch";
import { message, Modal } from "ant-design-vue";
import { getEnterpriseAdd, getEnterpriseDelete, getEnterpriseEdit, getEnterpriseList } from "@/api/selenium/Enterprise";

const childmod = ref(null)
let BatchInfo = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:EnterpriseSchema(),
  columns:EnterpriseColumns(),
  form:EnterpriseForm(),
  data:[]
})
//查询条件
let queryList = {
  enterpriseName:'',
  enterpriseCode:'',
  enterpriseRepname:'',
  bankName:'',
  enterpriseStats:'',
  pageNo:0,
  pageSize:10,
}
onMounted( () => {
  queryTable()
  getBatchinfo()
});

async function getBatchinfo(){
  let res = await getBatchRepaymentInfo({})
  BatchInfo.value = res.result
}

function queryFunction(v){
  queryList.enterpriseName = v.enterpriseName
  queryList.enterpriseCode = v.enterpriseCode
  queryList.enterpriseRepname = v.enterpriseRepname
  queryList.bankName = v.bankName
  queryList.enterpriseStats = v.enterpriseStats
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getEnterpriseList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

async function addInformation(v){
  console.log(v);
  let res = await getEnterpriseAdd(v)
  if(res.success){
    childmod.value.close()
    message.success(res.result);
    queryTable()
  }else{
    message.error(res.result);
  }
}

async function editInformation(v){
  let res = await getEnterpriseEdit(v)
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
      let res = await getEnterpriseDelete({id:v.id})
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
