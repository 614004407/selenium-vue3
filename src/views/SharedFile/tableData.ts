import {BasicColumn, FormSchema} from "/@/components/Table";
import {TreeItem} from '/@/components/Tree';
import {reactive, ref, unref} from 'vue';

import {h} from 'vue'
import {Tag, Input} from 'ant-design-vue';
import {text} from "stream/consumers";
import {render} from '/@/utils/common/renderUtils'
import {DescItem} from "/@/components/Description";
import JSelectInput from "/@/components/Form/src/jeecg/components/JSelectInput.vue";
import {filterObj} from "/@/utils/common/compUtils";
import { JVxeColumn, JVxeTypes } from "@/components/jeecg/JVxeTable/src/types";
import { getBatchList } from "@/api/selenium/batch";
import { getProjectList } from "@/api/selenium/project";
import { useMessage } from "@/hooks/web/useMessage";
import { useGlobSetting } from "@/hooks/setting";
const { createMessage, createWarningModal } = useMessage();
const glob = useGlobSetting();

//去除空字段
export function removeProperty(obj) {
  Object.keys(obj).forEach(item => {
    if (obj[item] === '' || obj[item] === [] || obj[item] === {} || obj[item] === undefined || obj[item] === null || obj[item] === 'null') delete obj[item]
  })
  return obj
}
export const isReturn = (fileInfo) => {
  try {
    if (fileInfo.code === 201) {
      let {
        message,
        result: { msg, fileUrl, fileName },
      } = fileInfo;
      let href = glob.uploadUrl + fileUrl;
      createWarningModal({
        title: message,
        centered: false,
        content: `<div>
                                <span>${msg}</span><br/> 
                                <span>具体详情请<a href = ${href} download = ${fileName}> 点击下载 </a> </span> 
                              </div>`,
      });
      //update-begin---author:wangshuai ---date:20221121  for：[VUEN-2827]导入无权限，提示图标错误------------
    } else if (fileInfo.code === 500 || fileInfo.code === 510) {
      createMessage.error(fileInfo.message || ` 导入失败`);
      //update-end---author:wangshuai ---date:20221121  for：[VUEN-2827]导入无权限，提示图标错误------------
    } else {
      createMessage.success(fileInfo.message.split("_")[1] + ` 诉状文件生成成功`);
    }
  } catch (error) {
    console.log('导入的数据异常', error);
  }
};
export function getNowFormatDate(v) {
  let date = v.length>0 ? new Date(v) : new Date(),
    year = date.getFullYear(),              //获取完整的年份(4位)
    month = date.getMonth() + 1,            //获取当前月份(0-11,0代表1月)
    strDate = date.getDate()                // 获取当前日(1-31)
  if (month < 10) month = `0${month}`       // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
  return `${year}年${month}月${strDate}日`
}
//日期转换
export function transDate(format, date) {
  /* 将时间戳转换为 Date 格式 */
  const isNumber = /^[0-9]+.?[0-9]*/.test(date);
  if (isNumber) {
    const dateLength = `${date}`.length;
    // 不足13位补足
    const lessThan = date * Math.pow(10, 13 - dateLength);
    // 多于13位去除
    const moreThan = +`${date}`.substring(0, 13);
    const timestamp = dateLength < 13 ? lessThan
      : dateLength > 13 ? moreThan : date;
    date = new Date(timestamp);
  }

  // 剔除非 Date 格式的数据
  const isDateFormat = date instanceof Date;
  if (!isDateFormat) return '-';

  const transTime = (t) => { return t < 10 ? `0${t}` : t };
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = transTime(date.getMinutes());
  const seconds = transTime(date.getSeconds());
  const timeMap = {
    'Y+': year,		// 年
    'M+': month,	// 月
    'D+': day,		// 日
    'h+': hours,	// 时
    'm+': minutes,	// 分
    's+': seconds,	// 秒
  };

  for (const k in timeMap) {
    const ret = new RegExp(`(${k})`).exec(format);
    if (ret) {
      format = format.replace(ret[0], timeMap[k]);
    }
  }

  return format;
}

