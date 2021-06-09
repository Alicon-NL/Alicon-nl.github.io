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
function doc($path, $row, $level, $i, $chapters, $parent = null, $namepath = '') {
  global $sidebar,$dir,$done;
  foreach ($row as $key => $item) {
    $title = $key;
    $name = str_replace(' ','-',$key);
    $name = str_replace('Home-','',$namepath . $name);

    echo "$name\n";

    if (isset($done[$path.$name])) {
      echo 'DUBBEL = '.$path.$name.PHP_EOL;
      continue;
    }
    $done[$path.$name] = 1;
    // $line1 = array_shift($item);

    if (is_file($fname = "$path/$name.md")) {
      $content = trim(str_replace("\r","",preg_replace([
        '/<!-- START .*? END -->/s',
        '/<!-- DOCGEN START .*? DOCGEN END -->/s',
        '/<!-- CHAPTER START -->.*?<!-- CHAPTER END -->/s'
      ],'',file_get_contents($fname))));

      // $content = preg_replace('/^(\d+\. )/m','# ',$content);
      $content = preg_replace('/^(\d+\.\d+\. )/m','## ',$content);
      $content = preg_replace('/^(\d+\.\d+\.\d+\. )/m','### ',$content);
      $content = preg_replace('/^(\d+ )/m','# ',$content);
      $content = preg_replace('/^(\d+\.\d+ )/m','## ',$content);
      $content = preg_replace('/^(\d+\.\d+\.\d+ )/m','### ',$content);

      $content = preg_replace('/<h1.*?>(.*?)<\/h1>/','# $1',$content);
      $content = preg_replace('/<h2.*?>(.*?)<\/h2>/','## $1',$content);
      $content = preg_replace('/<h3.*?>(.*?)<\/h3>/','### $1',$content);
      $content = preg_replace('/<h4.*?>(.*?)<\/h4>/','#### $1',$content);
      $content = preg_replace('/<img.*?src="(.*?)".*?>/','![$1]($1)',$content);
      $content = preg_replace('/\t/','  ',$content);
      $content = preg_replace('/<p.*?>(.*?)<\/p>/s',"$1\n\n",$content);
      $content = preg_replace('/<br>/',"  ",$content);
      $content = preg_replace_callback('/<ol.*?>(.*?)<\/ol>/s', function($matches) {
        return preg_replace('/  <li.*?>(.*?)<\/li>/s',"1. $1",$matches[1]);
      }, $content);
      $content = preg_replace_callback('/<ul.*?>(.*?)<\/ul>/s', function($matches) {
        return preg_replace('/  <li.*?>(.*?)<\/li>/s',"- $1",$matches[1]);
      }, $content);
      $content = preg_replace('/<\/.+?>|&nbsp;/','',$content);

      $title = preg_replace('/.*?# /','',$content);
      $title = preg_replace('/\n.*/','',$title);
    } else {
      $content = "# $title\n\n";
    }

    // $line1 = preg_replace('/.*?# .*?\n/','',$line1);
    // array_unshift($line1,$item);

    $menutitle = $title;
    if ($parent) {
      $menutitle = implode(' ', array_diff(preg_split('/ /',$title),preg_split('/ /',array_key_first($parent))));
      // debug(array_diff(explode(' ',$menutitle),explode(' ',array_key_first($parent))));
    }


    $sidebar .= str_repeat('  ',$level)."- [$menutitle]($name)\n";

    $chaptercontent = "## [$title]($name)\n\n";

    $nav = [];

    // if ($parent) {
    //   $link = str_replace(' ','-',$key = array_key_first($parent));
    //   $content .= "<a class='up' href='$link'>$key</a>\n";
    // }
    if (isset($chapters[$i-1])) {
      $link = $namepath . str_replace(' ','-',$key = array_key_first($chapters[$i-1]));
      $nav[] = "<a href='$link' class='prev'><span>←</span> <small>$key</small></a>";
    }
    if (isset($chapters[$i+1])) {
      $link = $namepath . str_replace(' ','-',$key = array_key_first($chapters[$i+1]));
      $nav[] = "<a href='$link' class='next'><small>$key</small> <span>→</span></a>";
    }
    foreach (['png','jpg','gif'] as $ext) {
      if (file_exists("$path/img/$name.$ext")) {
        // echo "$path/img/$name.png\n";
        $img = "<!-- START -->\n\n![$title](img/$name.$ext)\n\n<!-- END -->\n\n";
        $chaptercontent .= "[![$title](img/$name.$ext)]($name)\n";
        break;
      }
    }
    if ($nav) {
      $nav = "\n\n<!-- START --><nav class='doctop'>".implode("<span> | </span>",$nav)."</nav><!-- END -->\n\n";
      // die($content);
    }
    // echo "$img\n";
    $content = preg_replace(
      '/^(# .*?\n)/',
      '$1' . ($nav ? $nav : '') . $img,
      $content
    );
    // $content = preg_replace(
    //   '/^(# .*\n)/',
    //   '$1' . ($nav ? $nav : '') . $img,
    //   $content
    // );

    // $content .= $nav;

    foreach ($item as $i => $line) {
      if (is_string($line)) {
        // if (is_file($fname = "$path/".str_replace(' ','-',$line).".md")) {
          $item[$i] = [
            // 'a' => file_get_contents($fname),
            $line => [],//array_filter(explode("\n\n",str_replace("\r","",preg_replace(['/<!-- START .*? END -->/s', '/<!-- DOCGEN START .*? DOCGEN END -->/s', '/<!-- CHAPTER START -->.*?<!-- CHAPTER END -->/s'],'',file_get_contents($fname))))),
          ];
          // debug($fname, $i, $item);
        // }
      }
    }

    // $content .= implode("\n\n", array_filter($item, is_string));
    // $content .= "\n\n";

    if (!empty($chapters = array_filter($item, is_array))) {
      $content .= "\n\n<!-- START -->\n\n";
      foreach ($chapters as $i => $chapter) {
        $content .= doc($path, $chapter, $level+1, $i, $chapters, $row, $name . '-')."\n\n";
      }
      $content .= "\n<!-- END -->";
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
    // if (is_file($fname = "$path/$name.md")) die($content);
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
  // echo $path.PHP_EOL."===============".PHP_EOL.$sidebar.PHP_EOL;
  file_put_contents("$path/_Sidebar.md", $sidebar);
}
