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
      field: 'XMLY',
      component: 'Input',
      label: '项目来源',
      colProps: {
        span: 6,
      },
    },
    {
      field: 'WJLX',
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
      field: 'XMMC',
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
      field: 'XMLY',
      component: 'Input',
      label: '项目来源',
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'WJJLX',
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
      field: 'XMGML',
      component: 'Input',
      label: '项目根目录',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        if (formModel.XMMC) {
          formModel.XMGML = "d:\\data\\" + formModel.XMMC
        } else {
          formModel.XMGML = ''
        }
        return {
          disabled:true
        }
      },
    },
    {
      field: 'XMMS',
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
      dataIndex: 'XMMC',
      width: 200,
    },
    {
      title: '项目来源',
      width: 150,
      dataIndex: 'XMLY',
    },
    {
      title: '文件夹类型',
      dataIndex: 'WJJLX',
      width: 150,
    },
    {
      title: '项目根目录',
      dataIndex: 'XMGML',
      width: 150,
    },
    {
      title: '项目描述',
      dataIndex: 'XMMS',
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
      field: 'PCMC',
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
      field: 'XMMC',
      component: 'Select',
      label: '项目名称',
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择项目名称',
          options: [
            // {
            //   label: '女',
            //   value: '0',
            // },
          ],
        }
      }
    },
  ];
}

export function BuildBatchForm(): FormSchema[] {
  return [
    {
      field: 'PCMC',
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
      field: 'XMMC',
      component: 'Select',
      label: '项目名称',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
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
        }
      }
    },
    {
      field: 'SJB',
      component: 'JUpload',
      label: '数据表上传',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          text: '数据表上传',
          maxCount: 1,
          download: true,
        }
      },
    },
    {
      field: 'HKJHB',
      component: 'JUpload',
      label: '还款计划表上传',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: ({formModel}) => {
        return {
          text: '还款计划表上传',
          maxCount: 1,
          download: true,
        }
      },
    },
    {
      field: 'WJSC',
      component: 'JUpload',
      label: '批次文件上传',
      required: true,
      componentProps: ({formModel}) => {
        return {
          text: '批次文件上传',
          maxCount: 1,
          download: true,
        }
      },
    },
    {
      field: 'PCSL',
      component: 'InputNumber',
      label: '批次数量',
      required: true,
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
      dataIndex: 'PCMC',
      width: 200,
    },
    {
      title: '项目名称',
      width: 150,
      dataIndex: 'XMMC',
    },
    {
      title: '数据表',
      dataIndex: 'SJB',
      width: 150,
    },
    {
      title: '还款计划表',
      dataIndex: 'HKJHB',
      width: 150,
    },
    {
      title: '打包压缩文件',
      dataIndex: 'DBYSWJ',
      width: 150,
    },
    {
      title: '批次数量',
      dataIndex: 'PCSL',
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
      field: 'PCBH',
      component: 'Input',
      label: '批次编号',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入批次编号',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'XMMC',
      component: 'Input',
      label: '项目名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入批次编号',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
    {
      field: 'YCLZT',
      component: 'Select',
      label: '预处理状态',
      required: true,
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择预处理状态',
          options: [
            {
              label: '需要预处理',
              value: '需要预处理',
            },
            {
              label: '不需要预处理',
              value: '不需要预处理',
            },
            {
              label: '预处理错误',
              value: '预处理错误',
            },
            {
              label: '预处理成功',
              value: '预处理成功',
            },
          ],
        }
      }
    },
    {
      field: 'SJCLZT',
      component: 'Select',
      label: '数据处理状态',
      required: true,
      colProps: {
        span: 6,
      },
      componentProps: ({formModel}) => {
        return {
          placeholder: '请选择数据处理状态',
          options: [
            {
              label: '未处理',
              value: '未处理',
            },
            {
              label: '数据处理出错',
              value: '数据处理出错',
            },
            {
              label: '数据处理成功',
              value: '数据处理成功',
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
      title: '批次编号',
      dataIndex: 'PCBH',
      width: 200,
    },
    {
      title: '项目名称',
      width: 150,
      dataIndex: 'XMMC',
    },
    {
      title: '上传日期',
      dataIndex: 'SCRQ',
      width: 150,
    },
    {
      title: '数据表',
      dataIndex: 'SJB',
      width: 150,
    },
    {
      title: '预处理状态',
      dataIndex: 'YCLZT',
      width: 150,
    },
    {
      title: '数据处理状态',
      dataIndex: 'SJCLZT',
      width: 150,
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

export function RepaymentForm(): FormSchema[] {
  return [
    {
      field: 'HKJHBM',
      component: 'Input',
      label: '配置名称',
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
      field: 'XMMC',
      component: 'Input',
      label: '项目名称',
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
  ];
}
export function RepaymentSchema(): FormSchema[] {
  return [
    {
      field: 'HKJHBM',
      component: 'Input',
      label: '配置名称',
      colProps: {
        span: 6,
      },
      componentProps: {
        placeholder: '请输入配置名称',
        onChange: (e) => {
          console.log(e);
        },
      },
    },
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
  ];
}

export function RepaymentColumns(): BasicColumn[] {
  return [
    {
      title: '还款计划表配置名称',
      dataIndex: 'HKJHBM',
      width: 200,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
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

export const RepaymentData = [
  {
    HKJHBM:'还款计划表配置',
    XMMC:'项目名称1',
    CJRQ:'2023-11-09',
    fieldsList:[],
  },
]

export function ConfigurForm(): FormSchema[] {
  return [
    {
      field: 'SJBM',
      component: 'Input',
      label: '配置名称',
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
      field: 'XMMC',
      component: 'Input',
      label: '项目名称',
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
  ];
}
export function ConfigurSchema(): FormSchema[] {
  return [
    {
      field: 'SJBM',
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
  ];
}

export function ConfigurColumns(): BasicColumn[] {
  return [
    {
      title: '数据表配置名称',
      dataIndex: 'SJBM',
      width: 200,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
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
      title: '项目名称',
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
      dataIndex: 'Details',
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

