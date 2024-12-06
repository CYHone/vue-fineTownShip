// utils/url-utils.js

// 定义基础 URL
export const BASE_URL = "http://127.0.0.1:8080/";

/**
 * 拼接完整的图片 URL
 * @param {string} fileName 图片文件名
 * @returns {string} 完整的图片 URL
 */
export const getImageUrl = (fileName) => {
  return `${BASE_URL}${fileName}`;
};
