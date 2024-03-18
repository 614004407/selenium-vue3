<template>
  <BasicModal :maskClosable="false" :canFullscreen="false" destroyOnClose :title="title" width="1200px" :okText="'保存'" :cancelText="'取消'" @ok="addData" @cancel="closeModal" :showOkBtn="showOkBtn">
    <div style="max-height: 600px;">
      <BasicForm @register="registerForm" @submit="addData" :disabled="disabled"></BasicForm>
      <a-tabs defaultActiveKey="1" v-if="props.TypeShow === 1">
        <a-tab-pane tab="字段信息配置" key="1">
          <div>
            <a-form ref="formRef" :model="FormData" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row type="flex" style="margin-bottom: 10px" :gutter="16">
                <a-col :span="7">字段名</a-col>
                <a-col :span="7">字段类型</a-col>
                <a-col :span="7">字段长度</a-col>
                <a-col :span="2">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.RepaymentList"
                     :key="index">
                <a-col :span="7">
                  <a-form-item>
                    <a-input placeholder="字段名" v-model:value="item.ZDM" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item>
                    <a-select placeholder="字段类型" v-model:value="item.ZDLX" :disabled="disabled">
                      <a-select-option value="varchar">字符类型</a-select-option>
                      <a-select-option value="date">日期类型</a-select-option>
                      <a-select-option value="int">数字类型</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item>
                    <a-input-number :step="1" placeholder="字段长度" v-model:value="item.ZDCD" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="2">
                  <a-form-item>
<!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'RepaymentList')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('RepaymentList')">
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
                <a-col :span="7">字段名</a-col>
                <a-col :span="7">字段类型</a-col>
                <a-col :span="7">字段长度</a-col>
                <a-col :span="2">操作</a-col>
              </a-row>
              <a-row type="flex" style="margin-bottom: 10px" :gutter="24" v-for="(item, index) in FormData.ConfigurList"
                     :key="index">
                <a-col :span="7">
                  <a-form-item>
                    <a-input placeholder="字段名" v-model:value="item.ZDM" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item>
                    <a-select placeholder="字段类型" v-model:value="item.ZDLX" :disabled="disabled">
                      <a-select-option value="字符类型">字符类型</a-select-option>
                      <a-select-option value="日期类型">日期类型</a-select-option>
                      <a-select-option value="数字类型">数字类型</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item>
                    <a-input-number :step="1" placeholder="字段长度" v-model:value="item.ZDCD" :disabled="disabled"/>
                  </a-form-item>
                </a-col>
                <a-col :span="2">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'ConfigurList')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('ConfigurList')">
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
                <a-col :span="2">操作</a-col>
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
                <a-col :span="2">
                  <a-form-item>
                    <!--                    <Icon icon="ant-design:minus-outlined" @click="delRowCustom(index)" style="fontsize: 20px" />-->
                    <a @click="delRowCustom(index,'ConfigurList')">删除</a>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-button type="dashed" style="width: 98%; margin-top: 10px" @click="addRowCustom('ConfigurList')">
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
import { onMounted, reactive, ref, watch } from "vue";
import { BasicColumn, BasicTable, useTable } from "/@/components/Table";
import { useModalInner } from "@/components/Modal";

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
let emit = defineEmits(["addData", "closeModal"]);
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
  }
});
const [registerForm, { validate, setProps, setFieldsValue }] = useForm({
  //注册表单列
  schemas: schemas,
  labelWidth: "110px",
  showActionButtonGroup: false,
});
let formdata = ref({});
const FormData = reactive({
  RepaymentList: [],
  ConfigurList:[]
});

async function addData() {
  let a = await validate();
  console.log(a);
  emit("addData", a);
}

function closeModal() {
  FormData.RepaymentList = []
  FormData.ConfigurList = []
  emit("closeModal");
}

async function setData() {
  // if(formdata.value){
  //   await setFieldsValue(formdata)
  // }
}

//动态添加行
function addRowCustom(v) {
  FormData[v].push({});
}

//删除行
function delRowCustom(index,v) {
  FormData[v].splice(index, 1);
}

watch(() => props.userData, () => {
  if (props.userData) {
    schemas.value = props.userData.schema;
    formdata.value = props.userData.formdata;
    if (formdata) {
      setTimeout(() => {
        setFieldsValue(formdata.value);
      }, 1500);
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
}
</style>
