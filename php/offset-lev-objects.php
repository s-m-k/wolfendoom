<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	</head>
	<body>

<?php
	$offset_x = (isset($_REQUEST['offset_x']) ? $_REQUEST['offset_x'] : isset($_POST['offset_x']) ? $_POST['offset_x'] : 0);
	$offset_y = (isset($_REQUEST['offset_y']) ? $_REQUEST['offset_y'] : isset($_POST['offset_y']) ? $_POST['offset_y'] : 0);

	echo 'x: '.$offset_x.' y: '.$offset_y."\n";
	//print_r($_POST);
	function update_vec($matches)
	{
		return $matches[1].'('.($matches[2] + $GLOBALS['offset_x']).($matches[3]).', '.($matches[4] + $GLOBALS['offset_y']).$matches[5].$matches[6];
	}

	function offset($content)
	{
		$exp = '/(\w+)\((\d+)(.*?),\s*(\d+)(.*?)([\s|\)|,])/';

		$new_content = preg_replace_callback(
			$exp,
			function ($matches) 
			{
				return update_vec($matches);
			},
			$content
		);

		return $new_content;
	}
	
	if (isset($_REQUEST['lev']))
	{
		$test = array
		(
			'vec(666,666)',
			'vec(666, 666)',
			'vec(666 + y,666 + x * szatan)',
			'vec(666 + y,666 + x * szatan )',
			'vec(666 + y,666 + x * szatan, somt, somt)',
			'vec(666 + y, 666 + x * szatan , somt, somt)',
			'vec(166 + 2 * i, 323 + (i % 3))'
		);

		$test = implode("\n", $test);

		$lev = file_get_contents('../dev/js/game/stages/'.$lev.'.js');

		$offset_lev = offset($lev);

		echo $offset_lev;
	} 

	if (isset($_POST['content']))
	{
		if ( ! isset($_POST['offset_x']))
		{
			$_POST['offset_x'] = 0;
		}

		if ( ! isset($_POST['offset_y']))
		{
			$_POST['offset_y'] = 0;
		}

		//echo $_POST['offset_x'].':'.$_POST['offset_y'];

		$offset_lev = offset($_POST['content']);

		echo $offset_lev;

	}

?>
	<form method="POST" action="offset-lev-objects.php">
		<fieldset>
			<label>
				<span>Shit to offset</span>
				<textarea name="content"></textarea>
			</label>
			<label>
				<span>x</span>
				<input type="text" name="offset_x" />
			</label>
			<label>
				<span>y</span>
				<input type="text" name="offset_y" />
			</label>

			<button type="submit">submit</button>
		</fieldset>
	</form>
	</body>
</html>