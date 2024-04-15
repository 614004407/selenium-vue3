<template>
  <ShareTable ref="childmod" :ChemicalsData="ChemicalsData" :totalnum="totalnum" @queryFunction="queryFunction" @add="addInformation" @edit="editInformation" @delete="deleteInformation"></ShareTable>
</template>

<script lang="ts" setup>
import ShareTable from '/@/views/SharedFile/ShareTable.vue'
import {onMounted, reactive, ref} from "vue";
import {
  removeProperty,
  SetProData,
  SetProjectColumns,
  SetProjectForm,
  SetProjectSchema
} from "@/views/SharedFile/tableData";
import { getProjectAdd, getProjectDelete, getProjectEdit, getProjectList } from "@/api/selenium/project";
import { message, Modal } from "ant-design-vue";

const childmod = ref(null)
let area = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:SetProjectSchema(),
  columns:SetProjectColumns(),
  form:SetProjectForm(),
  data:[],
})
//查询条件
let queryList = {
  projectName:'',
  projectSource:'',
  fileType:'',
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
  let res = await getProjectList(a)
  ChemicalsData.data = res.result.records
  totalnum.value = res.result.total
}

async function addInformation(v){
  console.log(v);
  let res = await getProjectAdd(v)
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
  let res = await getProjectEdit(v)
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
      let res = await getProjectDelete({id:v.id})
      if(res.success){
        message.success('删除成功！');
        queryTable()
      }else{
        message.warning('删除失败！');
      }
    },
  });
}

function queryFunction(v){
  queryList.projectName = v.projectName
  queryList.projectSource = v.projectSource
  queryList.fileType = v.fileType
  queryList.pageNo = v.current
  queryList.pageSize = v.pageSize
  queryTable()
}
</script>

<style scoped>

</style>
