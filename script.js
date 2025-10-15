
// 广州地铁线路数据
const metroData = {
    "1": {
        name: "1号线",
        stations: {
            up: ["广州东站", "体育中心", "体育西路", "杨箕", "东山口", "烈士陵园", "农讲所", "公园前", "西门口", "陈家祠", "长寿路", "黄沙", "芳村", "花地湾", "坑口", "西朗"],
            down: ["西朗", "坑口", "花地湾", "芳村", "黄沙", "长寿路", "陈家祠", "西门口", "公园前", "农讲所", "烈士陵园", "东山口", "杨箕", "体育西路", "体育中心", "广州东站"]
        },
        color: "#F3D03E"
    },
    "2": {
        name: "2号线",
        stations: {
            up: ["广州南站", "石壁", "会江", "南浦", "洛溪", "南洲", "东晓南", "江泰路", "昌岗", "江南西", "市二宫", "海珠广场", "公园前", "纪念堂", "越秀公园", "广州火车站", "三元里", "飞翔公园", "白云公园", "白云文化广场", "萧岗", "江夏", "黄边", "嘉禾望岗"],
            down: ["嘉禾望岗", "黄边", "江夏", "萧岗", "白云文化广场", "白云公园", "飞翔公园", "三元里", "广州火车站", "越秀公园", "纪念堂", "公园前", "海珠广场", "市二宫", "江南西", "昌岗", "江泰路", "东晓南", "南洲", "洛溪", "南浦", "会江", "石壁", "广州南站"]
        },
        color: "#0065B1"
    },
    // 其他线路数据...
    "APM": {
        name: "APM线",
        stations: {
            up: ["林和西", "体育中心南", "天河南", "黄埔大道", "妇儿中心", "花城大道", "大剧院", "海心沙", "广州塔"],
            down: ["广州塔", "海心沙", "大剧院", "花城大道", "妇儿中心", "黄埔大道", "天河南", "体育中心南", "林和西"]
        },
        color: "#00B0BA"
    },
    "GF": {
        name: "广佛线",
        stations: {
            up: ["新城东", "东平", "世纪莲", "澜石", "魁奇路", "季华园", "同济路", "祖庙", "普君北路", "朝安", "桂城", "南桂路", "礌岗", "千灯湖", "金融高新区", "龙溪", "菊树", "西朗", "鹤洞", "沙涌", "沙园", "燕岗", "石溪", "南洲", "沥滘"],
            down: ["沥滘", "南洲", "石溪", "燕岗", "沙园", "沙涌", "鹤洞", "西朗", "菊树", "龙溪", "金融高新区", "千灯湖", "礌岗", "南桂路", "桂城", "朝安", "普君北路", "祖庙", "同济路", "季华园", "魁奇路", "澜石", "世纪莲", "东平", "新城东"]
        },
        color: "#5C2D91"
    }
};

// DOM元素
const lineSelect = document.getElementById('line-select');
const directionSelect = document.getElementById('direction-select');
const stationSelect = document.getElementById('station-select');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const displayArea = document.getElementById('display-area');
const nowPlaying = document.getElementById('now-playing');

// 音频上下文
let audioContext;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.error('Web Audio API is not supported in this browser');
}

// 当前播放的音频
let currentAudio = null;

// 初始化车站选择
function initStationSelect() {
    const line = lineSelect.value;
    const direction = directionSelect.value;
    const stations = metroData[line].stations[direction];
    
    stationSelect.innerHTML = '';
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station;
        option.textContent = station;
        stationSelect.appendChild(option);
    });
}

// 播放报站音频
function playAnnouncement() {
    if (currentAudio) {
        currentAudio.stop();
    }
    
    const line = lineSelect.value;
    const station = stationSelect.value;
    const direction = directionSelect.value;
    
    // 更新显示区域
    displayArea.innerHTML = `
        <div class="station-display text-center">
            <div class="mb-2">
                <span class="inline-block px-3 py-1 rounded-full text-white font-medium" style="background-color: ${metroData[line].color}">
                    ${metroData[line].name}
                </span>
            </div>
            <h3 class="station-name text-3xl font-bold text-gray-800 mb-1">${station}</h3>
            <p class="station-pinyin text-gray-500 italic mb-4">${getPinyin(station)}</p>
            <p class="text-gray-600">
                <i class="fas fa-arrow-${direction === 'up' ? 'up' : 'down'} mr-1"></i>
                ${direction === 'up' ? '上行' : '下行'}方向
            </p>
        </div>
    `;
    
    // 更新当前播放信息
    nowPlaying.innerHTML = `
        <p class="font-medium">${metroData[line].name} · ${station}站</p>
        <p class="text-sm text-gray-600 mt-1">${new Date().toLocaleTimeString()}</p>
    `;
    
    // 模拟播放音频
    const audioPath = `audio/${line}/${direction}/${station}.mp3`;
    playAudio(audioPath);
}

// 播放音频
function playAudio(path) {
    if (!audioContext) return;
    
    // 实际项目中这里应该是真实的音频文件请求
    console.log(`Playing audio: ${path}`);
    
    // 模拟音频播放
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.5;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    currentAudio = {
        stop: () => {
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
        },
        source: oscillator
    };
    
    // 模拟3秒后自动停止
    setTimeout(() => {
        if (currentAudio && currentAudio.source === oscillator) {
            currentAudio.stop();
            currentAudio = null;
        }
    }, 3000);
}

// 停止播放
function stopPlayback() {
    if (currentAudio) {
        currentAudio.stop();
        currentAudio =
