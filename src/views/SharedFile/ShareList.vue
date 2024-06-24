<template>
  <div class="formbox" v-if="Form">
    <BasicForm
      :labelWidth="100"
      :schemas="schemas"
      :actionColOptions="{ span: 6 }"
      @submit="handleSubmit"
      :submitOnReset="true"
      :showAdvancedButton="false"
      :alwaysShowLines="2"
      :autoAdvancedCol="2"
      :resetButtonOptions="{style:{backgroundColor:'#1890ff',color:'#ffffff',border:'1px solid #1890ff'}}"
    />
  </div>
  <div style="background: white;margin: 0px 10px;padding: 5px 5px 0 5px" v-if="props.ExcelBut">
    <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExcel"> 导出</a-button>
    <a-button type="primary" preIcon="ant-design:export-outlined" @click="isexport" style="margin-left: 15px"> 生成诉状</a-button>
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
          <span><br/>注：请在生成诉状之后再进行导出，导出之前通过"数据是否完整"的查询条件，确实数据必须项的完整性！</span>
        </template>
        <template v-else>
          <span v-if="alertlist != ''">{{ alertlist }}</span>
          <span v-else>未选中任何数据</span>
          <span><br/>注：请在导出之前通过"数据是否完整"的查询条件，确实数据必须项的完整性！</span>
        </template>
      </template>
    </a-alert>
    <a-alert :message="Message" type="info" show-icon class="alert" v-if="!props.ExcelBut" />
  </div>
  <div class="tableBox">
    <a-spin :spinning="ulLoading">
      <BasicTable
        :columns="columns"
        :dataSource="BasicData"
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
              <DownOutlined style="font-size: 9px;width: 10px" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="updateModel(record)">编辑</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="RepaymentModel(record)">还款计划表</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="DetailsModel(record)">附件列表</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </BasicTable>
    </a-spin>
  </div>
  <div class="modalcss">
    <component :is="currentModal" v-model:visible="modalVisible" :userData="refundData" @editData="editData"
               :showOkBtn="showOkBtn" @closeModal="close" :disabled="false" :title="title" />
  </div>
</template>

<script lang="ts" setup>
import { BasicTable, useTable } from "/@/components/Table";
import { BasicForm } from "/@/components/Form";
import { ComponentOptions, h, nextTick, reactive, ref, shallowRef, unref, watch } from "vue";
import { useModalInner } from "/@/components/Modal";
import Adddata from "/@/views/SharedFile/Adddata.vue";
import FileList from "/@/views/SharedFile/FileList.vue";
import BorrowerDetails from "/@/views/selenium/BorrowerDetails.vue";
import { DescItem } from "/@/components/Description";
import { DownOutlined } from "@ant-design/icons-vue";
import { xlsx } from "/@/utils/dealwithExcelUtil";
import { message } from "ant-design-vue";
import { getAttachmentList, getbackAndDownload } from "@/api/selenium/loitSeleniumBatch";
import {
  getBatchexportlist,
  getBatchRepaymentlist,
  getBatchRepaymentSchema,
  getdeleteFile
} from "@/api/selenium/batch";
import drawer from "@/views/demo/vextable/drawer.vue";
import RepaymentTable from "/@/views/SharedFile/RepaymentTable.vue";
import smart from "address-smart-parse";
import docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';
import { saveAs } from 'file-saver';
import JSZipUtils from "pizzip/utils";
import PizZip from 'pizzip';
import { getNowFormatDate, isReturn } from "@/views/SharedFile/tableData";
import { update } from "lodash-es";
import { uploadFile } from "@/api/common/api";
import { useMessage } from "@/hooks/web/useMessage";

//控制弹窗参数
const currentModal = shallowRef<Nullable<ComponentOptions>>(null);
const [register, { closeModal, setModalProps }] = useModalInner();
const { createConfirm } = useMessage();
const modalVisible = ref(false);
const props = defineProps({
  ChemicalsData: { type: Object },
  totalnum: {
    type: Number,
    default: 0
  },
  ExcelBut: {
    type: Boolean,
    default: false
  },
  filename: { type: String },
  Columnslist: {
    type: Object
  }
});
const [registerTable, { setPagination, reload }] = useTable({});