export function SetProjectSchema(Enterpriselist): FormSchema[] {
  return [
    {
      field: 'projectName',
      component: 'Input',
      label: '项目名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'projectSource',
      component: 'Input',
      label: '项目资金方名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
    },
    {
      field: 'platformName',
      component: 'Input',
      label: '平台APP名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
    },
    {
      field: 'operatorName',
      component: 'Input',
      label: '平台运营公司名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
    },
    {
      field: 'enterpriseId',
      component: 'Select',
      label: '起诉主体',
      labelWidth:130,
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择',
          options: Enterpriselist.value
        }
      }
    },
    {
      field: 'fileType',
      component: 'Select',
      label: '文件夹类型',
      labelWidth:130,
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择文件夹类型',
          options: [
            {
              label: '标准文件夹',
              value: '标准文件夹',
            },
            {
              label: '非标准文件夹',
              value: '非标准文件夹',
            },
          ],
        }
      }
    },
    {
      field: 'isGuarantee',
      component: 'Select',
      label: '是否有担保',
      labelWidth:130,
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择',
          options: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
        }
      }
    },
    {
      field: 'guaranteeName',
      component: 'Input',
      label: '担保公司名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
    },
  ];
}

export function SetProjectForm(Enterpriselist,ZipDictionary): FormSchema[] {
  return [
    {
      field: 'projectName',
      component: 'Input',
      label: '项目名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'projectSource',
      component: 'Input',
      label: '项目资金方名称',
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'platformName',
      component: 'Input',
      label: '平台APP名称',
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'operatorName',
      component: 'Input',
      label: '平台运营公司名称',
      labelWidth:130,
      required: true,
      colProps: {
        span: 11,
      },
    },
    {
      field: 'isGuarantee',
      component: 'Select',
      label: '是否有担保',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择',
          options: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
        }
      }
    },
    {
      field: 'guaranteeName',
      component: 'Input',
      label: '担保公司名称',
      colProps: {
        span: 12,
      },
      ifShow: ({ values }) => {
        return values.isGuarantee === '0' ? true : false;
      },
      required: ({ values }) => {
        return values.isGuarantee === '0' ? true : false;
      },
    },
    {
      field: 'enterpriseId',
      component: 'Select',
      label: '起诉主体',
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择',
          options: Enterpriselist.value
        }
      }
    },
    {
      field: 'zipId',
      component: 'Select',
      label: '公共资料',
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择',
          options: ZipDictionary.value
        }
      }
    },
    {
      field: 'fileType',
      component: 'Select',
      label: '文件夹类型',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择文件夹类型',
          options: [
            {
              label: '标准文件夹',
              value: '标准文件夹',
            },
            {
              label: '非标准文件夹',
              value: '非标准文件夹',
            },
          ],
        }
      }
    },
    {
      field: 'projectCatalogue',
      component: 'Input',
      label: '项目根目录',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        if (formModel.projectName) {
          formModel.projectCatalogue = "C:/不良资产处置/" + formModel.projectName
        } else {
          formModel.projectCatalogue = ''
        }
        return {
          disabled:true
        }
      },
    },
    {
      field: 'projectDescription',
      component: 'InputTextArea',
      label: '项目描述',
      required: true,
      componentProps: ({formModel}) => {
        return {
          placeholder: '请输入',
          allowClear: true,
          showCount: true,
        }
      },
    },
  ];
}

export function SetProjectColumns(Enterpriselist): BasicColumn[] {
  return [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 200,
    },
    {
      title: '项目资金方名称',
      width: 150,
      dataIndex: 'projectSource',
    },
    {
      title: '平台APP名称',
      dataIndex: 'platformName',
      width: 200,
    },
    {
      title: '平台运营公司名称',
      width: 150,
      dataIndex: 'operatorName',
    },
    {
      title: '是否有担保',
      width: 150,
      dataIndex: 'isGuarantee',
      customRender: ({ text, record }) => {
        let name = ''
        switch (text){
          case '0' :
            name = '是'
            break;
          case '1' :
            name = '否'
            break;
        }
        return name
      }
    },
    {
      title: '担保公司名称',
      width: 150,
      dataIndex: 'guaranteeName',
    },
    {
      title: '起诉主体',
      width: 150,
      dataIndex: 'enterpriseId',
      customRender: ({ text, record }) => {
        let name = ''
        Enterpriselist.value.forEach((item)=>{
          if(item.value == text){
            name = item.label
          }
        })
        return name
      }
    },
    {
      title: '文件夹类型',
      dataIndex: 'fileType',
      width: 150,
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Details',
      fixed: 'right',
    },
  ];
}

