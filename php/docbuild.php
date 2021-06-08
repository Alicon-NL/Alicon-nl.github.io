<?php
function debug() {
  header('Content-Type: application/json');
  $t = round(microtime(true)*1000-__startTime);
  $arg_list = func_get_args();
  $bt = debug_backtrace();
  extract($bt[0]);
  extract(array_merge($bt[0],parse_url($bt[0]['file']),pathinfo($bt[0]['file'])));
  $line = "$basename:$line ";
  if ($bt[1]['class']) $line .= $bt[1]['class'].".";
  if ($bt[1]['function']) $line .= $bt[1]['function'];
  array_unshift ($arg_list, $line . " $t ms");
	header('Content-Type: application/json');
	die(json_encode($arg_list,JSON_PRETTY_PRINT,JSON_UNESCAPED_SLASHES));
}
$data = yaml_parse_file('docbuild.yaml');
function doc($path, $row, $level, $i, $chapters, $parent = null) {
  global $sidebar,$dir,$done;
  foreach ($row as $key => $item) {
    $name = str_replace(' ','-',$key);
    if (isset($done[$path.$name])) {
      echo 'DUBBEL = '.$path.$name.PHP_EOL;
      continue;
    }
    $done[$path.$name] = 1;
    $line1 = array_shift($item);
    $title = preg_replace('/.*?# /','',$line1);
    $title = preg_replace('/\n.*/','',$title);

    $line1 = preg_replace('/.*?# .*?\n/','',$line1);
    array_unshift($line1,$item);

    $menutitle = $title;
    if ($parent) {
      $menutitle = implode(' ', array_diff(preg_split('/ /',$title),preg_split('/ /',array_key_first($parent))));
      // debug(array_diff(explode(' ',$menutitle),explode(' ',array_key_first($parent))));
    }


    $sidebar .= str_repeat('  ',$level)."- [$menutitle]($name)\n";

    $content = "# $title\n\n";
    $chaptercontent = "## [$title]($name)\n\n";

    $nav = [];

    // if ($parent) {
    //   $link = str_replace(' ','-',$key = array_key_first($parent));
    //   $content .= "<a class='up' href='$link'>$key</a>\n";
    // }
    if (isset($chapters[$i-1])) {
      $link = str_replace(' ','-',$key = array_key_first($chapters[$i-1]));
      $nav[] = "<a href='$link' class='prev'><span>←</span> <small>$key</small></a>";
    }
    if (isset($chapters[$i+1])) {
      $link = str_replace(' ','-',$key = array_key_first($chapters[$i+1]));
      $nav[] = "<a href='$link' class='next'><small>$key</small> <span>→</span></a>";
    }
    if ($nav) {
      $nav = "\n\n<!-- START -->\n<nav class='doctop'>\n".implode("\n<span> | </span>\n",$nav)."\n</nav>\n<!-- END -->";
    }

    // $content .= $nav;

    if (file_exists("C:".$path."/img/$name.png")) {
      $content .= "<!-- START -->\n\n![$title](img/$name.png)\n\n<!-- END -->\n\n";
      $chaptercontent .= "[![$title](img/$name.png)]($name)\n";
    }
    else if (file_exists("C:".$path."/img/$name.jpg")) {
      $content .= "<!-- START -->\n\n![$title](img/$name.jpg)\n\n<!-- END -->\n\n";
      $chaptercontent .= "[![$title](img/$name.jpg)]($name)\n";
    }
    foreach ($item as $i => $line) {
      if (is_string($line)) {
        if (is_file($fname = "$path/".str_replace(' ','-',$line).".md")) {
          $item[$i] = [
            // 'a' => file_get_contents($fname),
            $line => array_filter(explode("\n\n",str_replace("\r","",preg_replace(['/<!-- START .*? END -->/s', '/<!-- DOCGEN START .*? DOCGEN END -->/s', '/<!-- CHAPTER START -->.*?<!-- CHAPTER END -->/s'],'',file_get_contents($fname))))),
          ];
          // debug($fname, $i, $item);
        }
      }
    }
    $content .= implode("\n\n", array_filter($item, is_string));
    if (!empty($chapters = array_filter($item, is_array))) {
      $content .= "\n<!-- START -->\n";
      foreach ($chapters as $i => $chapter) {
        $content .= doc($path, $chapter, $level+1, $i, $chapters, $row)."\n\n";
      }
      $content .= "<!-- END -->";
    }
    if ($nav) {
      $content .= $nav;
    }
    $content = str_replace("\n\n\n","\n\n",$content);
    $content = str_replace("\n\n\n","\n\n",$content);
    $content = str_replace("\n\n\n","\n\n",$content);
    $content = str_replace("\n\n\n","\n\n",$content);
    // debug($item);
    // echo "=================\n$path/$name.md\n=================\n$content\n\n";
    // die();
    $old = file_get_contents($fname = "$path/$name.md");
    if ($old !== $content) {
      file_put_contents("$path/$name.md", $content);
    }
    return "$chaptercontent".(is_string($item[0]) ? $item[0] : "")." [Lees verder...]($name)";
  }
}
foreach ($data as $path => $domain) {
  $dir = array_values(array_filter(scandir($path), function($name){return $name[0]!=='.';}));
  // $dir = array_map(function($name){return preg_split('/-/', $name);}, $dir);
  $sidebar = '';
  foreach ($domain as $i => $item) {
    doc($path, $item, 0, $i, $domain);
  }
  // debug($sidebar);
  header('Content-Type: text/plain; charset=us-ascii');
  echo $path.PHP_EOL."===============".PHP_EOL.$sidebar.PHP_EOL;
  file_put_contents("$path/_Sidebar.md", $sidebar);
}
