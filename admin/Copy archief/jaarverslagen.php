<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>BALANS</title>
    <script src="admin.js"></script>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open Sans">
    <link rel="stylesheet" type="text/css" href="../style/admin.css">
    <link rel="stylesheet" type="text/css" href="jaarverslag.css">
</head>
<body>
    <button onclick='console.log(window.parent);window.parent.frames["verslag"].focus();window.parent.frames["verslag"].print();'>Print</button>
    <?php
        for ($jaar = 2017; $jaar >= 2014; $jaar--) {
            echo "<h1>$jaar</h1>";
            foreach (array("Alicon Projects BV","Alicon Systems BV","MJVK Beheer BV") as $bedrijf) {
                echo "<p>";   
                echo "<a target='verslag' href='jaarverslag.php?bedrijf=$bedrijf&jaar=$jaar'>$bedrijf $jaar</a> ";   
                echo "<a target='verslag' href='jaarverslag.php?bedrijf=$bedrijf&jaar=$jaar&toe'>[TOE]</a> ";   
                echo "<a target='verslag' href='jaarverslag.php?bedrijf=$bedrijf&jaar=$jaar&save'>[SAVE]</a> ";   
                echo "</p>";   
            }
        } 
    ?>
</body>
</html>
