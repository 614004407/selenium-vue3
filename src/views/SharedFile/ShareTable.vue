<template>
  <div class="formbox" v-if="Form">
    <BasicForm
      :labelWidth="100"
      :schemas="schemas"
      :actionColOptions="{ span: 6 }"
      @submit="handleSubmit"
      :submitOnReset="true"
      :showAdvancedButton="true"
      :alwaysShowLines="2"
      :autoAdvancedCol="2"
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
    <a-alert :message="message" type="info" show-icon class="alert" v-if="!props.ExcelBut"/>
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
                <a-menu-item>
                  <a @click="RepaymenteditModel(record)">修改</a>
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
                <a-menu-item>
                  <a @click="editModel(record)">修改</a>
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
                <a-menu-item v-if="record.YCLZT==='需要预处理'">
                  <a @click="Preconditioning('info',record)">预处理</a>
                </a-menu-item>
                <a-menu-item v-if="record.YCLZT==='预处理错误'">
                  <a @click="Precondresult(record)">预处理日志</a>
                </a-menu-item>
                <a-menu-item v-if="record.SJCLZT==='未处理'">
                  <a @click="DataProcessing('info',record)">数据处理</a>
                </a-menu-item>
                <a-menu-item v-if="record.SJCLZT==='数据处理出错'">
                  <a @click="DataProcesresult(record)">数据处理日志</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="Borrower(record)">借款人明细</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </BasicTable>
    </a-spin>
  </div>
  <div class="modalcss">
    <component :is="currentModal" v-model:visible="modalVisible" :userData="refundData" @addData="addData" @closeModal="close" :disabled="disabled" :title="title" :showOkBtn="showOkBtn" :TypeShow="props.TypeShow"/>
    <DetailsM @register="register"/>
    <Adddata @register="register"/>
    <BorrowerDetails @register="register"/>
  </div>
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
  }
})
const [registerTable, {setPagination, reload}] = useTable({});

let columns = []
let schemas = []
let selectionData = []
let Form = ref<boolean>(true)
let BasicData = ref([])
let ulLoading = ref<boolean>(true)
let emit = defineEmits(['queryFunction','ExcelFun','add'])
let current = ref(1)
let fromdata = {}
let message = ref('')
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
  formdata:{}
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

function addData(v){
  emit("add", v)
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

function Borrower(){
  title.value = '借款人明细'
  currentModal.value = BorrowerDetails;
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

function Precond(data){
  console.log('执行预处理',data);
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

function DataProces(data){
  console.log('执行数据处理',data);
}

function DataProcesresult(data){
  console.log('数据处理结果',data);
}

function BorrowerModel(v) {
  refundData.data = [v]
  let DescItem: DescItem[] = []
  columns.forEach(item => {
    if (item.title != '操作') {
      let a = {
        field: item.dataIndex,
        label: item.title,
        labelStyle: {
          "text-align": "right"
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
function editModel(v){
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
      message.value = '共' + BasicData.value.length + '条数据'
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

.imgdaochu {
  color: #fff;
  height: 20px;
  width: 20px;
  align-items: center;
  background-size: contain;
  background-image: url(/@/assets/icons/daochu.png);
}

.imgdaoru {
  color: #fff;
  height: 20px;
  width: 20px;
  align-items: center;
  background-size: contain;
  background-image: url(/@/assets/icons/daoru.png);
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
