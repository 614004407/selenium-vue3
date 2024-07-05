<template>
  <BasicModal destroyOnClose title="借款人明细" width="1400px" :showOkBtn="false" :centered="true" :useWrapper="false">
    <ShareList ref="childmod" :ChemicalsData="ChemicalsData" :ExcelBut="true" :totalnum="totalnum" :Columnslist="Columnslist" @ExcelFun="ExcelFun" :filename="'借款人明细'" @queryFunction="query" @edit="edit"></ShareList>
    <template #footer>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
import  BasicModal  from '/@/components/Modal/src/BasicModal.vue';
import ShareList from '/@/views/SharedFile/ShareList.vue'
import { onMounted, reactive, ref, watch } from "vue";
import {
  BorrowerDetailsColumns,
  BorrowerDetailsData,
  BorrowerDetailsSchema, removeProperty

} from "@/views/SharedFile/tableData";
import { getBatchColumnslist, getBatchTablelist, getBatchTablelistupdate } from "@/api/selenium/batch";
import { message } from "ant-design-vue";
import { getEnterpriseEnterpriselist } from "@/api/selenium/Enterprise";

const childmod = ref(null)
const props = defineProps({
  userData: { type: Object },
})
let area = ref([])
let totalnum = ref(0)
//表格参数
let ChemicalsData = reactive({
  schemas:[],
  columns:[],
  form:[],
  data:[],
  id:''
})
let Columnslist = {}
//查询条件
let queryList = {}
let Enterpriselist = ref([])
let Enterpriselist1 = ref([])
let Enterpriselist2 = ref([])
onMounted( () => {
  getEnterpriselist()
});

//获取列表数据
async function queryTable(){
  ChemicalsData.id = props.userData.id
  ChemicalsData.columns=[]
  ChemicalsData.schemas=[]
  ChemicalsData.form=[]
  let res = await getBatchColumnslist({id:props.userData.id})
  res.result.forEach((item,i)=>{
    Columnslist[item.dispositionName] = item.dispositionType
    ChemicalsData.columns.push({
      title: item.dispositionRemark,
      dataIndex: item.dispositionName,
      width: 230,
    })
    if(item.dispositionName !='id'){
      if(item.dispositionType == 'varchar'){
        ChemicalsData.form.push({
          field: item.dispositionName,
          component: 'Input',
          required: item.dispositionName.indexOf('value') == -1 ? true : false,
          label: item.dispositionRemark,
          labelWidth:250,
          colProps: {
            span: 12,
          },
          componentProps: ({formModel}) => {
            return {
              allowClear: false,
            }
          }
        },)
      }else if(item.dispositionType == 'datetime'){
        ChemicalsData.form.push({
          field: item.dispositionName,
          required: item.dispositionName.indexOf('value') == -1 && item.dispositionName != "compensatoryTime2"  ? true : false,
          component: 'DatePicker',
          label: item.dispositionRemark,
          labelWidth:250,
          colProps: {
            span: 12,
          },
          componentProps: ({formModel}) => {
            return {
              showTime:true,
              format:'YYYY-MM-DD HH:mm:ss',
              valueFormat:'YYYY-MM-DD HH:mm:ss',
            }
          }
        })
      }else if(item.dispositionType == 'decimal'){
        ChemicalsData.form.push({
          field: item.dispositionName,
          required: item.dispositionName.indexOf('value') == -1 ? true : false,
          component: 'InputNumber',
          label: item.dispositionRemark,
          labelWidth:250,
          colProps: {
            span: 12,
          },
          componentProps: ({formModel}) => {
            return {
              precision:2
            }
          }
        },)
      }
    }
    if(item.isQuery == '1'){
      if(item.dispositionType == 'varchar'){
        ChemicalsData.schemas.push({
          field: item.dispositionName,
          component: 'Input',
          label: item.dispositionRemark,
          colProps: {
            span: 6,
          },
        },)
      }else if(item.dispositionType == 'datetime'){
        ChemicalsData.schemas.push({
          field: item.dispositionName,
          component: 'RangePicker',
          label: item.dispositionRemark,
          colProps: {
            span: 6,
          },
          componentProps: ({formModel}) => {
            return {
              showTime:true,
              valueFormat:'YYYY-MM-DD HH:mm:ss',
            }
          }
        })
      }
    }
  })
  ChemicalsData.form.push(...[{
    field: 'prosecution',
    component: 'Select',
    required: true,
    label: '起诉模式',
    labelWidth:250,
    colProps: {
      span: 12,
    },
    componentProps: ({formModel}) => {
      return {
        placeholder: '请选择起诉模式',
        options: [
          {
            label: '原告所在地',
            value: '2',
          },
          {
            label: '被告所在地',
            value: '1',
          },
        ],
        onChange:(value, option)=>{
          formModel.enterprise = null
        }
      }
    }
  },
    {
      field: 'enterprise',
      component: 'Select',
      label: '原告名称',
      required: true,
      labelWidth:250,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        let options = []
        if(formModel.prosecution){
          if(formModel.prosecution == '1'){
            options = Enterpriselist1.value
          }else if(formModel.prosecution == '2'){
            options = Enterpriselist2.value
          }
        }else{
          options = Enterpriselist.value
        }
        return {
          placeholder: '请选择',
          options: options
        }
      }
    },])
  ChemicalsData.columns.push(...[{
    title: '起诉模式',
    dataIndex: 'prosecution',
    width: 160,
    customRender: ({ text, record }) => {
      let name = ''
      switch (text){
        case '1' :
          name = '被告所在地'
          break;
        case '2' :
          name = '原告所在地'
          break;
      }
      return name
    }
  },{
    title: '原告名称',
    dataIndex: 'enterprise',
    width: 160,
    customRender: ({ text, record }) => {
      let name = ''
      Enterpriselist.value.forEach((item)=>{
        if(item.value == text){
          name = item.label
        }
      })
      return name
    }
  },{
    fixed: 'right',
    title: '操作',
    dataIndex: 'Details',
    width: 160,
  }])
  let res1 = await getBatchTablelist({id:props.userData.id})
  ChemicalsData.data = res1.result
  ChemicalsData.schemas.push({
    field: 'state',
    component: 'Select',
    label: '数据是否完整',
    colProps: {
      span: 6,
    },
    componentProps: ({formModel}) => {
      return {
        placeholder: '请选择',
        options: [
          {
            label: '是',
            value: '1',
          },
          {
            label: '否',
            value: '2',
          },
        ],
      }
    }
  })
  console.log(ChemicalsData.form);
}

