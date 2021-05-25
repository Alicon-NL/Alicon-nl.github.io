<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>BALANS</title>
    <script src="admin.js"></script>
	<link href="admin.css" rel="stylesheet" />
</head>
<body>
    <button onclick='console.log(window.parent);window.parent.frames["verslag"].focus();window.parent.frames["verslag"].print();'>Print</button>
    <?php
        for ($jaar = 2021; $jaar >= 2014; $jaar--) {
            echo "<li><a target='verslag' href='verslag.php?jaar=$jaar'>BALANS $bedrijf $jaar</a></li>";
            echo "<li><a target='verslag' href='boek.php?jaar=$jaar'>BOEK $bedrijf $jaar</a></li>";
        }
    ?>
    <li><a target='verslag' href='omzet.php'>OMZET</a></li>
</body>
</html>