export const SetProData = [
  {
    XMMC:'项目名称1',
    XMLY:'银行1',
    WJJLX:'标准文件夹',
    XMGML:'d:\\data\\tableData.zip',
    XMMS:'测试123456789',
    SFXYYCL:'否',
  },
  {
    XMMC:'项目名称2',
    XMLY:'银行2',
    WJJLX:'非标准文件夹',
    XMGML:'d:\\data\\tableData1.excel',
    XMMS:'测试123456789',
    SFXYYCL:'是',
  },
]

export function BuildBatchSchema(Enterpriselist,Enterpriselist1,Enterpriselist2): FormSchema[] {
  return [
    {
      field: 'batchName',
      component: 'Input',
      label: '批次名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入批次名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'projectName',
      component: 'Input',
      label: '项目名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'prosecutionMode',
      component: 'Select',
      label: '起诉模式',
      colProps: {
        span: 6,
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
        }
      }
    },
    {
      field: 'enterpriseId',
      component: 'Select',
      label: '起诉主体',
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        let options = []
        if(formModel.prosecutionMode){
          if(formModel.prosecutionMode == '1'){
            options = Enterpriselist1.value
          }else if(formModel.prosecutionMode == '2'){
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
    },
  ];
}

export function BuildBatchForm(ProjectDictionary,Enterpriselist,Enterpriselist1,Enterpriselist2): FormSchema[] {
  let projectName = ref('')
  return [
    {
      field: 'batchName',
      component: 'Input',
      label: '批次名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入批次名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'projectId',
      component: 'Select',
      label: '项目名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择项目名称',
          options: ProjectDictionary.value,
          onChange:(value, option)=>{
            if(option){
              projectName.value = option.label
              formModel.enterpriseId = option.id
              formModel.prosecutionMode = option.enterpriseStats
            }else{
              projectName.value = null
              formModel.enterpriseId = null
              formModel.prosecutionMode = null
            }
          }
        }
      }
    },
    {
      field: 'prosecutionMode',
      component: 'Select',
      label: '起诉模式',
      required: true,
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
            formModel.enterpriseId = null
          }
        }
      }
    },
    {
      field: 'enterpriseId',
      component: 'Select',
      label: '起诉主体',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        let options = []
        if(formModel.prosecutionMode){
          if(formModel.prosecutionMode == '1'){
            options = Enterpriselist1.value
          }else if(formModel.prosecutionMode == '2'){
            options = Enterpriselist2.value
          }
        }
        return {
          placeholder: '请选择',
          options: options
        }
      }
    },
    {
      field: 'loancontractName',
      component: 'Input',
      label: '贷款合同名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入贷款合同名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'guaranteecontractName',
      component: 'Input',
      label: '担保合同名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入担保合同名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'transferName',
      component: 'Input',
      label: '债权转让协议名称1',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) =>  {
        return {
          placeholder: '担保公司与平台运营公司名称签署的协议名称',
          onChange: (e) => {
            console.log(e);
          },
        }
      },
    },
    {
      field: 'transferName1',
      component: 'Input',
      label: '债权转让协议名称2',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) =>  {
        return {
          placeholder: '平台运营公司名称与原告签署的协议名称',
          onChange: (e) => {
            console.log(e);
          },
        }
      },
    },
    {
      field: 'transferTime',
      component: 'DatePicker',
      label: '债权转让签订时间',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          format:'YYYY-MM-DD',
          valueFormat:'YYYY-MM-DD',
        }
      },
    },
    {
      field: 'batchNum',
      component: 'InputNumber',
      label: '批次文件数量',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '',
          step: 1
        }
      },
      defaultValue:0
    },
    {
      field: 'batchTable',
      component: 'JUpload',
      label: '数据表上传',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps:  ({formModel}) => {
        return {
          text: '请上传数据表',
          maxCount: 1,
          download: true,
          data:{
            fileType:1,
            filePath:projectName.value + '/' + formModel.batchName
          }
        }
      },
    },
    {
      field: 'batchRefund',
      component: 'JUpload',
      label: '还款计划表上传',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          text: '请上传还款计划表',
          maxCount: 1,
          download: true,
          data:{
            fileType:1,
            filePath:projectName.value + '/' + formModel.batchName
          }
        }
      },
    },
    {
      field: 'batchFile',
      component: 'Input',
      label: '标准文件地址',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps:async ({ formModel }) => {
        if (formModel.projectId && formModel.batchName) {
          let res = await getProjectList({id:formModel.projectId})
          formModel.batchFile = res.result.records[0].projectCatalogue + "/" + formModel.batchName + "/file"
        } else {
          formModel.batchFile = ''
        }
      },
      dynamicDisabled:({values })=>{
        return true
      }
    },
    {
      field: 'batchUnFile',
      component: 'Input',
      label: '非标准文件地址',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps:async ({ formModel }) => {
        if (formModel.projectId && formModel.batchName) {
          let res = await getProjectList({id:formModel.projectId})
          formModel.batchUnFile = res.result.records[0].projectCatalogue + "/" + formModel.batchName + "/unFile"
        } else {
          formModel.batchUnFile = ''
        }
      },
      dynamicDisabled:({values })=>{
        return true
      }
    },
  ];
}

