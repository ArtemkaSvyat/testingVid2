// Конфигурация
var FPS = 30;
var videoPath = "videos/all_flights.mp4";
var START_FRAME = 270;

// Правила навигации
var navRules = {
    270:  { left: [896,935], right: [295,344] },
    820:  { left: [896,935], right: [295,344] },
    1225: { left: [896,935], right: [295,344] },
    1540: { left: [896,935], right: [295,344] },
    1875: { left: [896,935], right: [295,344] },
    2128: { left: [896,935], right: [295,344] },
    344:  { left: [1183,1225], right: [465,509] },
    1135: { left: [1183,1225], right: [465,509] },
    509:  { left: [1090,1135], right: [645,690] },
    1035: { left: [1090,1135], right: [645,690] },
    690:  { left: [993,1035], right: [780,820] },
    935:  { left: [993,1035], right: [780,820] }
};

// Карта дворовых точек
var yardMap = {
    1405:1, 2676:1, 3060:1,
    1718:2, 2360:2, 2942:2,
    2013:3, 2484:3, 2820:3
};

// Генплановские кадры (где показываются кнопки очередей)
var genplanQueueFrames = [270, 820, 1225, 1540, 1875, 2128];

// Информация об очередях (квартиры и срок сдачи)
var queueInfo = {
    1: { flats: 124, deadline: "4 кв. 2025" },
    2: { flats: 98,  deadline: "2 кв. 2026" },
    3: { flats: 156, deadline: "4 кв. 2026" }
};

// Глобальные переменные состояния
var currentState = "genplan";
var selectedQueue = null;
var isPlaying = false;
