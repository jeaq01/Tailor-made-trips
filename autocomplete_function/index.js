<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>City Search</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
        }
        input[type='text'], button {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
        }
        .suggestions {
            border: 1px solid #ccc;
            max-height: 150px;
            overflow-y: auto;
        }
        .suggestion-item {
            padding: 10px;
            cursor: pointer;
        }
        .suggestion-item:hover {
            background-color: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <input type="text" id="city-search" placeholder="Enter a city">
        <div id="suggestions" class="suggestions"></div>
        <button id="search-button">Search</button>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets/js/script.js"></script>
</body>
</html>

