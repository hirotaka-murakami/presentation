// 文字を消すときに使う
let keyFlag = false;
let onCursorText = "";
let onCursorObject = {};

// 文字配列
let alphabetArray = [];
let shuffledArray = [];
let reverseArray = [];// ナイトメア用　アルファベット逆順配列

// 文字が入っているセルを取得
let cellObjectsList = document.querySelectorAll("td");
let positionObjectArray = [];// 文字セルの下端：bottom 　左端：left　　上端：top　右端：right

// 難易度フラグ
let beginnerFlag = false;
let intermediateFlag = false;
let nightmareFlag = false;

// ボタン
let beginnerButton = document.getElementById("beginner");
let intermediateButton = document.getElementById("intermediate");
let nightmareButton = document.getElementById("nightmare");

// recordオブジェクト
let beginnerRecord = document.getElementById("beginnerRecord")
let intermediateRecord = document.getElementById("intermediateRecord")
let nightmareRecord = document.getElementById("nightmareRecord")
let beginnerBeatTime = beginnerRecord.innerText.slice(3);
let intermediateBeatTime = intermediateRecord.innerText.slice(3);
let nightmareBeatTime = nightmareRecord.innerText.slice(3);

// 消した回数をカウントする
let count = 0;

// 初級レベル
function beginner() {
    beginnerFlag = true;
    intermediateFlag = false;
    nightmareFlag = false;
    aftrLevelSelect();
}

// 中級レベル
function intermediate() {
    beginnerFlag = false;
    intermediateFlag = true;
    nightmareFlag = false;
    aftrLevelSelect();
}

// ナイトメアレベル
function nightmare() {
    beginnerFlag = false;
    intermediateFlag = false;
    nightmareFlag = true;
    aftrLevelSelect();
}

// 文字書き換え 各セルのポジション取得
function aftrLevelSelect() {
    alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    shuffledArray = alphabetArray.slice();
    shuffledArray = arrayShuffle(shuffledArray);
    reverseArray = alphabetArray.slice();
    reverseArray = reverseArray.reverse();
    buttonColorInit();

    // カウント初期化
    count = 0;

    // 各セルに文字追加 ＆ 座標取得
    for (let i = 0; i < 26; i++) {
        cellObjectsList[i].innerText = shuffledArray[i];
        positionObjectArray[i] = {
            alphabet: shuffledArray[i],
            top: cellObjectsList[i].getBoundingClientRect().top + window.pageYOffset,
            bottom: cellObjectsList[i].getBoundingClientRect().bottom + window.pageYOffset,
            left: cellObjectsList[i].getBoundingClientRect().left + window.pageXOffset,
            right: cellObjectsList[i].getBoundingClientRect().right + window.pageXOffset
        }
    }

    // ストップウォッチスタート
    reset();
    start();
}

// ボタンの色変えたり戻したり
function buttonColorInit() {
    switch (true) {
        case beginnerFlag:
            beginnerButton.style.backgroundColor = "aqua";
            intermediateButton.style.backgroundColor = "";
            nightmareButton.style.backgroundColor = "";
            break;
        case intermediateFlag:
            beginnerButton.style.backgroundColor = "";
            intermediateButton.style.backgroundColor = "aqua";
            nightmareButton.style.backgroundColor = "";
            break;
        case nightmareFlag:
            beginnerButton.style.backgroundColor = "";
            intermediateButton.style.backgroundColor = "";
            nightmareButton.style.backgroundColor = "aqua";
            break;
    }
}

// 引数の配列の並びをランダムに入れ替える
function arrayShuffle(array) {
    for (let i = (array.length - 1); 0 < i; i--) {

        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i + 1));

        // 要素の並び替えを実行
        let temp = array[i];
        array[i] = array[r];
        array[r] = temp;
    }
    return array;
}

// キーボードが入力されたときの処理
// クリックした文字と入力したキーが同じなら文字を消す
function keyupEvent(event) {
    console.log("event:", event.key, " flag:", keyFlag, " text:", onCursorText);
    output = document.querySelector('#output');

    // カーソルが文字の上にある ＆ キーが押された
    if (keyFlag === true && event.key.toUpperCase() === onCursorText) {

        // クリックした文字とキー入力が一致すれば文字を消す
        if (beginnerFlag) {// 初級レベル
            if (onCursorObject.innerText !== "") {
                textErace();
            }
        } else if (intermediateFlag) {// 中級レベル
            if (onCursorObject.innerText !== ""
                && onCursorObject.innerText === alphabetArray[0]) {
                textErace();
                alphabetArray.shift();
            }
        } else if (nightmareFlag) {// ナイトメア
            if (onCursorObject.innerText !== ""
                && onCursorObject.innerText === reverseArray[0]) {
                textErace();
                reverseArray.shift();
            }
        }
    }
}

