import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumProjectList = '/project/loitSeleniumProject/list',
  loitSeleniumProjectAdd = '/project/loitSeleniumProject/add',
  loitSeleniumProjectEdit = '/project/loitSeleniumProject/edit',
  loitSeleniumProjectDelete = '/project/loitSeleniumProject/delete',
  loitSeleniumProjectDictionary = '/project/loitSeleniumProject/dictionary',
  loitSeleniumProjectIDQuery = '/project/loitSeleniumProject/IDQuery',
}
//获取列表
export const getProjectList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumProjectList, params });
};
//添加
export const getProjectAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumProjectAdd, params });
};
//修改
export const getProjectEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumProjectEdit, params });
};
//删除
export const getProjectDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumProjectDelete, params });
};
//项目字典表
export const getProjectDictionary = (params) => {
  return XHttp.post({ url: Api.loitSeleniumProjectDictionary, params });
};
//通过ID查项目
export const getProjectIDQuery = (params) => {
  return XHttp.post({ url: Api.loitSeleniumProjectIDQuery, params });
};
