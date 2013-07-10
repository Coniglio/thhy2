<?php
    setlocale( LC_ALL, 'ja_JP.UTF-8' );
    date_default_timezone_set('Asia/Tokyo');

    // 温湿度データの取得
    $id = $_POST['id'];
    $thermo = $_POST['thermo'];
    $hygro = $_POST['hygro'];
    
    $logging_date = date('Y-m-d H:i:s');
    echo $logging_date . ', ' . $id . ', ' . $thermo . ', ' . $hygro . PHP_EOL;

    $server = 'xxx';
    $mydb = 'xxx';
    $usr = 'xxx';
    $pass = 'xxx';
    $query = "insert into thermo_hygro values($id,$thermo,$hygro)";

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

    // データを追加
    $result = mysql_query($query);
    if (! $result) {
        die('insert失敗: ' . mysql_error());
    }

    // メモリ解放
    mysql_free_result($result);

    // DBをクローズ
    mysql_close($con);

    header("HTTP/1.0 200 OK", FALSE);