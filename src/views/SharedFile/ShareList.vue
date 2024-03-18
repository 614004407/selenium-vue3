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
        <template #bodyCell="{column,record,index}">
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
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </BasicTable>
    </a-spin>
  </div>
  <div class="modalcss">
    <component :is="currentModal" v-model:visible="modalVisible" :userData="refundData" />
    <DetailsM @register="register"/>
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

//控制弹窗参数
const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
const [register, {closeModal, setModalProps}] = useModalInner()
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

function onSelectChange(Key, data) {
  selectedRowKeys.value = Key
  selectionData = JSON.parse(JSON.stringify(data))
}

function queryFUN() {
  let a = Object.assign(fromdata, Sizedata)
  emit("queryFunction", a)
}

function DetailsModel(v) {
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

.Formclass {
  position: absolute;
  top: 8px;
  left: 10px;
  width: 100%;
}

.formbox {
  margin: 10px 20px 0 20px;
  border-bottom:1px #dcdfe6 solid;
  padding: 20px 20px 0 20px;
  //background: #ebeff7;

  :deep(.ant-col-sm-18) {
    max-width: 100%;
  }
  :deep(.jeecg-basic-form .ant-form-item-label > label){
    font-size: 14px;
    font-weight: 700;
  }
}

.tableBox {
  padding: 20px 20px -20px 20px;
  margin: 10px 20px 0 20px;
  height: 100%;

  :deep(.ant-table .cell) {
    line-height: 23px;
  }

  :deep(.ant-table-body) {
    max-height: 390px !important;
    height: 390px;
  }

  :deep(.ant-empty-normal) {
    margin: 150px 0;
  }

  :deep(.ant-table.ant-table-middle .ant-table-expanded-row-fixed){
    height: 420px;
  }

  :deep(.ant-table-thead > tr > th) {
    background: #f8f8f9 !important;
    color: #515a64 !important;
    height: 40px!important;
    font-weight: bold;
  }
  ::-webkit-scrollbar {
    width: 0px;
    height: 8px;
  }
}
</style>
