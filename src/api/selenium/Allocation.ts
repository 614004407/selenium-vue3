import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumZipList = '/project/loitSeleniumZip/list',
  loitSeleniumZipAdd = '/project/loitSeleniumZip/add',
  loitSeleniumZipEdit = '/project/loitSeleniumZip/edit',
  loitSeleniumZipDelete = '/project/loitSeleniumZip/delete',
  loitSeleniumZipDictionary = '/project/loitSeleniumZip/dictionary',
  loitSeleniumZipzipdownload = '/project/loitSeleniumZip/zipdownload',
}
//获取列表
export const getZipList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumZipList, params });
};
//添加
export const getZipAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumZipAdd, params });
};
//修改
export const getZipEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumZipEdit, params });
};
//删除
export const getZipDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumZipDelete, params });
};
//字典表
export const getZipDictionary = (params) => {
  return XHttp.post({ url: Api.loitSeleniumZipDictionary, params });
};
//打包下载
export const getzipdownload = (params) => {
  return XHttp.post({ url: Api.loitSeleniumZipzipdownload, params });
};
