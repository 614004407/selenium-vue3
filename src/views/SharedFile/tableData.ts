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

//去除空字段
export function removeProperty(obj) {
  Object.keys(obj).forEach(item => {
    if (obj[item] === '' || obj[item] === [] || obj[item] === {} || obj[item] === undefined || obj[item] === null || obj[item] === 'null') delete obj[item]
  })
  return obj
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

export function SetProjectSchema(): FormSchema[] {
  return [
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
      field: 'projectSource',
      component: 'Input',
      label: '项目来源',
      colProps: {
        span: 6,
      },
    },
    {
      field: 'fileType',
      component: 'Select',
      label: '文件夹类型',
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
  ];
}

export function SetProjectForm(): FormSchema[] {
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
      label: '项目来源',
      required: true,
      colProps: {
        span: 12,
      },
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
          formModel.projectCatalogue = "d:\\data\\" + formModel.projectName
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

export function SetProjectColumns(): BasicColumn[] {
  return [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 200,
    },
    {
      title: '项目来源',
      width: 150,
      dataIndex: 'projectSource',
    },
    {
      title: '文件夹类型',
      dataIndex: 'fileType',
      width: 150,
    },
    {
      title: '项目根目录',
      dataIndex: 'projectCatalogue',
      width: 150,
    },
    {
      title: '项目描述',
      dataIndex: 'projectDescription',
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

export function BuildBatchSchema(): FormSchema[] {
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
      field: 'projectId',
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
  ];
}

export function BuildBatchForm(ProjectDictionary): FormSchema[] {
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
          options: ProjectDictionary.value
        }
      }
    },
    {
      field: 'batchTable',
      component: 'JUpload',
      label: '数据表上传',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          text: '请上传数据表',
          maxCount: 1,
          download: true,
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
        }
      },
    },
    {
      field: 'batchCompress',
      component: 'JUpload',
      label: '批次文件上传',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          text: '请上传批次文件',
          maxCount: 0,
          download: true,
        }
      },
    },
    {
      field: 'batchNum',
      component: 'InputNumber',
      label: '批次数量',
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
  ];
}

export function BuildBatchColumns(): BasicColumn[] {
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
      title: '数据表',
      dataIndex: 'batchTable',
      width: 150,
    },
    {
      title: '还款计划表',
      dataIndex: 'batchRefund',
      width: 150,
    },
    {
      title: '打包压缩文件',
      dataIndex: 'batchCompress',
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

export function BatchQuerySchema(): FormSchema[] {
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

export function BatchQueryColumns(): BasicColumn[] {
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
      title: '数据表',
      dataIndex: 'batchTable',
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
      field: 'batchId',
      component: 'Select',
      label: '批次名称',
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
      field: 'batchId',
      component: 'Select',
      label: '批次名称',
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

