<?php
    setlocale( LC_ALL, 'ja_JP.UTF-8' );
    date_default_timezone_set('Asia/Tokyo');
    
    $server = 'xxxx';
    $mydb = 'xxx';
    $usr = 'xxx';
    $pass = 'xxx';
    $query = "select id, name from sensor_config order by id";

    // DB接続
    $con = mysql_connect($server, $usr, $pass);
    if (! $con) {
        die('cannot connnect: ' . mysqli_error());
    }

    // テーブル選択
    $db = mysql_select_db($mydb, $con);
    if (! $db) {
        die("cannot use $mydb" . mysql_error());
    }

    // データを取得
    mysql_set_charset('utf8');
    $result = mysql_query($query);
    if (! $result) {
        die('select失敗: ' . mysql_error());
    }
    $array = array();
    while ($row = mysql_fetch_assoc($result)) {
        $array[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }

    // メモリ解放
    mysql_free_result($result);

    // DBをクローズ
    mysql_close($con);
    
    echo json_encode($array);
?>