export function BuildBatchColumns(Enterpriselist): BasicColumn[] {
  return [
    {
      title: '批次名称',
      dataIndex: 'batchName',
      width: 200,
    },
    {
      title: '项目名称',
      width: 150,
      dataIndex: 'projectName',
    },
    {
      title: '起诉模式',
      width: 150,
      dataIndex: 'prosecutionMode',
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
    },
    {
      title: '起诉主体',
      width: 150,
      dataIndex: 'enterpriseId',
      customRender: ({ text, record }) => {
        let name = ''
        Enterpriselist.value.forEach((item)=>{
          if(item.value == text){
            name = item.label
          }
        })
        return name
      }
    },
    {
      title: '标准文件目录',
      dataIndex: 'batchFile',
      width: 150,
    },
    {
      title: '非标准文件目录',
      dataIndex: 'batchUnFile',
      width: 150,
    },
    {
      title: '批次数量',
      dataIndex: 'batchNum',
      width: 150,
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'BatchDetails',
      fixed: 'right',
    },
  ];
}

export const BuildBatchData = [
  {
    PCMC:'批次名称1',
    XMMC:'项目名称2',
    PCSL:12,
    SJB:"d:\\data\\数据表1.zip",
    HKJHB:"d:\\data\\还款计划表1.zip",
    DBYSWJ:"d:\\data\\测试1.zip",
  },
  {
    PCMC:'批次名称2',
    XMMC:'项目名称1',
    PCSL:8,
    SJB:"d:\\data\\数据表2.zip",
    HKJHB:"d:\\data\\还款计划表2.zip",
    DBYSWJ:"d:\\data\\测试2.zip",
  },
]

export function BatchQuerySchema(Enterpriselist,Enterpriselist1,Enterpriselist2): FormSchema[] {
  return [
    {
      field: 'batchName',
      component: 'Input',
      label: '批次名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入批次名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'projectName',
      component: 'Input',
      label: '项目名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'prosecutionMode',
      component: 'Select',
      label: '起诉模式',
      colProps: {
        span: 6,
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
        }
      }
    },
    {
      field: 'enterpriseId',
      component: 'Select',
      label: '起诉主体',
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        let options = []
        if(formModel.prosecutionMode){
          if(formModel.prosecutionMode == '1'){
            options = Enterpriselist1.value
          }else if(formModel.prosecutionMode == '2'){
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
    },
    {
      field: 'batchProcessState',
      component: 'Select',
      label: '预处理状态',
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择预处理状态',
          options: [
            {
              label: '需要预处理',
              value: '1',
            },
            {
              label: '不需要预处理',
              value: '0',
            },
            {
              label: '预处理错误',
              value: '3',
            },
            {
              label: '预处理成功',
              value: '2',
            },
          ],
        }
      }
    },
    {
      field: 'batchTreatmentState',
      component: 'Select',
      label: '数据处理状态',
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择数据处理状态',
          options: [
            {
              label: '未处理',
              value: '0',
            },
            {
              label: '数据处理出错',
              value: '2',
            },
            {
              label: '数据处理成功',
              value: '1',
            },
          ],
        }
      }
    },
  ];
}

