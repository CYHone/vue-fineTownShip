<template>
  
      <div class="content-container">
        <!-- 轮播图容器 -->
        <div class="carousel-container">
          <!-- 轮播图内容 -->
          <div class="block text-center">
            <!-- 轮播图组件 -->
            <el-carousel height="600px" :interval="2000">
              <el-carousel-item v-for="(item, index) in imageList" :key="index">
                <!-- 图片 -->
                <img :src="item.src" :alt="'Slide ' + index" class="carousel-image" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        
        <!-- 日历容器 -->
        <div class="calendar-container">
          <el-calendar>
            <template #date-cell="{ data }">
              <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(1).join('-') }}
                {{ data.isSelected ? '✔️' : '' }}
              </p>
            </template>
          </el-calendar>
        </div>
      </div>
  
</template>

<script setup>

import carouselImg1 from '@/assets/img/carousel1.jpg';
import carouselImg2 from '@/assets/img/carousel2.jpg';
import carouselImg3 from '@/assets/img/carousel3.jpg';

const imageList = [
 
  { src: carouselImg1 },
  { src: carouselImg2 },
  { src: carouselImg3 },
  // Add more images as needed
];
</script>

<style scoped>
.content-container {
  background-color: #f2f2f2; /* Light gray background */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  padding: 5px;
}

.carousel-container {
  width: 60%;
  height: 600px;
}

.calendar-container {
  width: 35%;
  margin-left: 20px;
}

/* 轮播图图片样式 */
.carousel-image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.is-selected {
  color: #1989fa;
}
</style>
