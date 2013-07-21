<?php
	
	$target = $_GET['target'];
	
	switch($target) {

		case "appStructure":
			$title = "App Structure";
			$body = "structure.html";
		break;
		
		case "core":
			$title = "Core";
			$body = "core.html";
		break;
		
		case "libraries":
			$title = "Libraries";
			$body = "libraries.html";
		break;
		
		case "modules":
			$title = "Modules";
			$body = "modules.html";
		break;
		
		case "templates":
			$title = "Templates";
			$body = "templates.html";
		break;
		
		default:
			$title = "Overview";
			$body = "overview.html";
		break;
		
	}

?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><?php echo $title; ?> · Developer · Didgeridoo DOCS</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="Francisco Mendez Vilas">

		<!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
		<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

		<!-- Le styles -->
		<link href="../css/bootstrap.min.css" rel="stylesheet">
		<link href="../css/bootstrap-responsive.css" rel="stylesheet">
		<link href="../css/prettify.css" rel="stylesheet">
		<link href="../css/docs.css" rel="stylesheet">

	</head>

	<body onload="prettyPrint();">

		<div class="navbar">
			<div class="navbar-inner">
				<div class="container-fluid">
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </a>
					<a class="brand" href="../index.php"></a>
					<div class="nav-collapse">
						<ul class="nav">
							<li class="active">
								<a href="#">Home</a>
							</li>
							<li>
								<a href="#about">About</a>
							</li>
							<li>
								<a href="#contact">Contact</a>
							</li>
						</ul>
					</div><!--/.nav-collapse -->
				</div>
			</div>
		</div>

		<div class="container-fluid">
			<div class="row-fluid">
				<?php
					include "sidebar.php";
					include $body;
				?>