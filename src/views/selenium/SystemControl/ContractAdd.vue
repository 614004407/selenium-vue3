<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation" @edit="editInformation" @delete="deleteInformation" :TypeShow="6"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  ConfigurForm, ConfigurColumns, ConfigurData, ConfigurSchema, removeProperty, ContractSchema, ContractColumns
} from "@/views/SharedFile/tableData";
import { message, Modal } from "ant-design-vue";
import { getContractAdd, getContractDelete, getContractEdit, getContractList } from "@/api/selenium/ContractAdd";

const childmod = ref(null)
let BatchInfo = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:ContractSchema(),
  columns:ContractColumns(),
  form:ConfigurForm(BatchInfo),
  data:[]
})
//查询条件
let queryList = {
  contractName:'',
  pageNo:0,
  pageSize:10,
}
onMounted( () => {
  queryTable()
});

function queryFunction(v){
  queryList.contractName = v.contractName
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}

//获取列表数据
async function queryTable(){
  queryList.pageNo = 1
  let a  = removeProperty(queryList)
  let res = await getContractList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

async function addInformation(v){
  let res = await getContractAdd(v)
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
  let res = await getContractEdit(v)
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
    content: '是否删除所选配置表？',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      let res = await getContractDelete({id:v.id})
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
