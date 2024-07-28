<template>
  <div id="app">
    <china-map ref="chinaMapComponent" :key="key" cascade :echartsData="echartsData" :scatterData="scatterData" @mapClick="mapClick" />
    <div  v-show="imageSrc&&showChengdu"
    style="position: absolute; bottom: 10%; left: 80px; height: 300px; color: #ffffff; background-color: rgba(108, 5, 243, 0);" @click="showModal">
    <div style="font: bolder 2em Microsoft YaHei, sans-serif;height:30px;font-size: 20px; left:30px">成 都</div>
    <div id="slideshow" style="height: inherit; right: 10px; opacity: 0.7; border-radius: 20px;"></div>
  </div>

  <div v-if="isModalVisible" class="modal">
    <img :src="modalImage" alt="Expanded Image" class="modal-content" />
    <button @click="prevImage" class="nav-button prev">◁</button>
    <button @click="nextImage" class="nav-button next">▷</button>
    <button @click="hideModal" class="close-button">×</button>
    <div class="image-counter">{{ largeImg[1] + 1 }}/{{ totalImages[largeImg[0]] }}</div>
  </div>

  <div  v-show="imageSrc&&showTianjin"
    style="position: absolute; top: 40%; right: 80px; height: 300px; color: #ffffff; background-color: rgba(108, 5, 243, 0);" @click="showModal2">
    <div class="text-right"
      style="right:50px;font: bolder 2em Microsoft YaHei, sans-serif;height:30px;font-size: 20px; ">天 津</div>
    <div id="slideshow2" style="height: inherit;  opacity: 0.7; border-radius: 20px;"></div>
  </div>
  <div  v-show="imageSrc&&showXian"
    style="position: absolute; top: 10%; left: 12%; height: 200px; color: #ffffff; background-color: rgba(108, 5, 243, 0);" @click="showModal3">
    <div style="font: bolder 2em Microsoft YaHei, sans-serif;height:30px;font-size: 20px; left:30px">西 安</div>
    <div id="slideshow3" style="height: inherit; left:0%; opacity: 0.7; border-radius: 20px;"></div>
  </div>


  </div>

</template>

<script>
import chinaMap from "./components/chinaMap.vue";