export function BatchQueryColumns(Enterpriselist): BasicColumn[] {
  return [
    {
      title: '批次名称',
      dataIndex: 'batchName',
      width: 200,
    },
    {
      title: '项目名称',
      width: 150,
      dataIndex: 'projectName',
    },
    {
      title: '上传日期',
      dataIndex: 'batchDatatime',
      width: 150,
    },
    {
      title: '起诉模式',
      width: 150,
      dataIndex: 'prosecutionMode',
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
    },
    {
      title: '起诉主体',
      width: 150,
      dataIndex: 'enterpriseId',
      customRender: ({ text, record }) => {
        let name = ''
        Enterpriselist.value.forEach((item)=>{
          if(item.value == text){
            name = item.label
          }
        })
        return name
      }
    },
    {
      title: '标准文件目录',
      dataIndex: 'batchFile',
      width: 150,
    },
    {
      title: '非标准文件目录',
      dataIndex: 'batchUnFile',
      width: 150,
    },
    {
      title: '预处理状态',
      dataIndex: 'batchProcessState',
      width: 150,
      customRender: ({ text, record }) => {
        let name = ''
        switch (text){
          case '0' :
            name = '不需要预处理'
            break;
          case '1' :
            name = '需要预处理'
            break;
          case '2' :
            name = '预处理成功'
            break;
          case '3' :
            name = '预处理失败'
            break;
        }
        return name
      }
    },
    {
      title: '数据处理状态',
      dataIndex: 'batchTreatmentState',
      width: 150,
      customRender: ({ text, record }) => {
        let name = ''
        switch (text){
          case '0' :
            name = '未处理'
            break;
          case '1' :
            name = '数据处理成功'
            break;
          case '2' :
            name = '数据处理失败'
            break;
          case '3' :
            name = '未处理'
            break;
        }
        return name
      }
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'QueryDetails',
      fixed: 'right',
    },
  ];
}

export const BatchQueryData = [
  {
    PCBH:'批次名称1',
    XMMC:'项目名称1',
    SCRQ:'2023-11-8',
    SJB:'数据表1',
    YCLZT:'需要预处理',
    SJCLZT:'未处理',
    PCZT:'未处理',
  },
  {
    PCBH:'批次名称2',
    XMMC:'项目名称2',
    SCRQ:'2023-11-7',
    SJB:'数据表2',
    YCLZT:'不需要预处理',
    SJCLZT:'未处理',
    PCZT:'已预处理',
  },
  {
    PCBH:'批次名称1',
    XMMC:'项目名称2',
    SCRQ:'2023-11-6',
    SJB:'数据表3',
    YCLZT:'预处理错误',
    SJCLZT:'数据处理出错',
    PCZT:'已处理',
  },
  {
    PCBH:'批次名称2',
    XMMC:'项目名称1',
    SCRQ:'2023-11-5',
    SJB:'数据表4',
    YCLZT:'预处理成功',
    SJCLZT:'数据处理成功',
    PCZT:'已立案',
  },
]

