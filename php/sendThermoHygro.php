<?php
    setlocale( LC_ALL, 'ja_JP.UTF-8' );
    date_default_timezone_set('Asia/Tokyo');

    $url = 'xxxx';
    $data = array(
        'kind' => 1,
        'no' => 1,
        'thermo' => '25.5',
        'hygro' => '49.8'
    );
    $options = array(
        'http' => array(
            'method' => 'POST',
            'content' => http_build_query($data)
        )
    );

    $contens = file_get_contents($url, false, stream_context_create($options));

    echo $contens;
?>