export default {
  name: "App",
  components: {
    chinaMap,
  },
  data() {
    return {
      imageFolder: ['img/tour/chengdu/', 'img/tour/tianjin/', 'img/tour/xian/'],
      totalImages: [72, 44, 41],
      currentImage: [0, 0, 0],
      currentSrc: [[], [], []],
      largeImg: [0, 0],
      key: 0,
      musicSrc: require('/music/music.mp3'),
      activeIndex: 0,
      imageSrc: true, // 确保这个条件为真，展示image-container
      isModalVisible: false,
      modalImage: '',
      showXian: true,
      showChengdu: true,
      showTianjin: true,
      testData: [
        {
          name: "天津市",
          value: 1,
          tag: 0,
        },
        {
          name: "陕西省",
          value: 1,
          tag: 0,
        },
        {
          name: "西安市",
          value: 1,
          tag: 1,
        },
        {
          name: "四川省",
          value: 1,
          tag: 0,
        },
        {
          name: "成都市",
          value: 1,
          tag: 1,
        },
        {
          name: "眉山市",
          value: 1,
          tag: 1,
        },
      ],
      scatterData: [
        { name: '成都', value: [104.065735, 30.659462, '成都'], tag: 1, src: "require('../img/bg/bg.jpg')"},
        { name: '眉山', value: [103.831788, 30.048318, '眉山'], tag: 1, src: "require('../img/bg/bg.jpg')"},
        { name: '西安', value: [108.948024, 34.263161, '西安'], tag: 1, src: "require('../img/bg/bg.jpg')"},
        { name: '天津', value: [117.382549, 38.989577, '天津'], tag: 1, src: "require('../img/bg/bg.jpg')"},
      ],
    };
  },
  created() {/*用于染色地图块*/
    this.echartsData = this.testData.map(({ name, value, tag }) => {
      return {
        name: this.getCityName(name, tag),
        value
      }
    })
  },
  mounted() {
    const playButton = document.getElementById('play-music-button');
    const backgroundMusic = document.getElementById('background-music');

    playButton.addEventListener('click', () => {
      if (backgroundMusic) {
        backgroundMusic.play().catch((error) => {
          console.log('Playback prevented:', error);
        });
      }
    });
    this.createMeteors();
    this.initializeSlideshow();
    this.initializeSlideshow2();
    this.initializeSlideshow3();
  },



  methods: {
    mapClick({ code, name }) {
      console.log(name);
      const chinaMapInstance = this.$refs.chinaMapComponent;
      console.log(chinaMapInstance.currentMapName);
      if(chinaMapInstance.currentMapName==='china'){
        this.showXian = true;
        this.showChengdu = true;
        this.showTianjin = true;
      }else if(chinaMapInstance.currentMapName==='sichuan'){
        console.log(chinaMapInstance.currentMapName);
        this.showXian = false;
        this.showTianjin = false;
        console.log(this.showXian);
        console.log(this.imageSrc&&this.showXian);
      }else if(chinaMapInstance.currentMapName==='tianjin'){
        this.showXian = false;
        this.showChengdu = false;
      }else if(chinaMapInstance.currentMapName==='shanxi'){
        this.showChengdu = false;
        this.showTianjin = false;
      }else{
        this.showChengdu = false;
        this.showTianjin = false;
        this.showXian = false;
      }
    },
    /**
     *@description 这个方法用来获取城市的简称，例如 北京市 => 北京。 内蒙古自治区 => 内蒙古
    */
    getCityName(cityName, tag) {
      if (!cityName) return;
      if (tag) {
        return cityName;
      }
      let isAutonomy = cityName.search("自治区") != -1;
      if (isAutonomy) {
        return cityName.search("内") != -1
          ? cityName.substr(0, 3)
          : cityName.substr(0, 2);
      } else {
        return cityName.match(/(\S*)(省|市|特别行政区)/)
          ? cityName.match(/(\S*)(省|市|特别行政区)/)[1]
          : cityName;
      }
      // console.log('list2', this.list)
    },
    createMeteors() {
      const meteorContainer = document.getElementById('meteors');
      const numberOfMeteors = 100; // 增加流星数量
      for (let i = 0; i < numberOfMeteors; i++) {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');

        // 随机位置和动画延迟
        const startPos = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;

        // 随机选择从顶部或左侧出现
        if (Math.random() < 0.5) {
          meteor.style.top = '-' + Math.random() * 10 + 'vh';
          meteor.style.left = startPos + 'vw';
        } else {
          meteor.style.top = startPos + 'vh';
          meteor.style.left = '-' + Math.random() * 10 + 'vw';
        }

        meteor.style.animationDuration = duration + 's';
        meteor.style.animationDelay = delay + 's';
        meteorContainer.appendChild(meteor);

      }
    },
    initializeSlideshow() {
      const slideshow = document.getElementById('slideshow');

      for (let i = 1; i <= this.totalImages[0]; i++) {
        const img = document.createElement('img');
        img.src = `${this.imageFolder[0]}${i}.jpg`;
        this.currentSrc[0].push(img.src);
        if (i === 1) {
          img.classList.add('active');
        }
        slideshow.appendChild(img);
      }

      const images = document.querySelectorAll('#slideshow img');

      const showNextImage = () => {
        images[this.currentImage[0]].classList.remove('active');
        this.currentImage[0] = (this.currentImage[0] + 1) % this.totalImages[0];
        images[this.currentImage[0]].classList.add('active');
      };

      setInterval(showNextImage, 3000); // 每3秒切换一次图片
    },
    initializeSlideshow2() {
      const slideshow2 = document.getElementById('slideshow2');

      for (let j = 1; j <= this.totalImages[1]; j++) {
        const img2 = document.createElement('img');
        img2.src = `${this.imageFolder[1]}${j}.jpg`;
        this.currentSrc[1].push(img2.src);
        if (j === 1) {
          img2.classList.add('active');
        }
        slideshow2.appendChild(img2);
      }

      const images2 = document.querySelectorAll('#slideshow2 img');

      const showNextImage2 = () => {
        images2[this.currentImage[1]].classList.remove('active');
        this.currentImage[1] = (this.currentImage[1] + 1) % this.totalImages[1];
        images2[this.currentImage[1]].classList.add('active');
      };

      setInterval(showNextImage2, 3000); // 每3秒切换一次图片
    },
    initializeSlideshow3() {
      const slideshow3 = document.getElementById('slideshow3');

      for (let k = 1; k <= this.totalImages[2]; k++) {
        const img3 = document.createElement('img');
        img3.src = `${this.imageFolder[2]}${k}.jpg`;
        this.currentSrc[2].push(img3.src);
        if (k === 1) {
          img3.classList.add('active');
        }
        slideshow3.appendChild(img3);
      }

      const images3 = document.querySelectorAll('#slideshow3 img');

      const showNextImage3 = () => {
        images3[this.currentImage[2]].classList.remove('active');
        this.currentImage[2] = (this.currentImage[2] + 1) % this.totalImages[2];
        images3[this.currentImage[2]].classList.add('active');
      };

      setInterval(showNextImage3, 3000); // 每3秒切换一次图片
    },
    showModal() {
      this.isModalVisible = true;
      this.imageSrc = false;
      this.modalImage = this.currentSrc[0][this.currentImage[0]]; // 当前显示的图片
      this.largeImg[0] = 0
      this.largeImg[1] = this.currentImage[0]
    },
    showModal2() {
      this.isModalVisible = true;
      this.imageSrc = false;
      this.modalImage = this.currentSrc[1][this.currentImage[1]]; // 当前显示的图片
      this.largeImg[0] = 1
      this.largeImg[1] = this.currentImage[1]
    },
    showModal3() {
      this.isModalVisible = true;
      this.imageSrc = false;
      this.modalImage = this.currentSrc[2][this.currentImage[2]]; // 当前显示的图片
      this.largeImg[0] = 2
      this.largeImg[1] = this.currentImage[2]
    },
    hideModal() {
      this.isModalVisible = false;
      this.imageSrc = true;
      this.modalImage = '';

    },
    nextImage() {
      this.largeImg[1] = (this.largeImg[1] + 1) % this.totalImages[this.largeImg[0]];
      this.modalImage = this.currentSrc[this.largeImg[0]][this.largeImg[1]];
    },
    prevImage() {
      this.largeImg[1] = (this.largeImg[1] - 1) % this.totalImages[this.largeImg[0]];
      this.modalImage = this.currentSrc[this.largeImg[0]][this.largeImg[1]];
    }

  }
};
</script>
<style>
#app {
  background-color: rgba(15, 30, 51, 0);
}

