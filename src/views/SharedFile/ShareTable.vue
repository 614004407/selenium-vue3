<template>
  <a-spin :spinning="spinning" :tip="tip">
  <div class="formbox" v-if="Form">
    <BasicForm
      :labelWidth="100"
      :schemas="schemas"
      :actionColOptions="{ span: 6 }"
      @submit="handleSubmit"
      :submitOnReset="true"
      :showAdvancedButton="false"
      :resetButtonOptions="{style:{backgroundColor:'#1890ff',color:'#ffffff',border:'1px solid #1890ff'}}"
    />
  </div>
  <div style="background: white;margin: 0px 10px;padding: 5px 5px 0 5px" v-if="props.ExcelBut">
    <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExcel"> 导出</a-button>
  </div>
  <div style="background: white;margin: 0px 10px;padding: 5px 5px 0 5px">
    <a-alert type="info" show-icon class="alert" v-if="props.ExcelBut">
      <template #message>
        <template v-if="selectedRowKeys.length > 0">
              <span>
                <span>已选中 {{ selectedRowKeys.length }} 条记录(可跨页)</span>
              </span>
          <a-divider type="vertical" />
          <a @click="onSelectChange([],[])">清空</a>
          <slot name="alertAfter" />
        </template>
        <template v-else>
          <span>未选中任何数据</span>
        </template>
      </template>
    </a-alert>
    <a-alert :message="Message" type="info" show-icon class="alert" v-if="!props.ExcelBut"/>
  </div>
  <div class="tableBox">
    <a-spin :spinning="ulLoading">
      <BasicTable
        :columns="columns"
        :dataSource="BasicData"
        @change="Pagefeed"
        @register="registerTable"
        :pagination="{total:props.totalnum}"
        :ellipsis="false"
        :bordered="true"
        :striped="false"
        :showIndexColumn="props.ExcelBut ? false : true"
        :row-selection="props.ExcelBut ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed: 'left', } : undefined"
      >
        <template #tableTitle v-if="form.length > 0">
          <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate" v-if="props.TypeShow === 0"> 新增</a-button>
          <a-button type="primary" preIcon="ant-design:plus-outlined" @click="RepaymentCreate" v-else> 新增</a-button>
        </template>
        <template #bodyCell="{column,record,index}">
          <a-dropdown v-if="column.dataIndex === 'Repayment'">
            <a class="ant-dropdown-link" @click.prevent>
              更多
              <DownOutlined style="font-size: 9px;width: 10px"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="RepaymentModel(record)">详情</a>
                </a-menu-item>
                <a-menu-item v-if="record.datasheetState === '0' || record.repaymentState === '0'">
                  <a @click="RepaymenteditModel(record)">修改</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="DeleteModel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown v-if="column.dataIndex === 'Enterprise'">
            <a class="ant-dropdown-link" @click.prevent>
              更多
              <DownOutlined style="font-size: 9px;width: 10px"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="RepaymentModel(record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="RepaymenteditModel(record)">修改</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="DeleteModel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown v-if="column.dataIndex === 'Allocation'">
            <a class="ant-dropdown-link" @click.prevent>
              更多
              <DownOutlined style="font-size: 9px;width: 10px"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="getzipDownload(record)">导出</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="RepaymentModel(record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="RepaymenteditModel(record)">修改</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="DeleteModel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown v-if="column.dataIndex === 'Details'">
            <a class="ant-dropdown-link" @click.prevent>
              更多
              <DownOutlined style="font-size: 9px;width: 10px"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="DetailsModel(record)">详情</a>
                </a-menu-item>
<!--                <a-menu-item>-->
<!--                  <a @click="editModel(record)">修改</a>-->
<!--                </a-menu-item>-->
                <a-menu-item>
                  <a @click="DeleteModel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown v-if="column.dataIndex === 'BatchDetails'">
            <a class="ant-dropdown-link" @click.prevent>
              更多
              <DownOutlined style="font-size: 9px;width: 10px"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="DetailsModel(record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="editModel(record,column.dataIndex)">修改</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="DeleteModel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown v-if="column.dataIndex === 'QueryDetails'">
            <a class="ant-dropdown-link" @click.prevent>
              更多
              <DownOutlined style="font-size: 9px;width: 10px"/>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="BorrowerModel(record)">详情</a>
                </a-menu-item>
                <a-menu-item v-if="record.batchProcessState==='1' && record.batchTreatmentState==='1'">
                  <a @click="Preconditioning('info',record)">预处理</a>
                </a-menu-item>
                <a-menu-item v-if="record.batchTreatmentState==='0'">
                  <a @click="DataProcessing('info',record)">数据处理</a>
                </a-menu-item>
                <a-menu-item v-if="record.batchTreatmentState==='2'">
                  <a @click="DataProcesresult(record)">数据处理日志</a>
                </a-menu-item>
                <a-menu-item v-if="record.batchTreatmentState==='3'">
                  <a @click="Tabledisposition(record)">借款人明细表配置</a>
                </a-menu-item>
                <a-menu-item v-if="(record.batchProcessState==='0' && record.batchTreatmentState==='1')||(record.batchProcessState==='2' && record.batchTreatmentState==='1')">
                  <a @click="Borrower(record)">借款人明细</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </BasicTable>
    </a-spin>
  </div>
  <div class="modalcss" v-if="modalVisible">
    <component :is="currentModal" v-model:visible="modalVisible" :userData="refundData" :upload="props.upload" @addData="addData" @editData="editData" @closeModal="close" :disabled="disabled" :title="title" :showOkBtn="showOkBtn" :TypeShow="props.TypeShow"/>
  </div>
  </a-spin>
