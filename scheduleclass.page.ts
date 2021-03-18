import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-scheduleclass',
  templateUrl: './scheduleclass.page.html',
  styleUrls: ['./scheduleclass.page.scss'],
})
export class ScheduleclassPage implements OnInit {

  public fetchedteachers: any;
  // public fetchedteacher1: any;
  public loginUID: any;
  deviceid: any;

  constructor(public http: HttpClient,public toastController: ToastController) { 
    this.loginUID = localStorage.getItem("loginUID");
    firebase.database().ref("scheduledclass").once("value",data=>{
      console.log(data.val());
      this.fetchedteachers = this.fetchInnerSnapshot(data);

    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

  fetchInnerSnapshot(snap){
    let returnArray = [];
    snap.forEach(element => {
      let item = element.val();
      item.key = element.key;
      console.log(item.teacherid);
      firebase.database().ref("usernode").child(item.teacherid).on("value",data=>{
        console.log(data.val().name);
        item.teachername = data.val().name;
      })
      returnArray.push(item);
    });
    console.log(returnArray);
    return returnArray;
  }

  join(item){
    
    console.log(item);
    firebase.database().ref("class_join").child(item.key).orderByChild("studentid").equalTo(this.loginUID).once("value",data=>{
      console.log(data.val());
     // if()
     if(data.val()==null){

      firebase.database().ref("usernode").child(item.teacherid).once("value",data=>{
        this.deviceid = data.val().NotificationID;
        console.log(this.deviceid);
      })
      var body = {
        device_id: this.deviceid,
        title: "new student joined",
        message: "welcome"
      }
      this.http.post('https://chatapp892.herokuapp.com/send_to_user',body).subscribe( res => {
          console.log(res)
    
            console.log(item);
            firebase.database().ref("scheduledclass").child(item.key).update({
              availableseat: item.availableseat - 1,
            });
            firebase.database().ref("scheduledclass").once("value",data=>{
              console.log(data.val());
              this.fetchedteachers = this.fetchInnerSnapshot(data);
        
            });
            console.log(item.key);
           
            firebase.database().ref("class_join").child(item.key).push({
             // classid: item.key,
              studentid: this.loginUID,
              teacherid: item.teacherid
            }).then(data=>{
              console.log("class joined");
            })
        })
  



     }else{
      this.presentToast("You already Joined")
     }
    })
    
       
  }

  

}
