import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumRepaymentList = '/project/loitSeleniumRepayment/list',
  loitSeleniumRepaymentAdd = '/project/loitSeleniumRepayment/add',
  loitSeleniumRepaymentEdit = '/project/loitSeleniumRepayment/edit',
  loitSeleniumRepaymentDelete = '/project/loitSeleniumRepayment/delete',
}
//获取列表
export const getRepaymentList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumRepaymentList, params });
};
//添加
export const getRepaymentAdd = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumRepaymentAdd, params });
};
//修改
export const getRepaymentEdit = (params) => {
  return JsonHttp.post({ url: Api.loitSeleniumRepaymentEdit, params });
};
//删除
export const getRepaymentDelete = (params) => {
  return XHttp.delete({ url: Api.loitSeleniumRepaymentDelete, params });
};
