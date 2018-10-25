<!DOCTYPE html>
<html>
<body>

<?php
    $servername = "j43.ca";
    $username = "skaur767_sandy";
    $password = "iphone6s";
    $dbname = "skaur767_sandy";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO HighScore (name, score) " ;
    $sql .="VALUES (?, ? ) " ;

    if($statement = $conn->prepare($sql)){
        $statement->bind_param("si", $_POST["fname"], $_POST["score"]);

   
        $statement->execute();

        $sql = "SELECT * FROM HighScore ORDER BY score DESC LIMIT 10" ;
        $result = $conn->query($sql) or die("Query: ($sql) [problem]");
 echo $sql;
        if ($result->num_rows > 0) {
            // output data of each row
            $fields = mysqli_num_fields($result);

            while($row = $result->fetch_row()) {
                display("<tr>","\n");
                for ($i=0; $i < $fields; $i++) {
                    display("<td>", $row[$i] . "</td>");
                }
                display("</tr>","</br>");
            }

        } else {
            echo "0 results";
        }

       $statement->close();
    } else 
        echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;

   $conn->close();
    function display($tag,$value){
		echo $tag.$value;
	}
?>
</body>
</html>