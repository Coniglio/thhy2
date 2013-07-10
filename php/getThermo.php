<?php
    setlocale( LC_ALL, 'ja_JP.UTF-8' );
    date_default_timezone_set('Asia/Tokyo');
    
    $sensorId = $_POST['sensorId'];
    $date = $_POST['date'];
    list($year, $month, $day) = explode('/', $date);
    $from = $year . '/' . $month . '/' . $day . ' 00:00:00';
    $to = $year . '/' . $month . '/' . $day . ' 23:59:59';

    $server = 'xxxx';
    $mydb = 'xxx';
    $usr = 'xxx';
    $pass = 'xxxx';
    $query = "select id, thermo, logging_date from thermo where '$sensorId' = id and '$from' <= logging_date and logging_date <= '$to'";
    // DB接続
    $con = mysql_connect($server, $usr, $pass);
    if (! $con) {
        die('cannot connnect: ' . mysql_error());
    }

    // テーブル選択
    $db = mysql_select_db($mydb, $con);
    if (! $db) {
        die("cannot use $mydb" . mysql_error());
    }

    // データを取得
    $result = mysql_query($query);
    if (! $result) {
        die('select失敗: ' . mysql_error());
    }
    $array = array();
    while ($row = mysql_fetch_assoc($result)) {
        $array[] = [
            'id' => $row['id'],
            'thermo' => $row['thermo'],
            'logging_date' => $row['logging_date']
        ];
    }

    // メモリ解放
    mysql_free_result($result);

    // DBをクローズ
    mysql_close($con);
    
    echo json_encode($array);
?>