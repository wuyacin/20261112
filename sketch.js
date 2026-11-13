let stopSheet; // 儲存角色1的待機精靈圖
let walkSheet; // 儲存角色1的走路精靈圖
let magicSheet; // 儲存角色1的一次性施法精靈圖
let magicEffectSheet; // 儲存角色1發射的特效精靈圖
let characterX; // 儲存角色中心的水平座標
let facingDirection = 1; // 記錄角色面向方向，正數為右、負數為左
let castDirection = 1; // 記錄本次施法時角色面向的方向
let isCasting = false; // 記錄角色是否正在播放施法動畫
let castStartedAt = 0; // 記錄施法動畫開始的時間
let isMagicEffectActive = false; // 記錄魔法特效是否正在移動
let magicEffectX = 0; // 記錄魔法特效中心的水平座標
let magicEffectDirection = 1; // 記錄魔法特效的移動方向
let magicEffectStartedAt = 0; // 記錄魔法特效動畫開始的時間
let spaceHeld = false; // 避免長按空白鍵重複觸發施法
const stopFrameCount = 10; // 設定待機精靈圖中的影格數
const walkFrameCount = 9; // 設定走路精靈圖中的影格數
const magicFrameCount = 4; // 設定施法精靈圖中的影格數
const magicEffectFrameCount = 5; // 設定魔法特效精靈圖中的影格數
const frameDuration = 120; // 設定每張影格播放的毫秒數
const movementSpeed = 360; // 設定角色每秒移動的像素數
const magicEffectSpeed = 600; // 設定魔法特效每秒移動的像素數
function preload() { // 在畫布建立前載入角色圖片
  stopSheet = loadImage("1/stop/stop.png.png"); // 載入角色待機精靈圖
  walkSheet = loadImage("1/walk/walk.png.png"); // 載入角色走路精靈圖
  magicSheet = loadImage("1/magic1/magic1.png.png"); // 載入角色施法精靈圖
  magicEffectSheet = loadImage("1/magic-effect/magic-effect.png.png"); // 載入魔法特效精靈圖
} // 結束圖片載入函式
function setup() { // 設定全螢幕大小的畫布
  createCanvas(windowWidth, windowHeight); // 讓畫布符合目前瀏覽器視窗尺寸
  imageMode(CORNER); // 使用圖片左上角作為繪製座標
  characterX = width * (2 / 3); // 將角色初始中心放在畫布寬度的三分之二處
} // 結束畫布設定函式
function draw() { // 每個動畫影格執行一次繪製
  background(221, 204, 245); // 以淺紫色清除畫布背景
  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查是否持續按住右方向鍵
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查是否持續按住左方向鍵
  const isWalking = movingRight || movingLeft; // 按住任一方向鍵時切換至走路動畫
  const direction = movingRight ? 1 : movingLeft ? -1 : 0; // 計算移動方向，同時按下時優先向右
  if (direction !== 0) facingDirection = direction; // 移動時更新角色面向方向
  if (!stopSheet || !walkSheet || !magicSheet || !magicEffectSheet) return; // 等待所有角色與特效圖片載入完成
  const currentTime = millis(); // 取得目前動畫播放時間
  const magicFrameWidth = magicSheet.width / magicFrameCount; // 計算施法動畫每張影格的原圖寬度
  const displayHeight = height / 3; // 將角色顯示高度設為畫布高度的三分之一
  const magicDisplayWidth = displayHeight * (magicFrameWidth / magicSheet.height); // 依施法影格比例計算角色寬度
  const effectFrameWidth = magicEffectSheet.width / magicEffectFrameCount; // 計算特效動畫每張影格的原圖寬度
  const effectDisplayWidth = displayHeight * (effectFrameWidth / magicSheet.height); // 依施法角色的縮放比例計算特效寬度
  const effectDisplayHeight = displayHeight * (magicEffectSheet.height / magicSheet.height); // 依施法角色的縮放比例計算特效高度
  if (isCasting && currentTime - castStartedAt >= magicFrameCount * frameDuration) { // 確認四張施法影格已完整播放一次
    isCasting = false; // 結束施法動畫
    isMagicEffectActive = true; // 開始顯示並移動魔法特效
    magicEffectDirection = castDirection; // 讓特效沿著施法時的面向移動
    magicEffectX = characterX + castDirection * (magicDisplayWidth + effectDisplayWidth) / 2; // 將特效放在角色面向的一側
    magicEffectStartedAt = currentTime; // 記錄特效動畫開始時間
  } // 結束施法動畫與特效的銜接處理
  const activeSheet = isCasting ? magicSheet : isWalking ? walkSheet : stopSheet; // 依狀態選擇施法、走路或待機精靈圖
  const activeFrameCount = isCasting ? magicFrameCount : isWalking ? walkFrameCount : stopFrameCount; // 取得目前精靈圖的影格總數
  if (!activeSheet) return; // 圖片尚未載入時暫停繪製角色
  const sourceFrameWidth = activeSheet.width / activeFrameCount; // 計算目前影格在原圖中的寬度
  const sourceFrameHeight = activeSheet.height; // 取得目前精靈圖影格高度
  const displayWidth = displayHeight * (sourceFrameWidth / sourceFrameHeight); // 按原圖比例計算角色顯示寬度
  const frameIndex = isCasting ? floor((currentTime - castStartedAt) / frameDuration) : floor(currentTime / frameDuration) % activeFrameCount; // 施法影格只播放一次，其餘動畫持續循環
  const displayY = height - displayHeight; // 將角色底端對齊畫布底端
  if (direction !== 0) characterX += direction * movementSpeed * deltaTime / 1000; // 按住方向鍵時依時間平滑移動角色
  characterX = constrain(characterX, displayWidth / 2, width - displayWidth / 2); // 限制角色中心位置以停在畫布左右邊界
  push(); // 暫存畫布座標狀態以便套用角色轉向
  translate(characterX, displayY); // 將繪圖原點移至角色左下方的中心基準位置
  if ((isCasting ? castDirection : facingDirection) < 0) scale(-1, 1); // 施法或面向左方時水平翻轉角色圖片
  image(activeSheet, -displayWidth / 2, 0, displayWidth, displayHeight, frameIndex * sourceFrameWidth, 0, sourceFrameWidth, sourceFrameHeight); // 依影格來源區域與等比例尺寸繪製角色
  pop(); // 還原畫布座標狀態
  if (isMagicEffectActive) { // 特效啟動後持續移動並播放影格
    magicEffectX += magicEffectDirection * magicEffectSpeed * deltaTime / 1000; // 讓特效朝施法方向移動
    if ((magicEffectDirection > 0 && magicEffectX - effectDisplayWidth / 2 >= width) || (magicEffectDirection < 0 && magicEffectX + effectDisplayWidth / 2 <= 0)) { // 特效完整抵達畫布邊緣後停止
      isMagicEffectActive = false; // 移除已離開畫布的特效
    } else { // 特效仍在畫布範圍內時繼續繪製
      const effectFrameIndex = floor((currentTime - magicEffectStartedAt) / frameDuration) % magicEffectFrameCount; // 循環播放特效精靈圖的五張影格
      const effectY = height - displayHeight / 2; // 將特效垂直置於角色身體中央
      push(); // 暫存畫布座標狀態以便套用特效轉向
      translate(magicEffectX, effectY); // 將繪圖原點移至特效中心
      if (magicEffectDirection < 0) scale(-1, 1); // 特效向左移動時水平翻轉圖片
      image(magicEffectSheet, -effectDisplayWidth / 2, -effectDisplayHeight / 2, effectDisplayWidth, effectDisplayHeight, effectFrameIndex * effectFrameWidth, 0, effectFrameWidth, magicEffectSheet.height); // 按比例繪製目前的特效影格
      pop(); // 還原畫布座標狀態
    } // 結束特效繪製判斷
  } // 結束特效播放處理
} // 結束動畫繪製函式
function keyPressed() { // 按下鍵盤時避免方向鍵捲動網頁
  if (keyCode === 32) { // 按下空白鍵時啟動一次施法動畫
    if (!spaceHeld && !isCasting && !isMagicEffectActive) { // 只有按鍵剛按下且目前沒有魔法動畫時才觸發
      isCasting = true; // 開始播放施法動畫
      castStartedAt = millis(); // 記錄施法動畫開始時間
      castDirection = facingDirection; // 記錄施法時角色面向
    } // 結束空白鍵觸發條件
    spaceHeld = true; // 記錄空白鍵目前仍被按住
    return false; // 阻止空白鍵的瀏覽器預設行為
  } // 結束空白鍵事件處理
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) return false; // 阻止左右方向鍵的瀏覽器預設行為
} // 結束按鍵事件函式
function keyReleased() { // 放開鍵盤時避免方向鍵捲動網頁
  if (keyCode === 32) { // 放開空白鍵時允許下一次施法
    spaceHeld = false; // 清除空白鍵按住狀態
    return false; // 阻止空白鍵的瀏覽器預設行為
  } // 結束空白鍵放開處理
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) return false; // 阻止左右方向鍵的瀏覽器預設行為
} // 結束放開按鍵事件函式
function windowResized() { // 瀏覽器視窗改變大小時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿目前視窗
  characterX = constrain(characterX, 0, width); // 調整角色座標以符合新的畫布寬度
} // 結束視窗尺寸調整函式
