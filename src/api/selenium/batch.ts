import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumBatchList = '/project/loitSeleniumBatch/list',
  loitSeleniumBatchAdd = '/project/loitSeleniumBatch/add',
  loitSeleniumBatchEdit = '/project/loitSeleniumBatch/edit',
  loitSeleniumBatchDelete = '/project/loitSeleniumBatch/delete',
  loitSeleniumBatchdispositionInfo = '/project/loitSeleniumBatch/dispositionInfo',
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
export const getBatchInfo = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumBatchdispositionInfo, params });
};
