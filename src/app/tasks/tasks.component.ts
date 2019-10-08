import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { UserDataService } from '../user-data.service';
import { OfflineDataService } from '../offline-data.service';

import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  status = 'ONLINE';
  isConnected = true;

  taskAddedOn: Boolean;
  goOnline: Boolean;
  onlineMode: Boolean;

  tasksForm: FormGroup;

  isSignedIn: Boolean;
  isLoading: Boolean;
  userName: String;

  loadedTasks = [];
  offlineTasks = [];

  constructor(private http: HttpClient, private router: Router, private userDataService: UserDataService, private offlineDataService: OfflineDataService, private connectionService: ConnectionService) { }

  ngOnInit() {    
    this.tasksForm = new FormGroup({
      'description': new FormControl(null)
    });

    this.isSignedIn = this.userDataService.isSignedIn ? this.userDataService.isSignedIn : false ;
    this.userName = this.userDataService.userDetails ? this.userDataService.userDetails['name'] : '';
    this.taskAddedOn = false;
    this.isLoading = false;
    this.goOnline = false;
    this.onlineMode = true;

    this.connectionService.monitor().subscribe( (isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      }
      else {
        this.status = "OFFLINE";
        this.goOnline = true;
        this.onlineMode = false;
      }
    });
  }


  fetchOfflineTasks() {
    this.isLoading = true;
    if(!this.offlineDataService.getOfflineTasks()){
      this.isLoading = false;
      this.goOnline = false;
      this.onlineMode = true;
      return;
    }

    this.http.post('https://bsviraj-task-manager.herokuapp.com/tasks',this.offlineDataService.getOfflineTasks())
    .pipe( map( res => {
      const tasksArray = [];
      for(const key in res){
        tasksArray.push({...res[key]})
      }

      tasksArray.forEach( (task) => {
        this.loadedTasks.forEach( (val, index) => {
          if(task.description === val.description){
            this.loadedTasks.splice(index, 1)
          }
        })
      })

      return tasksArray
    }))
    .subscribe( (tasks) => {
      this.loadedTasks.push(...tasks);
      this.myTimer(); 
      this.offlineTasks = [];
      this.offlineDataService.clearOfflineTasks();
      this.isLoading = false;
      this.goOnline = false;
      this.onlineMode = true;

    }, (error) => {
      this.isLoading = false;
      console.log(error['error']);
    });

  }

  myTimer = async () => {
    this.taskAddedOn = true;
    setTimeout( () => {
      this.taskAddedOn = false;
    },2000);
  }
  

  onSignIn() {
    this.router.navigate(['/signin']);
  }

  onSignOut() {
    if(!this.isConnected && !this.onlineMode){
      return;
    }
    this.http.post('https://bsviraj-task-manager.herokuapp.com/users/logout', {}).subscribe( (res) => {
      this.loadedTasks = [];
      localStorage.removeItem('userData');
      localStorage.removeItem('newTasksData');
      localStorage.removeItem('completedTasksData');
      this.userDataService.isSignedIn = false;
      this.isSignedIn = false;
      this.userDataService.userDetails = undefined;
      this.userDataService.authToken = undefined;
      this.offlineDataService.clearOfflineTasks();
    }, (error) => {
      console.log(error);
    });
  }

  onCreateTask() {
    
    if(!this.tasksForm.value.description){
     return undefined;
    }

    if(this.loadedTasks[0]){
      if(this.loadedTasks[0]['completed'])
      this.loadedTasks = [];
      this.loadedTasks = this.offlineDataService.getNewTasks();
    }

    if(this.status === 'OFFLINE'){
      this.loadedTasks.push({...this.tasksForm.value, completed: false});
      return this.offlineDataService.saveTaskOffline(this.tasksForm.value);
    }


    this.isLoading = true;

    this.http.post('https://bsviraj-task-manager.herokuapp.com/tasks', this.tasksForm.value).subscribe( (res) => {
      this.loadedTasks.push(res);
      this.myTimer(); 
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      console.log(error['error']);
    });
  }

  fetchNewTasks() {
    this.loadedTasks = [];
    if(this.status === 'OFFLINE'){
      return this.loadedTasks = this.offlineDataService.getNewTasks();
    }
    this.isLoading = true;
    this.http
    .get('https://bsviraj-task-manager.herokuapp.com/tasks?completed=false')
    .pipe( map( res => {
      const tasksArray = [];
      for(const key in res){
        tasksArray.push({...res[key]})
      }
      return tasksArray
    }))
    .subscribe( (tasks) => {
      this.isLoading = false;
      this.loadedTasks = tasks;
      this.offlineDataService.saveNewTasks(tasks);
    }, (error) => {
      this.isLoading = false;
      console.log(error['error']);
    });
    
  }

  fetchCompletedTasks() {
    this.isLoading = true;
    this.loadedTasks = [];

    this.http
    .get('https://bsviraj-task-manager.herokuapp.com/tasks?completed=true')
    .pipe( map( res => {
      const tasksArray = [];
      for(const key in res){
        tasksArray.push({...res[key]})
      }
      return tasksArray
    }))
    .subscribe( (tasks) => {
      this.loadedTasks = tasks;
      this.isLoading = false;
    }, (error) => {
      console.log(error['error']);
      this.isLoading = false;
    });

  }

  markCompleted(id, pos) {
    if(this.status === 'OFFLINE'){
      return ;
    }
    this.http.patch('https://bsviraj-task-manager.herokuapp.com/tasks/' + id, {
      "completed": "true"
    })
    .subscribe( (res) => {
      //code
    }, (error) => {
      console.log(error['error']);
    });

    this.loadedTasks.splice(pos, 1);
  }


  deleteTask(id, pos) {
    if(this.status === 'OFFLINE'){
      return ;
    }
    this.http.delete('https://bsviraj-task-manager.herokuapp.com/tasks/' + id)
    .subscribe( (res) => {
      //code
    }, (error) => {
      console.log(error['error']);
    });

    this.loadedTasks.splice(pos, 1);
  }


  // offlineDeleteTask(id, pos){
  //   this.offlineDataService.deleteofflineTask(id, this.loadedTasks[pos]);
  //   this.loadedTasks.splice(pos, 1);
  //   console.log(this.loadedTasks);
  // }

}
