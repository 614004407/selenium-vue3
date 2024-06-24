import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumEnterpriseList = '/project/loitSeleniumEnterprise/list',
  loitSeleniumEnterpriseAdd = '/project/loitSeleniumEnterprise/add',
  loitSeleniumEnterpriseEdit = '/project/loitSeleniumEnterprise/edit',
  loitSeleniumEnterpriseDelete = '/project/loitSeleniumEnterprise/delete',
  loitSeleniumEnterpriseEnterpriselist = '/project/loitSeleniumEnterprise/Enterpriselist',
  loitSeleniumEnterpriseidquery = '/project/loitSeleniumEnterprise/idquery',
}
//获取列表
export const getEnterpriseList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumEnterpriseList, params });
};
//添加
export const getEnterpriseAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumEnterpriseAdd, params });
};
//修改
export const getEnterpriseEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumEnterpriseEdit, params });
};
//删除
export const getEnterpriseDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumEnterpriseDelete, params });
};
//字典表
export const getEnterpriseEnterpriselist = (params) => {
  return XHttp.post({ url: Api.loitSeleniumEnterpriseEnterpriselist, params });
};
//企业id查询
export const getEnterpriseidquery = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumEnterpriseidquery, params });
};