#meteors {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  /* background-color: rgba(15, 30, 51, 1); */
  background-image: url('../img/bg/bg.jpeg');
  background-size: cover;
  /* 确保图片覆盖整个背景 */
  background-position: center;
  /* 将背景图片居中 */
  background-repeat: no-repeat;
  /* 禁止背景图片重复 */
}

.meteor {
  position: absolute;
  width: 1px;
  height: 80px;
  background: linear-gradient(45deg, rgb(249, 223, 254), rgba(242, 252, 191, 0.1));
  animation: fall linear infinite;
}

@keyframes fall {
  from {
    transform: translateY(-100px) translateX(0) rotate(315deg);
  }

  to {
    transform: translateY(110vh) translateX(100vw) rotate(315deg);
  }
}
#slideshow, #slideshow2{
  position: relative;
  height: 600px;
  width: 400px;
  margin: auto;
  overflow: hidden;
  background-size: contain;
  border-radius: 20px;
  z-index: 1;
}
#slideshow3 {
  position: relative;
  height: 600px;
  width: 800px;
  margin: auto;
  overflow: hidden;
  background-size: contain;
  border-radius: 20px;
}
#slideshow img, #slideshow2 img, #slideshow3 img {
  
  height: 100%;
  width: auto;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 1s;
  border-radius: 20px;
}
#slideshow img.active, #slideshow2 img.active, #slideshow3 img.active {
  opacity: 1;
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 28px;
  border-radius: 50%; /* 使按钮变成圆形 */
  width: 50px; /* 按钮的宽度 */
  height: 50px; /* 按钮的高度 */
  color: rgb(54, 54, 54);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 30px;
  border-radius: 50%; /* 使按钮变成圆形 */
  width: 50px; /* 按钮的宽度 */
  height: 50px; /* 按钮的高度 */
  color: rgb(54, 54, 54);
}
.image-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 25px;
}
</style>
