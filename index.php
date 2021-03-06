<?php


require_once 'Mobile_Detect.php';
$detect = new Mobile_Detect;
$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'phone') : 'computer');
$scriptVersion = $detect->getScriptVersion();
$ua = $detect->getUserAgent();
?>
<!DOCTYPE HTML>
<html>
<head>
    <?php if ($deviceType == 'phone') { ?>
    <meta name="viewport" content="width=device-width, initial-scale=.5, user-scalable = no">
    <?php } else { ?>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable = no">
    <?php } ?>
    <meta property="og:type" content="game" />
    <meta property="og:title" content="Balloon2D" />
    <meta property="og:url" content="http://www.criticalflicker.com/proto/balloon2d/" />
    <meta property="og:description" content="Simple mobile friendly target practice game using HTML5 Canvas and Box2d physics engine." />
    <meta property='og:image' content="http://www.criticalflicker.com/proto/balloon2d/images/balloon2d_screen.jpg" />

    <title>Ballon2D</title>

    <script src="js/modernizr.js"></script>
    <script src="js/libs/require/require.js" data-main="js/main"></script>
    <link rel="stylesheet" type="text/css" href="css/table_style.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <link rel="stylesheet" type="text/css" href="css/mobile.css" media="only screen and (max-device-width: 480px)"/>

</head>
<body>

    <div id="container" style="height: 100%;">
        <div id="scoreboard">
            <div id="score">Score
                <p>0</p>
            </div>
            <div id="balloons">Balloons Left
                <p>0</p>
            </div>
            <div id="arrows">Arrows
                <p>0</p>
            </div>
        </div>
        <div id="preload-bar"></div>
        <canvas id="debug" width="1200" height="900"></canvas>
        <canvas id="game-canvas" width="1200" height="900"></canvas>
        <div id="git-link"><a href="https://github.com/jondavey/balloon2d/" target="_blank">GIT Repository</a></div>
    </div>

    <script type="text/javascript">
        window.deviceType = <?php echo "'".$deviceType."'"; ?>;
        window.ua = <?php echo "'".$ua."'"; ?>;
    </script>
</body>
</html>