export function BorrowerDetailsSchema(): FormSchema[] {
  return [
    {
      field: 'JKRXM',
      component: 'Input',
      label: '借款人姓名',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入借款人姓名',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'JKRXB',
      component: 'Select',
      label: '借款人性别',
      required: true,
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择借款人性别',
          options: [
            {
              label: '男',
              value: '男',
            },
            {
              label: '女',
              value: '女',
            },
          ],
        }
      }
    },
    {
      field: 'JKRXB',
      component: 'Input',
      label: '身份证地址',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入借身份证地址',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}

export function BorrowerDetailsColumns(): BasicColumn[] {
  return [
    {
      title: '借款人姓名',
      dataIndex: 'JKRXM',
      width: 200,
    },
    {
      title: '借款人性别',
      width: 150,
      dataIndex: 'JKRXB',
    },
    {
      title: '借款人身份证好',
      dataIndex: 'SFZH',
      width: 150,
    },
    {
      title: '借款人手机号',
      dataIndex: 'SJH',
      width: 150,
    },
    {
      title: '身份证地址',
      dataIndex: 'SFZDZ',
      width: 150,
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Details',
      fixed: 'right',
    },
  ];
}

export const BorrowerDetailsData = [
  {
    JKRXM:'张三',
    JKRXB:'男',
    SFZH:'125683198403182572',
    SJH:'15426389547',
    SFZDZ:'北京昌平区',
  },
  {
    JKRXM:'李四',
    JKRXB:'男',
    SFZH:'147852199402153652',
    SJH:'12452369874',
    SFZDZ:'北京丰台区',
  },
  {
    JKRXM:'王五',
    JKRXB:'男',
    SFZH:'175236199102170354',
    SJH:'14785236974',
    SFZDZ:'北京石景山区',
  },
  {
    JKRXM:'赵六',
    JKRXB:'女',
    SFZH:'153698198611144521',
    SJH:'17815236875',
    SFZDZ:'北京西城区',
  },
  {
    JKRXM:'孙七',
    JKRXB:'女',
    SFZH:'147635199903282475',
    SJH:'13947862547',
    SFZDZ:'北京东城区',
  },
]

export function RepaymentForm(BatchInfo): FormSchema[] {
  return [
    {
      field: 'repaymentName',
      component: 'Input',
      label: '还款计划表配置名称',
      labelWidth:130,
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入配置名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'repaymentSqlname',
      component: 'Input',
      label: '数据库库表编码',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        var dates = new Date();
        var times = dates.getTime();
        formModel.repaymentSqlname = 'repayment'+times+JSON.stringify(Math.floor(Math.random() * 900 + 100))
        return {
          disabled:true
        }
      }
    },
    {
      field: 'batchId',
      component: 'Select',
      label: '批次名称',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择批次名称',
          options: BatchInfo.value
        }
      }
    },
  ];
}
export function RepaymentSchema(): FormSchema[] {
  return [
    {
      field: 'repaymentName',
      component: 'Input',
      label: '还款计划表配置名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入还款计划表配置名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'batchName',
      component: 'Input',
      label: '批次名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入批次名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}

export function RepaymentColumns(): BasicColumn[] {
  return [
    {
      title: '还款计划表配置名称',
      dataIndex: 'repaymentName',
      width: 200,
    },
    {
      title: '数据库库表编码',
      dataIndex: 'repaymentSqlname',
      width: 200,
    },
    {
      title: '项目名称',
      dataIndex: 'batchName',
      width: 200,
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Repayment',
      fixed: 'right',
    },
  ];
}

export const RepaymentData = [
  {
    HKJHBM:'还款计划表配置',
    XMMC:'项目名称1',
    CJRQ:'2023-11-09',
    fieldsList:[],
  },
]

export function ConfigurForm(BatchInfo): FormSchema[] {
  return [
    {
      field: 'datasheetName',
      component: 'Input',
      label: '数据表配置名称',
      required: true,
      colProps: {
        span: 12,

      },
      componentProps: {
        placeholder: '请输入配置名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'datasheetSqlname',
      component: 'Input',
      label: '数据库库表编码',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        var dates = new Date();
        var times = dates.getTime();
        formModel.datasheetSqlname = 'datasheet'+times+JSON.stringify(Math.floor(Math.random() * 900 + 100))
        return {
          disabled:true
        }
      }
    },
    {
      field: 'batchId',
      component: 'Select',
      label: '批次名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择批次名称',
          options: BatchInfo.value
        }
      }
    },
  ];
}
export function ConfigurSchema(): FormSchema[] {
  return [
    {
      field: 'datasheetName',
      component: 'Input',
      label: '配置名称查询',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入数据表名',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'batchName',
      component: 'Input',
      label: '批次名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}

export function ConfigurColumns(): BasicColumn[] {
  return [
    {
      title: '数据表配置名称',
      dataIndex: 'datasheetName',
      width: 200,
    },
    {
      title: '数据库库表编码',
      dataIndex: 'datasheetSqlname',
      width: 200,
    },
    {
      title: '批次名称',
      dataIndex: 'batchName',
      width: 200,
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Repayment',
      fixed: 'right',
    },
  ];
}

export const ConfigurData = [
  {
    SJBM:'数据表配置',
    XMMC:'项目名称1',
    CJRQ:'2023-11-09',
    ConfigurList:[],
  },
]

export function FileTypeForm(): FormSchema[] {
  return [
    {
      field: 'XMMC',
      component: 'Select',
      label: '项目名称',
      colProps: {
        span: 8,
      },
      componentProps: {
        placeholder: '请选择项目名称',
        options: [
          {
            label: '项目名称1',
            value: '项目名称1',
          },
          {
            label: '项目名称2',
            value: '项目名称2',
          },
        ],
      },
    },
    {
      field: 'WJJLX',
      component: 'Input',
      label: '文件夹类型',
      colProps: {
        span: 8,
      },
      componentProps: {
        placeholder: '请输入文件夹类型',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}
export function FileTypeSchema(): FormSchema[] {
  return [
    {
      field: 'XMMC',
      component: 'Input',
      label: '项目名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'WJJLX',
      component: 'Input',
      label: '文件夹类型',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入文件夹类型',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}

export function FileTypeColumns(): BasicColumn[] {
  return [
    {
      title: '批次名称',
      dataIndex: 'XMMC',
      width: 200,
    },
    {
      title: '文件夹类型',
      dataIndex: 'WJJLX',
      width: 200,
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'CJRQ',
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Repayment',
      fixed: 'right',
    },
  ];
}

export const FileTypeData = [
  {
    XMMC:'项目名称1',
    WJJLX:'文件夹类型1',
    CJRQ:'2023-11-10',
  },
  {
    XMMC:'项目名称2',
    WJJLX:'文件夹类型2',
    CJRQ:'2023-11-10',
  },
]

export const loitSeleniumData = [
  {
    dispositionName:'orderId',
    dispositionType:'varchar',
    dispositionRemark:'订单号码',
    dispositionLength:'255',
    isQuery:'1'
  },
  {
    dispositionName:'LendingBank',
    dispositionType:'varchar',
    dispositionRemark:'放款银行',
    dispositionLength:'255',
    isQuery:'1'
  },
  {
    dispositionName:'LoanAmount',
    dispositionType:'decimal',
    dispositionRemark:'借款金额',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'LoanTerm',
    dispositionType:'varchar',
    dispositionRemark:'期数',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'InterestRate',
    dispositionType:'varchar',
    dispositionRemark:'借款合同利率',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'LoanTime',
    dispositionType:'datetime',
    dispositionRemark:'借款时间',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'defaultTime',
    dispositionType:'datetime',
    dispositionRemark:'罚息截止日期',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'makeloanTime',
    dispositionType:'datetime',
    dispositionRemark:'放款时间',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'name',
    dispositionType:'varchar',
    dispositionRemark:'借款人姓名',
    dispositionLength:'255',
    isQuery:'1'
  },
  {
    dispositionName:'sex',
    dispositionType:'varchar',
    dispositionRemark:'借款人性别',
    dispositionLength:'255',
    isQuery:'1'
  },
  {
    dispositionName:'nation',
    dispositionType:'varchar',
    dispositionRemark:'借款人民族',
    dispositionLength:'255',
    isQuery:'1'
  },
  {
    dispositionName:'identityId',
    dispositionType:'varchar',
    dispositionRemark:'借款人身份证号',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'phone',
    dispositionType:'varchar',
    dispositionRemark:'借款人手机号',
    dispositionLength:'255',
    isQuery:'1'
  },
  {
    dispositionName:'contactAddress',
    dispositionType:'varchar',
    dispositionRemark:'身份证地址',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'addressService',
    dispositionType:'varchar',
    dispositionRemark:'管辖通知送达地址',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'Currentdebt',
    dispositionType:'decimal',
    dispositionRemark:'当前尚欠本金',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'compensatoryTime1',
    dispositionType:'datetime',
    dispositionRemark:'罚息开始日期',
    dispositionLength:'255',
    isQuery:'2'
  },
  {
    dispositionName:'compensatoryTime2',
    dispositionType:'datetime',
    dispositionRemark:'被告开始违约日期',
    dispositionLength:'255',
    isQuery:'2'
  },
]

export const loitSeleniumRepaymentData = [
  {
    dispositionName:'orderId',
    dispositionType:'varchar',
    dispositionRemark:'订单号',
    dispositionLength:'255',
  },
]

export function EnterpriseSchema(): FormSchema[] {
  return [
    {
      field: 'enterpriseName',
      component: 'Input',
      label: '企业名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
    },
    {
      field: 'enterpriseCode',
      labelWidth:130,
      component: 'Input',
      label: '统一社会信用代码',
      colProps: {
        span: 6,
      },
    },
    {
      field: 'enterpriseRepname',
      labelWidth:130,
      component: 'Input',
      label: '法定代表人',
      colProps: {
        span: 6,
      },
    },
    {
      field: 'bankName',
      labelWidth:130,
      component: 'Input',
      label: '开户银行',
      colProps: {
        span: 6,
      },
    },
    {
      field: 'enterpriseStats',
      component: 'Select',
      label: '起诉模式',
      labelWidth:130,
      colProps: {
        span: 6,
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
        }
      }
    },
  ];
}

export function EnterpriseColumns(): BasicColumn[] {
  return [
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      width: 200,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'enterpriseCode',
      width: 200,
    },
    {
      title: '法定代表人',
      dataIndex: 'enterpriseRepname',
      width: 200,
    },
    {
      title: '起诉模式',
      dataIndex: 'enterpriseStats',
      width: 150,
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
    },
    {
      title: '开户银行',
      width: 150,
      dataIndex: 'bankName',
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Enterprise',
      fixed: 'right',
    },
  ];
}

export function EnterpriseForm(): FormSchema[] {
  return [
    {
      field: 'enterpriseName',
      component: 'Input',
      label: '企业名称',
      labelWidth:130,
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'enterpriseCode',
      component: 'Input',
      label: '统一社会信用代码',
      labelWidth:130,
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'enterpriseStats',
      component: 'Select',
      label: '起诉模式',
      labelWidth:130,
      required: true,
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
        }
      }
    },
    {
      field: 'enterpriseRepname',
      component: 'Input',
      label: '法定代表人',
      labelWidth:130,
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'bankName',
      component: 'Input',
      label: '开户银行',
      labelWidth:130,
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'bankCode',
      component: 'Input',
      label: '银行卡号',
      labelWidth:130,
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'enterpriseAddress',
      component: 'InputTextArea',
      label: '企业地址',
      labelWidth:130,
      required: true,
      componentProps: ({formModel}) => {
        return {
          placeholder: '请输入',
          allowClear: true,
          showCount: true,
        }
      },
    },
    {
      field: 'other',
      component: 'InputTextArea',
      label: '其他',
      labelWidth:130,
      componentProps: ({formModel}) => {
        return {
          placeholder: '请输入',
          allowClear: true,
          showCount: true,
        }
      },
    },
    {
      field: 'business',
      component: 'JUpload',
      label: '企业的营业执照',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps:  ({formModel}) => {
        return {
          text: '请上传企业的营业执照',
          download: true,
          data:{
          }
        }
      },
    },
    {
      field: 'enterpriseRepprove',
      component: 'JUpload',
      label: '法律代表人证明',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps:  ({formModel}) => {
        return {
          text: '请上传法律代表人证明',
          download: true,
          data:{
          }
        }
      },
    },
    {
      field: 'idImg',
      component: 'JUpload',
      label: '身份证照片',
      required: true,
      labelWidth:130,
      colProps: {
        span: 12,
      },
      componentProps:  ({formModel}) => {
        return {
          text: '请上传身份证照片',
          download: true,
          data:{
          }
        }
      },
    },
  ];
}

export function SetAllocationSchema(): FormSchema[] {
  return [
    {
      field: 'zipName',
      component: 'Input',
      label: '公共资料名称',
      labelWidth:130,
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入项目名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}

export function SetAllocationForm(): FormSchema[] {
  return [
    {
      field: 'zipName',
      component: 'Input',
      label: '公共资料名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder: '请输入公共资料名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
  ];
}

export function SetAllocationColumns(): BasicColumn[] {
  return [
    {
      title: '公共资料名称',
      dataIndex: 'zipName',
      width: 200,
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'Allocation',
      fixed: 'right',
    },
  ];
}

export function UnfileSchema(loitSeleniumDisposition): FormSchema[] {
  return [
    {
      field: 'fileName',
      component: 'Select',
      label: '标准文件夹命名方式',
      labelWidth:140,
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择标准文件夹命名方式',
          options: loitSeleniumDisposition,
        }
      }
    },
  ];
}



