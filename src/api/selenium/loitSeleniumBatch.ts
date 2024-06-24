import { XHttp,JsonHttp } from '/@/utils/http/axios';

enum Api {
  loitSeleniumhandleFile = '/project/loitSeleniumBatch/handleFile',
  loitSeleniumgetAttachmentList = '/project/loitSeleniumBatch/getAttachmentList',
  loitSeleniumbackAndDownload = '/project/loitSeleniumBatch/backAndDownload',
}
//预处理
export const getHandleFile = (params) => {
  return XHttp.post({ url: Api.loitSeleniumhandleFile, params });
};
//附件列表
export const getAttachmentList = (params) => {
  return XHttp.post({ url: Api.loitSeleniumgetAttachmentList, params });
};
//导出下载打包
export const getbackAndDownload = (params) => {
  return XHttp.post({ url: Api.loitSeleniumbackAndDownload, params });
};