let columns = [];
let schemas = [];
let selectionData = [];
let title = ref("编辑");
let showOkBtn = ref<boolean>(true);
let disabled = ref("false");
let Form = ref<boolean>(true);
let BasicData = ref([]);
let ulLoading = ref<boolean>(true);
let emit = defineEmits(["queryFunction", "ExcelFun", "add", "edit"]);
let current = ref(1);
let fromdata = {};
let Message = ref("");
let selectedRowKeys = ref([]);
let form = ref([]);
let alertlist = ref("");
let Sizedata = reactive({
  current: 1,
  pageSize: 10
});
let BactID = ref("");
let num = ref(0);
let queryList = {};
//子页面传参
let refundData = reactive({
  data: [],
  columns: [],
  formdata: {},
  id: "",
  schemas: [],
  schema: []
});

function Pagefeed(page, pageSize) {
  ulLoading.value = true;
  Sizedata.current = page.current;
  Sizedata.pageSize = page.pageSize;
  // queryFUN()
}

function handleSubmit(values) {
  ulLoading.value = true;
  fromdata = values;
  setPagination({
    current: 1
  });
  selectedRowKeys.value = [];
  reload();
  queryFUN();
}

async function RepaymentModel(v) {
  refundData.columns = [];
  let res = await getBatchRepaymentlist({ id: BactID.value, orderId: v.orderId });
  let res1 = await getBatchRepaymentSchema({ id: BactID.value });
  res1.result.forEach(item => {
    refundData.columns.push({
      title: item.dispositionRemark,
      dataIndex: item.dispositionName,
      width: 150
    });
  });
  title.value = "还款计划表";
  refundData.data = res.result;
  refundData.schemas = [];
  currentModal.value = RepaymentTable;
  nextTick(() => {
    modalVisible.value = true;
  });
}

async function onExcel() {
  let isExcel = true
  if (selectionData.length > 0) {
    selectionData.forEach(item=>{
      if(alertlist.value.indexOf(item.orderId) != -1){
        isExcel = false
      }
    })
  }
  if(alertlist.value == '' || (selectionData.length > 0 && isExcel)){
    let fields: [] = [];
    let filename = props.filename;
    let orderId = '';
    let isfull = "";
    for (let key in props.Columnslist) {
      if (key.indexOf("value") == -1) {
        if (isfull.length > 0) {
          isfull += props.Columnslist[key] != "datetime" ? " or " + key + " = ''" : " or " + key + " is null";
        } else {
          isfull += props.Columnslist[key] != "datetime" ? key + " = ''" : key + " is null";
        }
      }
    }
    if (selectionData.length > 0) {
      for (let i = 0; i < selectionData.length; i++) {
        orderId += "a.orderId = '" + selectionData[i].orderId + "' OR ";
      }
    }else{
      for (let i = 0; i < BasicData.value.length; i++) {
        orderId += "a.orderId = '" + BasicData.value[i].orderId + "' OR ";
      }
    }
    let postdata = { id: BactID.value, isfull: isfull, orderId: orderId.slice(0, -4)}
    let coderray = "";
    let excel = await getBatchexportlist(postdata);
    for (let i = 0; i < excel.result.length; i++) {
      coderray += excel.result[i].orderId + ",";
    }
    columns.forEach(item => {
      if (item.title != "操作") {
        fields[item.dataIndex] = item.title;
      }
      if (item.customRender) {
        for (let i = 0; i < excel.result.length; i++) {
          let text2 = {
            [item.dataIndex]: excel.result[i][item.dataIndex]
          };
          excel.result[i][item.dataIndex] = item.customRender({ text: excel.result[i][item.dataIndex], record: text2 });
        }
      }
    });
    fields['enterprise_address'] = '企业地址'
    fields['enterprise_code'] = '统一社会信用代码'
    fields['enterprise_repname'] = '法定代表人'
    fields['project_source'] = '项目来源'
    fields['platform_name'] = '平台名称'
    fields['operator_name'] = '平台运营方名称'
    fields['guarantee_name'] = '担保企业'
    fields['loancontract_name'] = '贷款合同名称'
    fields['guaranteecontract_name'] = '担保合同名称'
    fields['transfer_name'] = '债权转让协议名称1'
    fields['transfer_name1'] = '债权转让协议名称2'
    fields['transfer_time'] = '债权转让签订时间'
    fields['bank_name'] = '开户银行'
    fields['bank_code'] = '银行卡号'
    fields['other'] = '其他'
    xlsx(excel.result, fields, filename);
    let res = await getbackAndDownload({ id: BactID.value, coderray: coderray.slice(0, -1) });
    if (res.success) {
      if (res.result !== "") {
        let url = res.result.replace(new RegExp("C:/不良资产处置", "g"), "");
        window.open("http://139.9.215.117:8091/selenium/sys/common/static" + url);
        xlsx(json, fields, filename);
        message.success("导出成功！");
      } else {
        message.warning("数据导出失败！");
      }
    } else {
      message.warning("数据导出失败！");
    }
  }else{
    message.warning("导出数据中有未处理的问题数据，请按照提示修改之后再导出！");
  }
}