</template>

<script lang="ts" setup>
import {BasicTable, useTable} from '/@/components/Table';
import {BasicForm} from '/@/components/Form';
import {ComponentOptions, h, nextTick, reactive, ref, shallowRef, unref, watch} from "vue";
import {useModalInner} from "/@/components/Modal";
import DetailsM from "/@/views/SharedFile/DetailsM.vue";
import Adddata from "/@/views/SharedFile/Adddata.vue";
import BorrowerDetails from "/@/views/selenium/BorrowerDetails.vue";
import {DescItem} from "/@/components/Description";
import { DownOutlined } from '@ant-design/icons-vue';
import { useMessage } from "@/hooks/web/useMessage";
import { message, Modal } from "ant-design-vue";
import { getProjectDelete } from "@/api/selenium/project";
import { getBatchProcessing } from "@/api/selenium/batch";
import { getHandleFile } from "@/api/selenium/loitSeleniumBatch";
import { getzipdownload } from "@/api/selenium/Allocation";
import { RepaymentSchema, UnfileSchema } from "@/views/SharedFile/tableData";

//控制弹窗参数
const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
const [register, {closeModal, setModalProps}] = useModalInner()
const { createConfirm } = useMessage();
const modalVisible = ref(false);
const props = defineProps({
  ChemicalsData: {type: Object},
  totalnum:{
    type: Number,
    default: 0,
  },
  ExcelBut:{
    type: Boolean,
    default: false,
  },
  TypeShow:{
    type: Number,
    default: 0,
  },
  upload:{
    type:Boolean,
    default:false,
  }
})
const [registerTable, {setPagination, reload}] = useTable({});

let spinning = ref<boolean>(false)
let tip = ref('')
let columns = []
let schemas = []
let selectionData = []
let Form = ref<boolean>(true)
let BasicData = ref([])
let ulLoading = ref<boolean>(true)
let emit = defineEmits(['queryFunction','ExcelFun','add','edit','delete','resetFun'])
let current = ref(1)
let fromdata = {}
let Message = ref('')
let selectedRowKeys = ref([])
let form = ref([])
let Sizedata = reactive({
  current: 1,
  pageSize: 10
})
let num = ref(0)
let queryList = {}
//子页面传参
let refundData = reactive({
  data: [],
  schema: [],
  formdata:{},
  id:'',
})
let title = ref('添加')
let showOkBtn = ref<boolean>(true)
let disabled = ref<boolean>(false)

function Pagefeed(page, pageSize) {
  ulLoading.value = true
  Sizedata.current = page.current
  Sizedata.pageSize = page.pageSize
  queryFUN()
}

function handleSubmit(values) {
  ulLoading.value = true
  fromdata = values
  setPagination({
    current: 1,
  });
  selectedRowKeys.value = []
  reload();
  queryFUN()
}

function onExcel(){
  console.log('导出');
}

async function getzipDownload(v){
  let res = await getzipdownload({id:v.id})
  let url = res.result.replace(new RegExp("C:/不良资产处置", "g"), "");
  window.open("http://139.9.215.117:8091/selenium/sys/common/static" + url);

}

function addData(v){
  emit("add", v)
}

function editData(v){
  emit("edit", v)
}

async function DeleteModel(v){
  emit("delete", v)
}

function close(){
  refundData.formdata = {}
  modalVisible.value = false;
}

function onSelectChange(Key, data) {
  selectedRowKeys.value = Key
  selectionData = JSON.parse(JSON.stringify(data))
}

function queryFUN() {
  let a = Object.assign(fromdata, Sizedata)
  emit("queryFunction", a)
}

