<?php

use PHPMailer\PHPMailer\PHPMailer;

if (isset($_POST['name']) && !empty($_POST['name']) &&
  isset($_POST['email']) && !empty($_POST['email']) &&
  isset($_POST['subject']) && !empty($_POST['subject']) &&
  isset($_POST['message']) && !empty($_POST['message'])) {
  $name = $_POST['name'];
  $subject = $_POST['subject'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  require_once "PHPMailer/PHPMailer.php";
  require_once "PHPMailer/SMTP.php";
  require_once "PHPMailer/Exception.php";

  $mail = new PHPMailer();

  //SMTP Settings
  $mail->isSMTP();
  $mail->Host = "mail.smroudaki.ir";
  $mail->SMTPAuth = true;
  $mail->Username = "contact@smroudaki.ir";
  $mail->Password = "!eRf4n&01110110";
  $mail->Port = 465; // 587
  $mail->SMTPSecure = "ssl"; // tls

  //Email Settings
  $mail->isHTML(false);
  $mail->CharSet = "UTF-8";
  $mail->setFrom($email, $name);
  $mail->addAddress("contact@smroudaki.ir");
  $mail->Subject = $subject;
  $mail->Body = $message;

  if ($mail->send()) {
    $response = "success";
  } else {
    $response = "failed";
  }

  exit(json_encode(array("response" => $response)));
}

?>