function editData(v) {
  emit("edit", v);
}

function isexport(){
  createConfirm({
    iconType: 'info',
    title: '提示',
    content: '是否生成诉状？',
    onOk: () => exportWord()
  });
}

function onSelectChange(Key, data) {
  selectedRowKeys.value = Key;
  selectionData = JSON.parse(JSON.stringify(data));
}

function updateModel(v) {
  showOkBtn.value = true;
  title.value = "编辑";
  refundData.formdata = v;
  refundData.schema = form.value;
  currentModal.value = Adddata;
  nextTick(() => {
    modalVisible.value = true;
  });
}

function base64DataURLToArrayBuffer(dataURL) {
  const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/
  if (!base64Regex.test(dataURL)) {
    return false
  }
  const stringBase64 = dataURL.replace(base64Regex, '')
  let binaryString
  if (typeof window !== 'undefined') {
    binaryString = window.atob(stringBase64)
  } else {
    binaryString = new Buffer(stringBase64, 'base64').toString('binary')
  }
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes.buffer
}

async function exportWord() {
  let orderId = '';
  let isfull = ''
  for (let key in props.Columnslist) {
    if (key.indexOf("value") == -1) {
      if (isfull.length > 0) {
        isfull += props.Columnslist[key] != "datetime" ? " or " + key + " = ''" : " or " + key + " is null";
      } else {
        isfull += props.Columnslist[key] != "datetime" ? key + " = ''" : key + " is null";
      }
    }
  }
  if (selectionData.length > 0) {
    for (let i = 0; i < selectionData.length; i++) {
      orderId += "a.orderId = '" + selectionData[i].orderId + "' OR ";
    }
  }
  let postdata = selectionData.length > 0 ? { id: BactID.value, isfull: isfull, orderId: orderId.slice(0, -4)} : { id: BactID.value, isfull: isfull}
  let excel = await getBatchexportlist(postdata);
  for (let i = 0; i < excel.result.length; i++) {
    getdeleteFile({filePath: excel.result[i].project_name + "\\" +excel.result[i].batch_name + `\\file\\${excel.result[i].UserId}_${excel.result[i].name}_${excel.result[i].orderId}`}).then(res=>{
      getExport(excel.result[i])
    })
  }
}

