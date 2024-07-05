import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumContractList = '/project/loitSeleniumContract/list',
  loitSeleniumContractAdd = '/project/loitSeleniumContract/add',
  loitSeleniumContractEdit = '/project/loitSeleniumContract/edit',
  loitSeleniumContractDelete = '/project/loitSeleniumContract/delete',
  loitSeleniumContractContractlist = '/project/loitSeleniumContract/Contractlist',
  loitSeleniumContractgetTransfer = '/project/loitSeleniumContract/getTransfer',
}
//获取列表
export const getContractList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumContractList, params });
};
//添加
export const getContractAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumContractAdd, params });
};
//修改
export const getContractEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumContractEdit, params });
};
//删除
export const getContractDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumContractDelete, params });
};
//字典表
export const getContractlist = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumContractContractlist, params });
};
//获取债权转让合同列表
export const getTransfer = (params) => {
  return XHttp.post({ url: Api.loitSeleniumContractgetTransfer, params });
};
