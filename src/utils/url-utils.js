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

/**
 * 根据文件名获取文件的完整 URL（支持图片和视频）
 * @param {string} fileName 文件名
 * @returns {string} 文件的完整 URL
 */
export const getFileUrl = (fileName) => {
  const fileExtension = fileName.split('.').pop().toLowerCase();

  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  const videoFormats = ['mp4', 'avi', 'mov'];

  // 如果是图片格式
  if (imageFormats.includes(fileExtension)) {
    return getImageUrl(fileName);  // 返回图片的 URL
  }
  
  // 如果是视频格式
  if (videoFormats.includes(fileExtension)) {
    return `${BASE_URL}${fileName}`;  // 返回视频的 URL
  }

  return ''; // 如果是其他格式，返回空字符串或其他处理
};