async function getExport(v){

  JSZipUtils.getBinaryContent('dom.docx', function(error: any, content: any) {
    if (error) {
      throw error;
    }
    // 创建一个PizZip实例，内容为模板的内容
    let zip = new PizZip(content);
    // 创建并加载docxtemplater实例对象
    let doc = new docxtemplater();
    doc.loadZip(zip);

    // 图片处理
    const opts = {};
    opts.centered = true; // 图片居中，在word模板中定义方式为{%%image}
    opts.fileType = "docx";
    opts.getImage = (chartId: any) => {
      return base64DataURLToArrayBuffer(chartId);
    };
    opts.getSize = () => {
      return [600, 300];
    };
    const imageModule = new ImageModule(opts);

    doc.attachModule(imageModule);

    doc.setData({});
    try {
      // 用模板变量的值替换所有模板变量
      doc.render({
        enterprise_name: v.enterprise_name.split("-")[0],
        enterprise_address:v.enterprise_address,
        enterprise_code:v.enterprise_code,
        name:v.name,
        sex:v.sex,
        birthData:`${v.identityId.slice(6,10)}年${v.identityId.slice(10,12)}月${v.identityId.slice(12,14)}日`,
        addressService:v.addressService,
        identityId:v.identityId,
        phone:v.phone,
        currentdebt:v.Currentdebt,
        endTime:getNowFormatDate(v.defaultTime),
        startTime: v.compensatoryTime2,
        startTime1:v.compensatoryTime1,
        LoanTime:getNowFormatDate(v.LoanTime),
        platform_name:v.platform_name,
        LendingBank:v.LendingBank,
        LoanAmount:v.LoanAmount,
        interestRate:v.InterestRate,
        loancontract_name:v.loancontract_name,
        guaranteecontract_name:v.guaranteecontract_name,
        transfer_name:v.transfer_name,
        transfer_name1:v.transfer_name1,
        transfer_time:v.transfer_time,
        LoanTerm:v.LoanTerm,
        guarantee_name:v.guarantee_name,
        operator_name:v.operator_name,
        court:v.enterprise_stats == '原告所在地' ? smart(v.enterprise_address).county : smart(v.addressService).county,
        datatime:getNowFormatDate('')
      });
    } catch (error) {
      // 抛出异常
      let e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties
      };
      console.log(JSON.stringify({
        error: e
      }));
      throw error;
    }
    let out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
    const chunkfile = new File([out], '民事起诉状.docx')
    let params = {
      file: chunkfile,
      filename:'民事起诉状.docx',
      data: { fileType:4,filePath:v.project_name + "\\" +v.batch_name + `\\file/${v.UserId}_${v.name}_${v.orderId}` },
    };

    uploadFile(params,isReturn).then(res=>{

    })
  });
}

function close() {
  refundData.formdata = {};
  modalVisible.value = false;
}

function queryFUN() {
  let a = Object.assign(fromdata);
  emit("queryFunction", a);
}

async function DetailsModel(v) {
  showOkBtn.value = false;
  title.value = "文件";
  let res = await getAttachmentList({ id: BactID.value, orderId: v.orderId });
  if (res.success) {
    refundData.data = res.result;
    currentModal.value = FileList;
    nextTick(() => {
      modalVisible.value = true;
    });
  } else {
    message.error("获取文件失败！");
  }


}

watch(() => props.ChemicalsData, () => {
  alertlist.value = "";
  if (props.ChemicalsData) {
    BactID.value = props.ChemicalsData.id;
    num.value += 1;
    BasicData.value = props.ChemicalsData.data;
    form.value = props.ChemicalsData.form;
    let a = "";
    BasicData.value.forEach(item => {
      if (item.addressService && smart(item.addressService).county.length == 0) {
        a += item.orderId + "、";
      }
    });
    if (a != "") {
      alertlist.value = "订单号码为" + a.slice(0, -1) + "地址解析失败，请重新填写！";
    }
    if (props.ChemicalsData.data) {
      Message.value = "共" + BasicData.value.length + "条数据";
    }
    schemas = props.ChemicalsData.schemas;
    columns = props.ChemicalsData.columns;
    if (schemas.length === 0) {
      Form.value = false;
    } else {
      Form.value = true;
    }
    ulLoading.value = false;
  }
}, { immediate: true, deep: true });
defineExpose({
  close
});
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
  border-bottom: 1px #dcdfe6 solid;
  padding: 20px 20px 0 20px;
  //background: #ebeff7;

  :deep(.ant-col-sm-18) {
    max-width: 100%;
  }

  :deep(.jeecg-basic-form .ant-form-item-label > label) {
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

  :deep(.ant-table.ant-table-middle .ant-table-expanded-row-fixed) {
    height: 420px;
  }

  :deep(.ant-table-thead > tr > th) {
    background: #f8f8f9 !important;
    color: #515a64 !important;
    height: 40px !important;
    font-weight: bold;
  }

  ::-webkit-scrollbar {
    width: 0px;
    height: 8px;
  }
}
</style>
