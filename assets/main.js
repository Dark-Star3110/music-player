const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const progress = $("#progress");
const ReloadBtn = $(".btn.btn-repeat");
const randomBtn = $(".btn.btn-random");

let rotate;
let loadProgress;

const app = {
  isPlaying: false,
  isRepeat: false,
  isRandom: false,
  currentIndex: 0,
  currentDeg: 0,
  speed: 0.4,
  songs: [
    {
      name: "Bạch Nguyệt Quang Và Nốt Chu Sa",
      singer: "Daitudazi",
      path: "./assets/mp3/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Bất Nhiễm",
      singer: "Mao Bất Dịch",
      path: "./assets/mp3/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Hồng Mã",
      singer: "Hứa Lam Tâm",
      path: "./assets/mp3/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Niên Tuế",
      singer: "Mao Bất Dịch",
      path: "./assets/mp3/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Tay trái chỉ trăng",
      singer: "Tát Đỉnh Đỉnh",
      path: "./assets/mp3/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Vong Tiện",
      singer: "Vương Nhất Bác",
      path: "./assets/mp3/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Xuy Diệt Tiểu Sơn Hà",
      singer: "Tư Nam",
      path: "./assets/mp3/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "Yến Vô Hiết",
      singer: "Trương Tuyết Nhi",
      path: "./assets/mp3/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "Thu Thương Biệt Luyến",
      singer: "Mã Dược Triển",
      path: "./assets/mp3/song9.mp3",
      image: "./assets/img/song9.jpg",
    },
    {
      name: "Thẩm Viên Ngoại",
      singer: "Lệ Cách",
      path: "./assets/mp3/song10.mp3",
      image: "./assets/img/song10.jpg",
    },
  ],
  render: function () {
    // console.log("ok");
    const list = this.songs.map((song, index) => {
      return `<div class="song ${index === this.currentIndex ? "active" : ""}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
      </div>
      `;
    });
    $(".playlist").innerHTML = list.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;

    const playBtn = $(".btn.btn-toggle-play");
    // console.log(playBtn);
    const preBtn = $(".btn.btn-prev");
    const nextBtn = $(".btn.btn-next");

    // thu phong image
    document.addEventListener("scroll", () => {
      // console.log(window.scrollY);
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      // console.log(200 - scrollTop);
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    });

    // play song
    playBtn.onclick = () => {
      // console.log(this);
      // console.log("Play");
      player.classList.toggle("playing");
      if (!this.isPlaying) {
        audio.play();
        this.isPlaying = true;
        this.spin = () => {
          if (this.currentDeg < 360) {
            this.currentDeg += this.speed;
            cdThumb.style.transform = `rotate(${this.currentDeg + "deg"})`;
          } else {
            this.currentDeg = 0;
          }
          rotate = requestAnimationFrame(this.spin);
        };
        this.spin();
        // play progress
        loadProgress = setInterval(this.loadProgress, 1000);
      } else {
        // console.log(rotate);
        cancelAnimationFrame(rotate);
        clearInterval(loadProgress);
        audio.pause();
        this.isPlaying = false;
      }
    };

    // pre next songs
    preBtn.onclick = () => {
      this.currentDeg = 0;
      const count = this.songs.length;
      if (this.isRandom) {
        this.currentIndex = Math.floor(Math.random() * count);
      } else {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        } else {
          this.currentIndex = count - 1;
        }
      }
      this.loadCurrentSong();
      this.render();
      if (this.isPlaying) {
        audio.play();
      }
    };
    nextBtn.onclick = () => {
      // console.log("next");
      // console.log(this);
      this.currentDeg = 0;
      const count = this.songs.length;
      if (this.isRandom) {
        this.currentIndex = Math.floor(Math.random() * count);
      } else {
        if (this.currentIndex < count - 1) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }
      }
      this.loadCurrentSong();
      this.render();
      if (this.isPlaying) {
        audio.play();
      }
    };

    // auto next when the song has finished
    audio.onended = () => {
      if (this.isRepeat) {
        audio.load();
        audio.play();
      } else {
        this.currentDeg = 0;
        const count = this.songs.length;
        if (this.isRandom) {
          this.currentIndex = Math.floor(Math.random() * count);
        } else {
          if (this.currentIndex < count - 1) {
            this.currentIndex++;
          } else {
            this.currentIndex = 0;
          }
        }
        this.loadCurrentSong();
        this.render();
        audio.play();
      }
    };

    // reload song
    ReloadBtn.onclick = () => {
      ReloadBtn.classList.toggle("active");
      const checkRepeat = this.isRepeat ? false : true;
      this.isRepeat = checkRepeat;
    };

    // random song
    randomBtn.onclick = () => {
      randomBtn.classList.toggle("active");
      const checkRandom = this.isRandom ? false : true;
      this.isRandom = checkRandom;
    };

    // foward audio
    progress.onchange = () => {
      const time = audio.duration;
      let currentSongTime = (progress.value / 100) * time;
      audio.currentTime = currentSongTime;
    };
  },
  loadProgress: function () {
    const time = audio.duration;
    const timeLoad = audio.currentTime;
    const percent = (timeLoad / time) * 100;
    progress.value = percent;
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
    cdThumb.style.transform = `rotate(0)`;
  },
  start: function () {
    // dinh nghia thuoc tinh
    this.defineProperties();
    // xu li su kien
    this.handleEvent();

    this.loadCurrentSong();
    this.render();
  },
};

app.start();
