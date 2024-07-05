<template>
  <BasicModal :maskClosable="false" :canFullscreen="false" destroyOnClose :title="props.title" width="1200px" :okText="'保存'" :cancelText="'取消'" @ok="addData" @cancel="closeModal" :showOkBtn="showOkBtn">
    <div style="max-height: 600px;">
      <BasicForm @register="registerForm" @submit="addData" :disabled="disabled || ((props.TypeShow === 2||props.TypeShow === 1) && props.title == '修改')">
        <template #tip="{ model, field }">
          <span>请将对应文件手动上传至目录！</span>
        </template>
      </BasicForm>
      <div style="margin-top: -15px;margin-left: 110px;font-size: 12px;color: #858585;" v-if="props.upload">请将文件手动上传至该目录！</div>
      <a-tabs defaultActiveKey="1" v-if="props.TypeShow === 1">
        <a-tab-pane tab="字段信息配置" key="1">
          <div>
            <a-form ref="formRef" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="8">字段名</a-col>
                <a-col :span="8">字段类型</a-col>
                <a-col :span="3">字段长度</a-col>
                <a-col :span="2" v-if="!disabled">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumDisposition"
                     :key="index">
                <a-col :span="8">
                  <a-form-item>
                    <a-input placeholder="字段名" v-model:value="item.dispositionRemark" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-select placeholder="字段类型" v-model:value="item.dispositionType" :disabled="disabled">
                      <a-select-option value="varchar">字符类型</a-select-option>
                      <a-select-option value="date">日期类型</a-select-option>
                      <a-select-option value="datetime">日期时间类型</a-select-option>
                      <a-select-option value="decimal">数字类型</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <a-form-item>
                    <a-input-number :step="1" placeholder="字段长度" v-model:value="item.dispositionLength" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="2" v-if="!disabled">
                  <a-form-item>
