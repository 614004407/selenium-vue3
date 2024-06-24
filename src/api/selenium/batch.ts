import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumBatchList = '/project/loitSeleniumBatch/list',
  loitSeleniumBatchAdd = '/project/loitSeleniumBatch/add',
  loitSeleniumBatchEdit = '/project/loitSeleniumBatch/edit',
  loitSeleniumBatchDelete = '/project/loitSeleniumBatch/delete',
  loitSeleniumBatchdispositionDatasheetInfo = '/project/loitSeleniumBatch/dispositionDatasheetInfo',
  loitSeleniumBatchdispositionRepaymentInfo = '/project/loitSeleniumBatch/dispositionRepaymentInfo',
  loitSeleniumBatchprocessing = '/project/loitSeleniumBatch/processing',
  loitSeleniumBatchcolumnslist = '/project/loitSeleniumBatch/columnslist',
  loitSeleniumBatchtablelist = '/project/loitSeleniumBatch/tablelist',
  loitSeleniumBatchtablelistupdate = '/project/loitSeleniumBatch/tablelistupdate',
  loitSeleniumBatchtablerepaymentlist = '/project/loitSeleniumBatch/repaymentlist',
  loitSeleniumBatchtablerepaymentSchema = '/project/loitSeleniumBatch/repaymentSchema',
  loitSeleniumBatchexportlist = '/project/loitSeleniumBatch/exportlist',
  loitSeleniumBatchdeleteFile = '/project/loitSeleniumBatch/deleteFile',
  loitSeleniumBatchtableedit = '/project/loitSeleniumBatch/tableedit',

}
//获取列表
export const getBatchList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchList, params });
};
//添加
export const getBatchAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumBatchAdd, params });
};
//修改
export const getBatchEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumBatchEdit, params });
};
//删除
export const getBatchDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumBatchDelete, params });
};
//获取字典表
export const getBatchDatasheetInfo = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumBatchdispositionDatasheetInfo, params });
};
export const getBatchRepaymentInfo = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumBatchdispositionRepaymentInfo, params });
};
//动态建立数据库+数据处理
export const getBatchProcessing = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchprocessing, params });
};
//获取动态表格列信息
export const getBatchColumnslist = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchcolumnslist, params });
};
//获取动态表数据
export const getBatchTablelist = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchtablelist, params });
};
//动态表查询数据
export const getBatchTablelistupdate = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchtablelistupdate, params });
};
//动态查询还款计划表
export const getBatchRepaymentlist = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchtablerepaymentlist, params });
};
//动态查询还款计划表头
export const getBatchRepaymentSchema = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchtablerepaymentSchema, params });
};
//动态导出
export const getBatchexportlist = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchexportlist, params });
};
//删除民事诉讼状
export const getdeleteFile = (params) => {
  return XHttp.post({ url: Api.loitSeleniumBatchdeleteFile, params });
};
//借款人明细配置
export const gettableedit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumBatchtableedit, params });
};