function Tabledisposition(v){
  title.value = '处理配置'
  showOkBtn.value = true
  disabled.value = false
  refundData.formdata = v
  let loitSeleniumDisposition = []
  v.loitSeleniumDisposition.forEach(item=>{
    loitSeleniumDisposition.push({value:item.dispositionRemark,label:item.dispositionRemark})
  })
  refundData.schema = UnfileSchema(loitSeleniumDisposition)
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}

function Borrower(v){
  title.value = '借款人明细'
  currentModal.value = BorrowerDetails;
  refundData.id = v.id
  nextTick(() => {
    modalVisible.value = true;
  });
}

function Preconditioning(type: 'warning' | 'error' | 'success' | 'info',data) {
  createConfirm({
    iconType: type,
    title: '提示',
    content: '是否进行预处理？',
    onOk: () =>Precond(data)
  });
}

async function Precond(data){
  spinning.value = true
  tip.value = '预处理中...'
  let res = await getHandleFile({id:data.id})
  if(res.success){
    emit("resetFun")
    message.success('预处理成功！')
  }else{
    message.warning(res.message)
  }
  spinning.value = false
}

function Precondresult(data){
  console.log('预处理结果',data);
}

function DataProcessing(type: 'warning' | 'error' | 'success' | 'info',data) {
  createConfirm({
    iconType: type,
    title: '提示',
    content: '是否进行数据处理？',
    onOk: () => DataProces(data)
  });
}

async function DataProces(data){
  spinning.value = true
  tip.value = '数据处理中...'
  let res = await getBatchProcessing({id:data.id})
  if(res.success){
    emit("resetFun")
    message.success(res.message);
  }else{
    message.warning(res.result);
  }
  spinning.value = false
}

function DataProcesresult(data){
  console.log('数据处理结果',data);
}

function BorrowerModel(v) {
  console.log(v);
  refundData.data = [v]
  let DescItem: DescItem[] = []
  columns.forEach(item => {
    if (item.title != '操作') {
      let a = {}
      if(item.customRender) {
        a = {
          field: item.dataIndex,
          label: item.title,
          labelStyle: {
            "text-align": "right"
          },
          render: (curVal, data) => {
            let text2 = curVal
            return item.customRender({text: text2})
          }
        }
      }else{
        a = {
          field: item.dataIndex,
          label: item.title,
          labelStyle: {
            "text-align": "right"
          },
        }
      }
      DescItem.push(a)
    }
  })
  refundData.schema = DescItem
  currentModal.value = DetailsM;
  nextTick(() => {
    modalVisible.value = true;
  });

}

function handleCreate() {
  title.value = '添加'
  showOkBtn.value = true
  disabled.value = false
  refundData.formdata = {}
  refundData.schema = form.value
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}
function editModel(v,type){
  title.value = '修改'
  showOkBtn.value = true
  disabled.value = false
  refundData.formdata = v
  refundData.schema = form.value
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}
function DetailsModel(v) {
  title.value = '详情'
  showOkBtn.value = false
  disabled.value = true
  refundData.formdata = v
  refundData.schema = form.value
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}
function RepaymentCreate() {
  title.value = '添加'
  showOkBtn.value = true
  disabled.value = false
  refundData.formdata = {}
  refundData.schema = form.value
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}
function RepaymenteditModel(v){
  title.value = '修改'
  showOkBtn.value = true
  disabled.value = false
  refundData.formdata = v
  refundData.schema = form.value
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}
function RepaymentModel(v) {
  title.value = '详情'
  showOkBtn.value = false
  disabled.value = true
  refundData.formdata = v
  refundData.schema = form.value
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}
watch(() => props.ChemicalsData, () => {
  if (props.ChemicalsData) {
    num.value += 1
    BasicData.value = props.ChemicalsData.data
    form.value = props.ChemicalsData.form
    if(props.ChemicalsData.data){
      Message.value = '共' + props.totalnum + '条数据'
    }
    schemas = props.ChemicalsData.schemas
    columns = props.ChemicalsData.columns
    if (schemas.length === 0) {
      Form.value = false
    } else {
      Form.value = true
    }
    ulLoading.value = false
  }
}, {immediate: true, deep: true,});

defineExpose({
  close
})
</script>

<style scoped lang="less">
.formbox {
  margin: 10px 10px 8px 10px;
  padding: 12px 10px 6px;
  background: white;
  :deep(.ant-picker){
    width: 100%;
  }
}

.tableBox {
  padding: 20px 20px -20px 20px;
  margin: 0px 10px;
}

:deep(.ant-alert-info) {
  background-color: #e6f7ff !important;
  border: 1px solid #91d5ff !important;
}

.modalcss {
  :deep(.ant-modal-header) {
    background: #276fd3;
  }

  :deep(.jeecg-basic-title) {
    color: white;
  }

  :deep(.anticon svg) {
    color: white;
  }
}

</style>
