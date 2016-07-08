var app = require('express')();
var http = require('http').Server(app);
var port = 3636;
var io = require('socket.io')(http);
var b = require('bonescript');
var a = 0;
var t;
var fs = require('fs');
var dt = new Date();
var Out=0;
var filename;
var mornigc=0;
var noonc=0;
var nightc=0;
var ledRed = "P9_14";
var ledGreen = "P8_19";
today = new Date();

today_year = today.getFullYear(); //�褸�~��

today_month = today.getMonth()+1; //�@�~�����ĴX��

today_date = today.getDate(); //�@��������ĴX��

today_hours = today.getHours()+8; //�@�Ѥ����p�ɼ�
if(today_hours>23)
{
  today_date=today_date+1;
  today_hours=today_hours-24;
}

today_minutes = today.getMinutes(); //�@�Ѥ�������

today_seconds = today.getSeconds(); //�@�Ѥ������

var CurrentDate = today_year+"�~"+today_month+"-"+today_date+"  "+today_hours+":"+today_minutes+":"+today_seconds;



b.pinMode('USR0', 'out');
b.pinMode('USR1', 'out');
b.pinMode('USR2', 'out');
b.pinMode('USR3', 'out');
b.pinMode(ledRed, b.OUTPUT);
b.pinMode(ledGreen, b.OUTPUT);
app.get('/', function(req, res){
   res.sendFile(__dirname + '/index07.html');
});
var s = function()
    {
      b.digitalWrite('USR0', a);
      b.digitalWrite('USR1', ~a);
      b.digitalWrite('USR2', a);
      b.digitalWrite('USR3', ~a);
      a=~a;
      //setInterval(s(t), t*100 );
    }
    
io.on('connection', function(socket){
  ms=0;
 socket.on('Flag',function(ms){
   console.log('�n�X�J����: ' + ms);
   io.emit('Flag',ms);
   if(ms=='1')
   {
        socket.on('GJ', function(msg){
              
              io.emit('GJ',msg);
              
              socket.on('J', function(msga){
              console.log('msga: ' + msga);
              io.emit('J',msga);
              msg = msg.concat(msga);
              console.log('msg: ' + msg);
             
              
              led(1,0);
              console.log('�ϥΪ̦^��: ' + msg);
              clearInterval(t);
              t = setInterval(s, msg*100 );
              CurrentDate = msg+":"+today_year+"�~"+today_month+"��"+today_date+"��"+today_hours+"��"+today_minutes;
              fs.readFile("record.txt",function(error, content){ //Ū��file.txt�ɮת����e
                                    if(error){ //�p�G�����~�N�C�L�T�������}�{��
                                                console.log('�ɮ�Ū�����~�C');
                                                
                                                
                                            }
                                    else {  
                                            var count=parseInt(content);
                                            
                                            count=count+1;
                                            
                                            // var currentrecord="������:"+count;
                                            fs.writeFile("record.txt", count, function(err) {
                                                      if(err) {
                                                                console.log(err);
                                                              } 
                                                      else    {
                                                                console.log("The count was saved!");
                                                                console.log(count);
                                                              }
                                                      });
                                          }
                                        });
              
              console.log(CurrentDate);
              fs.writeFile(msg, CurrentDate, function(err) {
                                                      if(err) {
                                                                console.log(err);
                                                              } 
                                                      else    {
                                                                console.log("The file was saved!");
                                                                console.log(CurrentDate);
                                                              }
                                                      });
        });
    });
           msga=null;
         msg=null;
   }
  else if(ms=='0')
  {
    socket.on('GJ', function(msg){
                                  io.emit('GJ',msg);
                                  socket.on('J', function(msga){
                                  io.emit('J',msga);
                                  msg = msg.concat(msga); 
                                  
                                  console.log('�}�ɦ^��: ' + msg);
                                  clearInterval(t);
                                  t = setInterval(s, msg*100 );
                                  
                                  fs.readFile(msg,function(error, content){ //Ū��file.txt�ɮת����e
                                    if(error){ //�p�G�����~�N�C�L�T�������}�{��
                                                console.log('�ɮ�Ū�����~�C');
                                                
                                                led(1,1);
                                            }
                                    else {
                                            console.log(content.toString());
                                            var str=content.toString();
                                            var msglen=msg.length;
                                            console.log(msg.length);
                                            
                                            
                                            led(0,1);
                                            var outY =Math.abs(str.substring(str.indexOf(":")+1,str.indexOf("�~"))- today.getFullYear());
                                            console.log('�~: '+outY);
                                            
                                            var outM =Math.abs(str.substring(str.indexOf("�~")+1,str.indexOf("��"))-today.getMonth() - 1);
                                            console.log('��: '+outM);
                                            
                                            var outD =Math.abs(str.substring(str.indexOf("��")+1,str.indexOf("��"))- today.getDate());
                                            console.log('��: '+outD);
                                            
                                            var outH =Math.abs(str.substring(str.indexOf("��")+1,str.indexOf("��"))- today.getHours()-8);
                                            console.log('�p��: '+outH);
                                            
                                            var outMin =Math.abs(str.substring(str.indexOf("��")+1)- today.getMinutes());
                                            if(Math.abs(outMin>0))outMin=1;
                                            console.log('��: '+Math.abs(str.substring(str.indexOf("��")+1)- today.getMinutes()));
                                            
                                            Out = outY*365*24+outM*30*24+outD*24+outH+outMin;
                                            console.log('�`�ɼ�: '+Out);
                                            console.log('�{�b�ɶ�: '+dt);
                                          }
                                        });
                                    });
                                  });
                                  msga=null;
                                  msg=null;   
    
  }  
    
    });
});
  
io.on('connection', function(socket) {
  setInterval(function() {
    socket.emit('date', {'date': '�����ɼ�:'+Out+' �`�O��:'+ 30*Out +'��'});
    Out=0;
  }, 1000);
  
});
  
function led(green,red) 
{
b.analogWrite(ledRed, red);
b.analogWrite(ledGreen, green);  
}

  
http.listen(port, function(){
  console.log('listening on *' + port);
});