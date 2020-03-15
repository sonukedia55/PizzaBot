<?php
include('../connection.php');

$rty = $_POST['type'];


$pizty = [['Fresh Veggie',120,220,340],['Veg Paneer Loaded',140,220,400],['Veg Paradise',180,300,500],['Cheese Corn',120,220,290]];
$pis = ['','Regular','Medium','Large'];
$ost = ['','Order Placed','Preparing','Out for delivery','Delivered'];


if($rty=="addorder"){
  $pizid = $_POST['pizzid'];
  $pizsz = $_POST['pizzsz'];
  $pizqt = $_POST['pizzqt'];
  //$pizex = explode(',',$_POST['pizzex']); //0 = Noting , 1 = Extra cheese , No fresh pan , 2 = Extra cheese / fresh pan

  $uadd = $_POST['uadd'];
  $umob = $_POST['umob'];

  $tm = date('d/M/y H:i');
  $done = 0;

  $sad = mysqli_query($connection,"insert into u_pizza_ord values(NULL,'$umob','$uadd',1,'$tm')"); //id uname umob uadd ostat time
  $oid = mysqli_insert_id($connection);
  $odvl = [];
  /*
  for($i=0;$i<sizeof($pizid);$i++){
    $pzid = $pizid[$i];$pzs = $pizsz[$i];$pizam = $pizamt[$i];$pize = $pizex[$i];
    $vls = "(NULL,'$oid','$pzid','$pzs','$pizam','$pize')";
    array_push($odvl,$vls);
  }
  */
  $qrst = "insert into u_pizza_ord_det values(NULL,'$oid','$pizid','$pizsz','$pizqt')";
  $sad = mysqli_query($connection,$qrst); //id oid pid psz pamt pex

  if($sad){
    $done=$oid;
  }
  echo $done;

}

if($rty=="orderdet"){

  $oid = (int)$_POST['oid'];
  $done = 0;

  $out = '<div class="text">
        <b><u>OrderID : '.$oid.'</u></b><br>';


  $sad = mysqli_query($connection,"select * from u_pizza_ord_det where oid='$oid'"); //id uname umob uadd ostat time
  while($rr = mysqli_fetch_array($sad)){
    $done = 1;
    $out.='<b>'.$pizty[$rr['pid']-1][0].'</b> - '.$pis[$rr['psz']].' - '.$rr['pamt'].' Pcs<br>';
    $tot = $pizty[$rr['pid']-1][$rr['psz']]*$rr['pamt'];
    $out.=' <b>Total </b>: ₹'.$tot.'<br>';

  //  array_push($pizid,array("pid"=>$rr['pid'],"psz"=>$rr['psz'],"pamt"=>$rr['pamt'],"pex"=>$rr['pex']));
  }
  $sad = mysqli_query($connection,"select * from u_pizza_ord where id='$oid'"); //id uname umob uadd ostat time
  while($rr = mysqli_fetch_array($sad)){
    $out.='<table class="table"><tr><td><b>Customer: </b>'.$rr['uadd'].' </td><td> <b>Phone: </b> '.$rr['phone'].'  </td><td> <b>Time: </b> '.$rr['times'].' </td></tr></table>
      <b>Progress: </b>'.$ost[$rr['status']].'!<br>';
  }
  if($done==0)$out.='No order found for ORDER ID : '.$oid;
  $out.='<br>
  </div>';
  echo $out;
}
/*

if($rty=="orderdetall"){
  $pizid = [];$fnar = [];

  $odst = 0;$tm =0;$add = '';
  $done = 0;

  $sad = mysqli_query($connection,"select * from u_pizza_ord"); //id uname umob uadd ostat time
  $rr = mysqli_fetch_array($sad){
    $oid = $rr['id'];
    $odst = $rr['status'];$tm = $rr['times'];$add = $rr['uadd']." - PH ".$rr['phone'];
    $sad2 = mysqli_query($connection,"select * from u_pizza_ord_det where oid='$oid'"); //id uname umob uadd ostat time
    $rr2 = mysqli_fetch_array($sad2){
      array_push($pizid,array("pid"=>$rr['pid'],"psz"=>$rr['psz'],"pamt"=>$rr['pamt'],"pex"=>$rr['pex']));
    }
    array_push($fnar,array("odid"=>$oid,"odst"=>$odst,"odtm"=>$tm,"odad"=>$add,"odet"=>$pizid));
  }

  echo json_encode($fnar);
}

if($rty=="uporderstatus"){

  $oid = (int)$_POST['oid'];
  $nst = (int)$_POST['status'];
  $done = 0;

  $sad = mysqli_query($connection,"select * from u_pizza_ord where id='$oid'"); //id uname umob uadd ostat time
  $rr = mysqli_fetch_array($sad){
    $sad2 = mysqli_query($connection,"update u_pizza_ord set status='$nst' where id='$oid'");
    if($sad2)$done=1;
  }

  echo json_encode(array("done"=>$done));
}

*/


mysqli_close($connection);
?>
