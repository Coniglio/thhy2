 /**
 * @fileOverview 温度グラフを扱うモジュールです。
 * @version 1.0.0
 */
 
var ThermoGraph = (function() {
    var _graph = null; // 温度グラフ
    var _title = ''; // 温度グラフタイトル
    
    /**
     * 温度グラフを消去します。
     */
    function _destroy() {
        // 温度グラフを破棄
        if (_graph != null) {
            _graph.destroy();
        }

        // 温度グラフタイトルを初期化
        _titile = '';
    }

    /**
     * 温度グラフのタイトルを設定します。
     * @param title 温度グラフタイトル
     */
    function _setTitle(title) {
        _title = title;
    }
    
    /**
     * 温度グラフを表示します。
     * @param graphId 温度グラフを描画するDIVタグのID
     * @param numberTicks 温度グラフX軸(時刻)の個数
     * @param thermo 温度データ[{'time' : 時刻, 'thermo' : 温度}]
     */
    function _show(graphId, numberTicks, thermo) {
        _graph = $.jqplot(graphId, thermo, {
            series: [{label: '温度', yaxis: 'yaxis', lineWidth: 2}],
            seriesDefaults: { showMarker: false },
            axes: {
                xaxis: {
                    numberTicks: numberTicks,
                    tickOptions: {
                        angle: 30,
                        formatString: '%H:%M'
                    },
                    renderer: $.jqplot.DateAxisRenderer,
                    min: '00:00',
                    max: '24:00',
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer, 
                    label: _title
                },
                yaxis: {
                    label: '℃',
                    ticks: [0, 5, 10, 15, 20, 25, 30, 35],
                    tickoptions: {
                        mark: 'outside',
                        showMark: true,
                        showGridline: true,
                        show: true,
                        showLabel: true,
                        formatString: '%d', // C言語のsprintfと同じフォーマットが使える
                    }
                }
            },
            highlighter: {
                show: true, // マウスオーバー時の数値表示
                tooltipAxes: 'y' // Y軸のみ表示
            }
        });
    }
    
    return {
        show : _show,
        destroy: _destroy,
        setTitle: _setTitle
    };
}());

