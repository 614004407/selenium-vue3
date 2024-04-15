import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumDatasheetList = '/project/loitSeleniumDatasheet/list',
  loitSeleniumDatasheetAdd = '/project/loitSeleniumDatasheet/add',
  loitSeleniumDatasheetEdit = '/project/loitSeleniumDatasheet/edit',
  loitSeleniumDatasheetDelete = '/project/loitSeleniumDatasheet/delete',
}
//获取列表
export const getDatasheetList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumDatasheetList, params });
};
//添加
export const getDatasheetAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumDatasheetAdd, params });
};
//修改
export const getDatasheetEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumDatasheetEdit, params });
};
//删除
export const getDatasheetDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumDatasheetDelete, params });
};
