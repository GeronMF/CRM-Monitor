<?php
// Скопируйте этот файл как config.php и заполните реальными значениями
// cp api/config.example.php api/config.php

$crm_credentials = [
    'ecommerce' => [
        'login'               => 'YOUR_LOGIN',
        'password'            => 'YOUR_PASSWORD',
        'roleId'              => '39',
        'sourceFilter'        => ['ЛЕНДИНГ', 'Сайты'],
        'processTimeSourceId' => '60',
    ],
    'diar' => [
        'login'               => 'YOUR_LOGIN',
        'password'            => 'YOUR_PASSWORD',
        'roleId'              => '9',
        'sourceFilter'        => ['ДИАР_Укр'],
        'processTimeSourceId' => '4',
    ],
    'rozpakuj' => [
        'login'               => 'YOUR_LOGIN',
        'password'            => 'YOUR_PASSWORD',
        'roleId'              => '9',
        'sourceFilter'        => ['Трансляция канала Розпакуй ТВ'],
        'processTimeSourceId' => '65',
    ],
    'mega' => [
        'login'        => 'YOUR_LOGIN',
        'password'     => 'YOUR_PASSWORD',
        'roleId'       => '9',
        'sourceFilter' => 'Пряма трансляція МегаРозпакуй',
    ],
];
?>
