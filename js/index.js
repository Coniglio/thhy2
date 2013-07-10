var dateFormat = new DateFormat('yyyy/MM/dd');
var date = '';
var sensorId = '1';

$(function() {
    // 初期表示・再描画時は当日の温湿度データ
    date = dateFormat.format(new Date());

    // センサー選択スクローラー設定を取得
    $('#selectSensor').scroller(getSensorScroller());

    // センサー選択スクローラーを表示
    $('#sensor').click(showSensorScroller);

    // 選択したセンサーの温湿度グラフを表示
    $('#selectSensor').change(changeSensor);

    // 日付選択ダイアログのデフォルトは当日
    $('#historyDate').val(date);

    // 日付選択スクローラーを表示
    $('#historyCal').click(function(){$('#historyDate').scroller('show');});

    // 選択した日付の温湿度グラフを表示
    $('#historyDate').change(changeDate);

    // センサー設定を取得
    setSensorInfo();

    // 初期表示時は1番のセンサーをグラフ表示
    $('#selectSensor').val('1');
    
    // 温湿度グラフを描画
    draw();
});

/**
 * 選択したセンサーの温度グラフを表示します。
 */
function changeSensor() {
    // センサー番号を選択した温度センサーの番号に変更
    sensorId = $('#selectSensor').val();
    $('#historyDate').val(date);

    // 温度グラフを再描画
    redraw();
}

/**
 * センサー情報を設定します。
 */
function getSensorConfig() {
    var sensor = [];
    $.ajax({
           type: 'POST',
           url: '../php/getSensorConfig.php',
           dataType: 'json',
           async: false,
        }).done(function(json) {
            if (json == null || json.length == 0) {
              alert('センサー設定が存在しません。');
              return sensor;
            }
            var sensorNum = json.length;
            for (var i = 0; i < sensorNum; i++) {
                var config = [];
                config['id'] = json[i].id;
                config['name'] = json[i].name;
                sensor.push(config);
            }
        }).fail(function (data) {
            alert('センサー設定の取得に失敗しました。');
            return null;
        });
    return sensor;
}

/**
 * 選択した日付の温度グラフを表示します。
 */
function changeDate() {
    // 選択した日付を取得
    var arrayDate = $('#historyDate').val().split('/');
    date = arrayDate[2] + '/' + arrayDate[0] + '/' + arrayDate[1];

    // 日付選択ダイアログのデフォルトを選択日に設定
    $('#historyCal').val(date);

    // 温度グラフを再描画
    redraw();
}

/**
 * センサー情報を設定します。
 */
function setSensorInfo() {
    // センサー情報取得
    var sensor = getSensorConfig();
    if (sensor == null || sensor.length == 0) {
        return false;
    }

    // センサー情報を設定
    var sensorNum = sensor.length;
    for (i = 0; i < sensorNum; i++) {
        $('#selectSensor').append($('<option value=' + sensor[i]['id'] + '>' + sensor[i]['name'] + '</option>'));
    }

    return true;
}

/**
 * センサー選択スクローラー設定を返します。
 */
function getSensorScroller() {
    return {
        preset: 'select',
        theme: 'ios',
        display: 'modal',
        mode: 'scroller',
        inputClass: 'i-txt',
    };
}

/**
 * 日付選択スクローラー設定を返します。
 */
function getDateScroller() {
    return {
        preset: 'date',
        theme: 'ios',
        display: 'modal',
        mode: 'scroller',
        dateOrder: 'yyyy mm dd'
    };
}

/**
 * センサー選択スクローラーを表示します。
 */
function showSensorScroller() {
    // センサー情報を設定
    if (! setSensorInfo()) {
        return false;
    }

    // センサー選択スクローラーを表示
    $('#selectSensor').scroller('show');
}

/**
 * 温度グラフを描画します。
 */
function draw() {
    // 温度グラフのタイトルを設定
    ThermoGraph.setTitle($('#selectSensor option:selected').text() + ' ' +  date.split('/')[0] + '年' +  date.split('/')[1] + '月' + date.split('/')[2] + '日');
    
    // 温度データを取得
    var thermoArray = getThermo(date, sensorId);
    if (thermoArray.length == 0) { // 温度データ取得失敗
        // 温度グラフをクリア
        clearTempLogger();
        return;
    }
    
    // 温度グラフを表示
    ThermoGraph.show('linechart', 13,  [thermoArray]);
}

/**
 * 温度グラフを再描画します。
 */
function redraw() {
    // 温度グラフを破棄
    ThermoGraph.destroy();

    // 温度グラフを表示
    draw();
}

/**
 * 温度データ・センサー情報をクリアします。
 */
function clearTempLogger() {
    // グラフを破棄
    ThermoGraph.destroy();

    // 温度グラフ名を設定
    ThermoGraph.setTitle(date.split('/')[0] + '年' +  date.split('/')[1] + '月' + date.split('/')[2] + '日');

    // 空のグラフを描画
    ThermoGraph.show('linechart', 13, [[{}]]);
}

/**
 * 温度データを返します。
 */
function getThermo(date, sensorId) {
    var thermoArray = [];
    $.ajax({
        type: 'POST',
        url: '../php/getThermo.php',
        async: false,
        data: {'date' : date, 'sensorId' : sensorId},
        dataType: 'json'
    }).done(function (json) {
        var num = json.length;
        if (num == 0) {
            alert('温度データが存在しません。');
            return thermoArray;
        }
        for (var i = 0; i < num; i++) {
            thermoArray.push([json[i].logging_date, json[i].thermo]);
        }
    }).fail(function (data) {
        alert('温度データの取得に失敗しました。');
    });
    return thermoArray;
}