// セルの文字を削除する
function textErace() {
    onCursorObject.innerText = "";
    onCursorObject.style.backgroundColor = "";
    keyFlag = false;
    onCursorObject = {};
    onCursorText = "";

    count++

    // 全部消した時の処理
    if (count === 26) {
        for (let i in cellObjectsList) cellObjectsList[i].innerText = "🐧"
        stop();

        if (beginnerFlag) { // 初級
            // 初回時
            if (!beginnerBeatTime) {
                beginnerBeatTime = showTime.innerText;
                beginnerRecord.innerText = "初級　" + beginnerBeatTime;
            }
            //2回目以降は最小値を更新 
            if (timeStr2Num(beginnerBeatTime) > timeStr2Num(showTime.innerText)) {
                beginnerBeatTime = showTime.innerText;
                beginnerRecord.innerText = "初級　" + beginnerBeatTime;
            }
        }
        if (intermediateFlag) { // 中級
            // 初回時
            if (!intermediateBeatTime) {
                intermediateBeatTime = showTime.innerText;
                intermediateRecord.innerText = "中級　" + intermediateBeatTime;
            }
            //2回目以降は最小値を更新 
            if (timeStr2Num(intermediateBeatTime) > timeStr2Num(showTime.innerText)) {
                intermediateBeatTime = showTime.innerText;
                intermediateRecord.innerText = "中級　" + intermediateBeatTime;
            }
        }
        if (nightmareFlag) { // ナイトメア
            // 初回時
            if (!nightmareBeatTime) {
                nightmareBeatTime = showTime.innerText;
                nightmareRecord.innerText = "悪夢　" + nightmareBeatTime;
            }
            //2回目以降は最小値を更新 
            if (timeStr2Num(nightmareBeatTime) > timeStr2Num(showTime.innerText)) {
                nightmareBeatTime = showTime.innerText;
                nightmareRecord.innerText = "悪夢　" + nightmareBeatTime;
            }
        }

        // レベルフラグ初期化
        beginnerFlag = false;
        intermediateFlag = false;
        nightmareFlag = false;

        // ボタン色初期化
        beginnerButton.style.backgroundColor = "";
        intermediateButton.style.backgroundColor = "";
        nightmareButton.style.backgroundColor = "";

        // カウント初期化
        count = 0;
    }
}

// 文字列の分秒を秒に変換する
function timeStr2Num(str) {
    let min = str.slice(0, 2);
    let sec = str.slice(3, 9);
    min = min * 60;
    min = Number(min);
    sec = Number(sec);
    return min + sec;
}

// マウスムーブイベント
onMouseMove = function (event) {
    // マウス座標の表示
    if (output === null) {
        output = document.querySelector('#output');
    } else {
        output.innerHTML = `x:` + event.pageX + ` y:` + event.pageY;
    }

    // カーソルが文字の上にあるときの処理
    if (beginnerFlag || intermediateFlag || nightmareFlag) {
        for (let i = 0; i < 26; i++) {
            if (event.pageX >= positionObjectArray[i].left && event.pageX <= positionObjectArray[i].right
                && event.pageY >= positionObjectArray[i].top && event.pageY <= positionObjectArray[i].bottom) {

                // 背景色を変える　keyupで文字が消えるフラグを立てる
                if (cellObjectsList[i].innerText !== "") {
                    cellObjectsList[i].style.backgroundColor = "blue";
                    keyFlag = true;
                    onCursorObject = cellObjectsList[i];
                    onCursorText = onCursorObject.innerText;
                }
            } else {
                cellObjectsList[i].style.backgroundColor = "";
            }
        }
    }
}

// 拡大率変更時、要素の座標を取得しなおす
function resizeEvent() {
    for (let i = 0; i < 26; i++) {
        positionObjectArray[i] = {
            top: cellObjectsList[i].getBoundingClientRect().top + window.pageYOffset,
            bottom: cellObjectsList[i].getBoundingClientRect().bottom + window.pageYOffset,
            left: cellObjectsList[i].getBoundingClientRect().left + window.pageXOffset,
            right: cellObjectsList[i].getBoundingClientRect().right + window.pageXOffset
        }
    }
}

//マウス座標出力先
let output = document.querySelector('#output');

//マウス移動時
if (output !== null) {
    document.onmousemove = onMouseMove;
}

// キーアップイベント
document.addEventListener('keyup', keyupEvent);

// 拡大率変更イベント
window.addEventListener('resize', resizeEvent);


// 以下コピペ
let showTime;       // 表示時間
let timer;              // clearTimeoutで使用
let startTime;          // 開始時間
let elapsedTime = 0;    // 経過時間
let holdTime = 0;       // 一時停止用に時間を保持

window.onload = function () {
    showTime = document.getElementById("timer");
}

// スタートボタン押下時
function start() {
    // 開始時間を現在の時刻に設定
    startTime = Date.now();

    // 時間計測
    measureTime();
}

// ストップボタン押下時
function stop() {
    // タイマー停止
    clearInterval(timer);

    // 停止時間を保持
    holdTime += Date.now() - startTime;
}

// リセットボタン押下時
function reset() {
    // タイマー停止
    clearInterval(timer);

    // 変数、表示を初期化
    elapsedTime = 0;
    holdTime = 0;
    showTime.textContent = "00:00.000";
}

// 時間を計測（再帰関数）
function measureTime() {
    // タイマーを設定
    timer = setTimeout(function () {
        // 経過時間を設定し、画面へ表示
        elapsedTime = Date.now() - startTime + holdTime;
        showTime.textContent = new Date(elapsedTime).toISOString().slice(14, 23);

        // 関数を呼び出し、時間計測を継続する
        measureTime();
    }, 10);
}