function query(v){
  queryList  = removeProperty(v)
  console.log(queryList);
  queryFunction()
}

async function getEnterpriselist(){
  let res = await getEnterpriseEnterpriselist({})
  Enterpriselist.value = res.result
  let res1 = await getEnterpriseEnterpriselist({stats:'1'})
  Enterpriselist1.value = res1.result
  let res2 = await getEnterpriseEnterpriselist({stats:'2'})
  Enterpriselist2.value = res2.result
}

async function queryFunction(){
  let a  = queryList
  if(a.orderId){
    let b = a.orderId.split("、")
    let c = ''
      c += "("
      b.forEach(item=>{
        c += "orderId = '" + item + "' or "
      })
      c = c.slice(0,-4)
      c += ")"
      a.orderId = c
  }
  let Querysql = ''
  let Querysql1 = ''
  let Querysql2 = ''
  for(let key in a){
    if(key != 'state'){
      if(Querysql1.length > 0) {
        if(key == 'orderId'){
          Querysql1 += ' and ' +  a[key]
        }else {
          if(Columnslist[key] != 'datetime'){
            Querysql1 += ' and ' + key + ' = "' + a[key] + '"'
          }else{
            Querysql1 += ' and ' + key + ' BETWEEN "' + a[key].split(",")[0] + '" AND "' + a[key].split(",")[1] + '"'
          }
        }
      }else{
        if(key == 'orderId'){
          Querysql1 += a[key]
        }else {
          if(Columnslist[key] != 'datetime'){
            Querysql1 += key + ' = "' + a[key] + '"'
          }else{
            Querysql1 += key + ' BETWEEN "' + a[key].split(",")[0] + '" AND "' + a[key].split(",")[1] + '"'
          }
        }
      }
    }
  }
  if(a.state && a.state == '2'){
    for(let key in Columnslist){
      if(!a[key] && key.indexOf("value") == -1){
        if(key != "compensatoryTime2"){
          if(Querysql2.length > 0){
            Querysql2 += Columnslist[key] != 'datetime' ? ' or ' + key + " = '' or " + key + " is null" : ' or ' + key + " is null"
          }else{
            Querysql2 += Columnslist[key] != 'datetime' ? key + " = '' or " + key + " is null" : key + " is null"
          }
        }
      }
    }
  }else if(a.state && a.state == '1'){
    for(let key in Columnslist){
      if(!a[key] && key.indexOf("value") == -1){
        if(key != "compensatoryTime2") {
          if (Querysql2.length > 0) {
            Querysql2 += Columnslist[key] != 'datetime' ? ' and ' + key + " != ''" : ' and ' + key + " is true"
          } else {
            Querysql2 += Columnslist[key] != 'datetime' ? key + " != ''" : key + " is true"
          }
        }
      }
    }
  }
  Querysql = Querysql1.length > 0 ? (Querysql2.length > 0 ? Querysql1 + " and (" + Querysql2 + ")" : Querysql1) : Querysql2
  if(Querysql.length>0){
    let res = await getBatchTablelist({id: props.userData.id,sqlquery:Querysql})
    ChemicalsData.data = res.result
  }else{
    let res = await getBatchTablelist({id: props.userData.id})
    ChemicalsData.data = res.result
  }
}

async function edit(v){;
  let sql = ''
  for(let key in v){
    if(key != 'id'){
      if(v[key] == null){
        sql += key + ' = ' + v[key] +','
      }else{
        if(Columnslist[key] !== 'decimal'){
          sql += key + ' = "' + v[key] +'",'
        }else{
          sql += key + ' = ' + v[key] +','
        }
      }
    }
  }
  sql = sql.slice(0, -1)
  sql += ' where id = ' + v.id
  let res = await getBatchTablelistupdate({id: props.userData.id,sqlupdate:sql})
  if(res.success){
    message.success("修改成功！");
    childmod.value.close()
    queryFunction()()
  }else{
    message.error("修改失败！");
  }
}

async function ExcelFun({pageSize,data}){
  let res = await getBatchTablelist({id:props.userData.id})
  data(res.result)
}

watch(()=> props.userData, ()=>{
  if(props.userData){
    queryTable()
  }
},{immediate:true,deep:true})
</script>

<style scoped>

</style>