<!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'loitSeleniumDisposition')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('loitSeleniumDisposition',FormData.loitSeleniumDisposition.length)" v-if="!disabled">
                <Icon icon="ph:plus-bold" />
                添加字段信息
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-tabs defaultActiveKey="2" v-if="props.TypeShow === 2">
        <a-tab-pane tab="字段信息配置" key="2">
          <div>
            <a-form ref="formRef1" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="6">字段名</a-col>
                <a-col :span="6">字段类型</a-col>
                <a-col :span="4">字段长度</a-col>
                <a-col :span="3">是否查询</a-col>
                <a-col :span="2" v-if="!disabled">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumDisposition"
                     :key="index">
                <a-col :span="6">
                  <a-form-item>
                    <a-input placeholder="字段名" v-model:value="item.dispositionRemark" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-select placeholder="字段类型"  v-model:value="item.dispositionType" :disabled="disabled">
                      <a-select-option value="varchar">字符类型</a-select-option>
                      <a-select-option value="date">日期类型</a-select-option>
                      <a-select-option value="datetime">日期时间类型</a-select-option>
                      <a-select-option value="decimal">数字类型</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-input-number :step="1" placeholder="字段长度" :min="0" :controls="false" v-model:value="item.dispositionLength" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="3">
                  <a-form-item>
                    <a-radio-group v-model:value="item.isQuery" name="radioGroup" :disabled="disabled">
                      <a-radio value="1">是</a-radio>
                      <a-radio value="2">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="2" v-if="!disabled">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'loitSeleniumDisposition')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('loitSeleniumDisposition',FormData.loitSeleniumDisposition.length)" v-if="!disabled">
                <Icon icon="ph:plus-bold" />
                添加字段信息
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-tabs defaultActiveKey="3" v-if="props.TypeShow === 3">
        <a-tab-pane tab="文件夹信息配置" key="3">
          <div>
            <a-form ref="formRef1" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="7">文件夹包含文件</a-col>
                <a-col :span="5">文件存放方式</a-col>
                <a-col :span="5">源文件夹命名方式</a-col>
                <a-col :span="5">源文件命名方式</a-col>
                <a-col :span="2" v-if="!disabled">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.ConfigurList"
                     :key="index">
                <a-col :span="7">
                  <a-form-item v-if="item.BHNR != '身份证照片'">
                    <a-select placeholder="请选择" v-model:value="item.BHNR" :disabled="disabled">
                      <a-select-option value="身份证照片">身份证照片</a-select-option>
                      <a-select-option value="还款情况表">还款情况表</a-select-option>
                      <a-select-option value="贷款合同">贷款合同</a-select-option>
                      <a-select-option value="支付证明">支付证明</a-select-option>
                      <a-select-option value="结清证明">结清证明</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-else>
                    <a-row>
                      <a-col :span="11">
                        <a-select placeholder="请选择" v-model:value="item.BHNR" :disabled="disabled">
                          <a-select-option value="身份证照片">身份证照片</a-select-option>
                          <a-select-option value="还款情况表">还款情况表</a-select-option>
                          <a-select-option value="贷款合同">贷款合同</a-select-option>
                          <a-select-option value="支付证明">支付证明</a-select-option>
                          <a-select-option value="结清证明">结清证明</a-select-option>
                        </a-select>
                      </a-col>
                      <span style="margin: 4px 4px 0 4px;">+</span>
                      <a-col :span="11">
                        <a-select placeholder="请选择" v-model:value="item.sfzgs" :disabled="disabled">
                          <a-select-option value="身份证">正反面</a-select-option>
                          <a-select-option value="姓名">单面</a-select-option>
                        </a-select>
                      </a-col>
                    </a-row>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                    <a-select placeholder="请选择" v-model:value="item.WJCFFS" :disabled="disabled">
                      <a-select-option value="全部在一个文件夹">全部在一个文件夹</a-select-option>
                      <a-select-option value="一个文件一个文件夹">一个文件一个文件夹</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                    <a-select placeholder="请选择" v-model:value="item.WJJMC1" :disabled="disabled">
                      <a-select-option value="姓名">姓名+订单号</a-select-option>
                      <a-select-option value="支付凭证">支付凭证</a-select-option>
                      <a-select-option value="借款凭证">借款凭证</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                        <a-select placeholder="请选择" v-model:value="item.WJJMC2" :disabled="disabled">
                          <a-select-option value="被告人身份证正反面">被告人身份证正反面</a-select-option>
                          <a-select-option value="贷款合同">贷款合同</a-select-option>
                          <a-select-option value="还款情况表">还款情况表</a-select-option>
                          <a-select-option value="借款合同号+支付凭证">借款合同号+支付凭证</a-select-option>
                          <a-select-option value="借款合同号+借款凭证">借款合同号+借款凭证</a-select-option>
                        </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="2" v-if="!disabled">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'ConfigurList')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('ConfigurList','1')" v-if="!disabled">
                <Icon icon="ph:plus-bold" />
                添加字段信息
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-tabs defaultActiveKey="4" v-if="props.TypeShow === 4">
        <a-tab-pane tab="文件上传列表" key="4">
          <div>
            <a-form ref="formRef1" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="10">文件名</a-col>
                <a-col :span="10">上传</a-col>
                <a-col :span="2" v-if="!disabled">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumFile"
                     :key="index">
                <a-col :span="10">
                  <a-form-item :rules="[{ required: true, message: '请输入文件名称!' }]" :name="['loitSeleniumFile', index, 'fileName']">
                    <a-input v-model:value="item.fileName" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-form-item :rules="[{ required: true, message: '请上传文件!' }]" :name="['loitSeleniumFile', index, 'filePath']">
                    <JUpload v-model:value="item.filePath" :disabled="disabled || !item.fileName" :data="{fileType:'5',filePath:'Allocation',bizName:item.fileName}"></JUpload>
                  </a-form-item>
                </a-col>
                <a-col :span="2" v-if="!disabled">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'loitSeleniumFile')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('loitSeleniumFile','1')" v-if="!disabled">
                <Icon icon="ph:plus-bold" />
                添加上传文件
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-tabs defaultActiveKey="4" v-if="props.TypeShow === 5">
        <a-tab-pane tab="非标准文件配置" key="4">
          <div>
            <a-form ref="formRef1" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="10">文件夹名称</a-col>
                <a-col :span="10">文件命名方式</a-col>
                <a-col :span="2">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumUnfile"
                     :key="index">
                <a-col :span="10">
                  <a-form-item :rules="[{ required: true, message: '请输入文件夹名称!' }]" :name="['loitSeleniumUnfile', index, 'unfileName']">
                    <a-input placeholder="文件夹名称" v-model:value="item.unfileName" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-form-item :rules="[{ required: true, message: '请选择文件命名方式!' }]" :name="['loitSeleniumUnfile', index, 'unfileType']">
                    <a-select placeholder="文件命名方式"  v-model:value="item.unfileType" :disabled="disabled">
                      <a-select-option v-for="(item1,index) in formdata.loitSeleniumDisposition" :key="index" :value="item1.dispositionRemark">{{item1.dispositionRemark}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="2" v-if="!disabled">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'loitSeleniumUnfile')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('loitSeleniumUnfile','1')" v-if="!disabled">
                <Icon icon="ph:plus-bold" />
                添加字段信息
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="数据表字段信息配置" key="5">
          <div>
            <a-form ref="formRef2" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="11">字段名称</a-col>
                <a-col :span="11">必填项名称</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumDisposition"
                     :key="index">
                <a-col :span="11">
                  <a-form-item :rules="[{ required: true, message: '请选择字段名称!' }]" :name="['loitSeleniumDisposition', index, 'id']">
                    <a-select placeholder="字段名称"  v-model:value="item.id" :disabled="disabled">
                      <a-select-option v-for="(item1,index) in formdata.loitSeleniumDisposition" :key="index" :value="item1.id">{{item1.dispositionRemark}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="11">
                  <a-form-item>
                    {{item.dispositionRemark}}
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="还款计划表字段信息配置" key="6">
          <div>
            <a-form ref="formRef3" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="11">字段名称</a-col>
                <a-col :span="11">必填项名称</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumRepaymentData"
                     :key="index">
                <a-col :span="11">
                  <a-form-item :rules="[{ required: true, message: '请选择字段名称!' }]" :name="['loitSeleniumRepaymentData', index, 'id']">
                    <a-select placeholder="字段名称"  v-model:value="item.id" :disabled="disabled">
                      <a-select-option v-for="(item1,index) in formdata.loitSeleniumRepaymentData" :key="index" :value="item1.id">{{item1.dispositionRemark}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="11">
                  <a-form-item>
                    {{item.dispositionRemark}}
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-tabs defaultActiveKey="1" v-if="props.TypeShow === 6">
        <a-tab-pane tab="债权转让合同列表" key="1">
          <div>
            <a-form ref="formRef1" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="7">债权转让合同名称</a-col>
                <a-col :span="5">转让方</a-col>
                <a-col :span="5">受让方</a-col>
                <a-col :span="4">签订时间</a-col>
                <a-col :span="2" v-if="!disabled">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.loitSeleniumTransfer"
                     :key="index">
                <a-col :span="7">
                  <a-form-item>
                    <a-input placeholder="债权转让合同名称" v-model:value="item.transferName" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                    <a-input placeholder="转让方" v-model:value="item.assignor" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item>
                    <a-input placeholder="受让方" v-model:value="item.assignee" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-date-picker placeholder="签订时间" v-model:value="item.transferTime" valueFormat="YYYY年MM月DD日" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="2" v-if="!disabled">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'loitSeleniumTransfer')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('loitSeleniumTransfer',FormData.loitSeleniumTransfer.length)" v-if="!disabled">
                <Icon icon="ph:plus-bold" />
                添加字段信息
              </a-button>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
import BasicModal from "/@/components/Modal/src/BasicModal.vue";
import { BasicForm, useForm } from "/@/components/Form";
import { computed, reactive, ref, unref, watch } from "vue";
import { BasicColumn, BasicTable, useTable } from "/@/components/Table";
import { useModalInner } from "@/components/Modal";
import { loitSeleniumData, loitSeleniumRepaymentData } from "@/views/SharedFile/tableData";
import JUpload from '/@/components/Form/src/jeecg/components/JUpload/JUpload.vue';

const labelCol = reactive({
  xs: { span: 24 },
  sm: { span: 5 }
});
const wrapperCol = reactive({
  xs: { span: 24 },
  sm: { span: 22 }
});
const formRef = ref();
let schemas = ref([]);
const formRef1 = ref(null);
const formRef2 = ref(null);
const formRef3 = ref(null);
let emit = defineEmits(["addData", "closeModal","editData"]);
//获取父页面传递的数据
const props = defineProps({
  userData: { type: Object },
  addFeature: {
    type: Boolean,
    default: false
  },
  title: {
    type:String,
    default: '添加'
  },
  TypeShow:{
    type:Number,
    default: 0
  },
  showOkBtn:{
    type:Boolean,
    default: true
  },
  disabled:{
    type:Boolean,
    default: false
  },
  upload:{
    type:Boolean,
    default: false
  }
});
let formdata = ref({});
const [registerForm, { validate, setProps, setFieldsValue }] = useForm({
  //注册表单列
  schemas: schemas,
  labelWidth: "110px",
  showActionButtonGroup: false,
});

const FormData = reactive({
  loitSeleniumDisposition: loitSeleniumData,
  loitSeleniumRepaymentData: loitSeleniumRepaymentData,
  ConfigurList:[],
  loitSeleniumFile:[{}],
  loitSeleniumUnfile:[{}],
  loitSeleniumTransfer:[{}]
});

async function addData() {
  let a = await validate();
  if(props.TypeShow === 2 || props.TypeShow === 1){
    FormData.loitSeleniumDisposition.forEach((item,i)=>{
      FormData.loitSeleniumDisposition[i].dispositionSerial = i
    })
    a.loitSeleniumDisposition = FormData.loitSeleniumDisposition
    if(props.title == '添加'){
      emit("addData", a);
    }else {
      a.id = formdata.value.id
      emit("editData", a);
    }
  }else if(props.TypeShow === 3){
    a.ConfigurList = FormData.ConfigurList
    if(props.title == '添加'){
      emit("addData", a);
    }else {
      a.id = formdata.value.id
      emit("editData", a);
    }
  }else if(props.TypeShow === 4){
    formRef1.value
      .validate()
      .then(() => {
        a.loitSeleniumFile = FormData.loitSeleniumFile
        if(props.title == '添加'){
          emit("addData", a);
        }else {
          a.id = formdata.value.id
          emit("editData", a);
        }
      })
      .catch(error => {
      });

  }else if(props.TypeShow === 5){
    formRef1.value
      .validate()
      .then(() => {
        formRef2.value
          .validate()
          .then(() => {
            formRef3.value
              .validate()
              .then(() => {
                a.loitSeleniumDisposition = []
                a.loitSeleniumRepaymentData = []
                FormData.loitSeleniumRepaymentData.forEach(item1=>{
                  formdata.value.loitSeleniumRepaymentData.forEach(item=>{
                    if(item.id == item1.id){
                      a.loitSeleniumRepaymentData.push({
                        id:item1.id,
                        dispositionName:item1.dispositionName,
                        dispositionType:item1.dispositionType,
                        dispositionRemark:item.dispositionRemark,
                        dispositionLength:item1.dispositionLength
                      })
                    }
                  })
                })
                FormData.loitSeleniumDisposition.forEach(item1=>{
                  formdata.value.loitSeleniumDisposition.forEach(item=>{
                    if(item.id == item1.id){
                      a.loitSeleniumDisposition.push({
                        id:item1.id,
                        dispositionName:item1.dispositionName,
                        dispositionType:item1.dispositionType,
                        dispositionRemark:item.dispositionRemark,
                        dispositionLength:item1.dispositionLength,
                        isQuery:item1.isQuery
                      })
                      return
                    }
                  })
                })
                a.loitSeleniumUnfile = FormData.loitSeleniumUnfile
                if(props.title == '添加'){
                  emit("addData", a);
                }else {
                  a.id = formdata.value.id
                  emit("editData", a);
                }
              })
              .catch(error => {
              });
          })
          .catch(error => {
          });
      })
      .catch(error => {
      });
  }else if(props.TypeShow === 6){
    FormData.loitSeleniumTransfer.forEach((item,i)=>{
      FormData.loitSeleniumTransfer[i].transferSerial = i
    })
    a.loitSeleniumTransfer = FormData.loitSeleniumTransfer
    if(props.title == '添加'){
      emit("addData", a);
    }else {
      a.id = formdata.value.id
      emit("editData", a);
    }
  }else{
    if(props.title == '添加'){
      emit("addData", a);
    }else {
      a.id = formdata.value.id
      emit("editData", a);
    }
  }
}

function closeModal() {
  FormData.loitSeleniumDisposition.forEach((item,i)=>{
    FormData.loitSeleniumDisposition[i].id = null
  })
  FormData.loitSeleniumRepaymentData.forEach((item,i)=>{
    FormData.loitSeleniumRepaymentData[i].id = null
  })
  FormData.loitSeleniumDisposition = []
  FormData.loitSeleniumFile=[{}]
  FormData.loitSeleniumUnfile=[{}]
  FormData.loitSeleniumTransfer = [{}]
  emit("closeModal");
}

async function setData() {
  // if(formdata.value){
  //   await setFieldsValue(formdata)
  // }
}

//动态添加行
function addRowCustom(v,length) {
  if(props.TypeShow === 2 || props.TypeShow === 1) {
    FormData[v].push({dispositionType:"varchar",dispositionLength:255,dispositionName:'value' + (length+1),dispositionRemark:'',isQuery:'2'});
  }else if(props.TypeShow === 3 || props.TypeShow === 4 || props.TypeShow === 5 || props.TypeShow === 6) {
    FormData[v].push({});
  }
}

//删除行
function delRowCustom(index,v) {
  FormData[v].splice(index, 1);
}

watch(() => props.userData, () => {
  if (props.userData) {
    schemas.value = props.userData.schema;
    formdata.value = props.userData.formdata;
    if (unref(props.userData.formdata)) {
      if(props.TypeShow === 2 || props.TypeShow === 1){
        if(formdata.value.loitSeleniumDisposition){
          FormData.loitSeleniumDisposition = formdata.value.loitSeleniumDisposition
        }else if(!formdata.value.loitSeleniumDisposition && props.TypeShow === 2){
          FormData.loitSeleniumDisposition = JSON.parse(JSON.stringify(loitSeleniumData))
        }
      }else if(props.TypeShow === 3 && formdata.value.ConfigurList){
        FormData.ConfigurList = formdata.value.ConfigurList
      }else if(props.TypeShow === 4 && formdata.value.loitSeleniumFile){
        FormData.loitSeleniumFile = formdata.value.loitSeleniumFile
      }else if(props.TypeShow === 5){
      }else if(props.TypeShow === 6 && formdata.value.loitSeleniumTransfer){
        FormData.loitSeleniumTransfer = formdata.value.loitSeleniumTransfer
      }
      setTimeout(() => {
        setFieldsValue(formdata.value);
      }, 200);
    }
  }
}, { immediate: true, deep: true });

</script>

<style scoped lang="less">
:deep(.ant-descriptions-item-label) {
  width: 24%;
  min-width: 100px;
  max-width: 220px;
}

.tableBox {
  padding: 20px 20px -20px 20px;
  margin: 10px 20px 0 20px;
  height: 100%;

  :deep(.ant-table .cell) {
    line-height: 23px;
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
  .font-color {
    font-size: 13px;
    color: #a1a1a1;
    margin-bottom: 5px;
  }
}
</style>
