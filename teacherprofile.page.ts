import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-teacherprofile',
  templateUrl: './teacherprofile.page.html',
  styleUrls: ['./teacherprofile.page.scss'],
})
export class TeacherprofilePage implements OnInit {
  pet:string = 'Profile';
  public loginUID:any;
  public user:any={
    name:""
  };
  
  constructor(public router: Router,public plt: Platform) {
    this.loginUID=localStorage.getItem("loginUID");
    console.log(this.loginUID);
    firebase.database().ref("usernode/"+this.loginUID).once("value",data=>{
	  console.log(data.val());
	  this.user.name=data.val().name;
	  this.user.address=data.val().address; 
	  
	  this.user.age=data.val().age;
	  this.user.mobile_number=data.val().contactno;
	  this.user.email=data.val().email;
    })
    if (this.plt.is('cordova')) {
      this.notification();
    }
	}
  chatlist() {
    this.router.navigateByUrl('/chatlist');
  }
  call() {
    this.router.navigateByUrl('/call');
  }
  notification1(){
    this.router.navigateByUrl('/notification');
  }
  ngOnInit() {
  //   this.loginUID=localStorage.getItem("loginUID");
  //   console.log(this.loginUID);
  // firebase.database().ref("usernode").child(this.loginUID).once("value",data=>{
	//   console.log(data.val());
	//   this.user.name=data.val().name;
	//   this.user.address=data.val().address; 
	  
	//   this.user.age=data.val().age;
	//   this.user.mobile_number=data.val().contactno;
	//   this.user.email=data.val().email;
	  
	  
  // })
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  notification() {
    let base = this;
    var notificationOpenedCallback = function (jsonData) {
        var str = JSON.stringify(jsonData);
        var jsnData = JSON.parse(str);
        console.log("jsnData", jsnData.notification.payload.additionalData);

        // this.events.publish('calling', jsnData.notification.payload.additionalData);


    };

    window["plugins"].OneSignal
        .startInit("d033e96a-5d25-4e45-a983-8a724b97acb8", "297081844767")
        .handleNotificationOpened(notificationOpenedCallback)
        .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
        .endInit();

    window["plugins"].OneSignal.getPermissionSubscriptionState(function (status) {
        var idapp = status.subscriptionStatus.userId;
        localStorage.setItem("my_notification_id", idapp);
        firebase.database().ref('/usernode/' + base.loginUID).update({
            NotificationID: idapp,
        });
        if (idapp == null) {
            base.notification()
        }
    });
  }

}
