import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  taskAddedOn: Boolean;

  tasksForm: FormGroup;

  isSignedIn: Boolean;
  isLoading: Boolean;
  userName: String;

  loadedTasks = [];

  authHeader: HttpHeaders;

  constructor(private http: HttpClient, private router: Router, private userDataService: UserDataService) { }

  ngOnInit() {    
    this.tasksForm = new FormGroup({
      'description': new FormControl(null)
    });

    this.isSignedIn = this.userDataService.isSignedIn ? this.userDataService.isSignedIn : false ;
    this.userName = this.userDataService.user ? this.userDataService.user['name'] : '';
    this.taskAddedOn = false;
    this.isLoading = false;
    this.authHeader = new HttpHeaders(
        { "Authorization" : "Bearer " + this.userDataService.authToken }
    );
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
    this.http.post('https://bsviraj-task-manager.herokuapp.com/users/logout', {}, {
      headers: this.authHeader
    }).subscribe( (res) => {
      this.loadedTasks = [];
      this.isSignedIn = false;
      this.userDataService.user = undefined;
      this.userDataService.authToken = undefined;
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
    }

    this.http.post('https://bsviraj-task-manager.herokuapp.com/tasks', this.tasksForm.value, {
      headers: this.authHeader
    }).subscribe( (res) => {
      this.loadedTasks.push(res);
      this.myTimer();    
    }, (error) => {
      console.log(error['error']);
    });
  }

  fetchNewTasks() {
    this.isLoading = true;
    this.http
    .get('https://bsviraj-task-manager.herokuapp.com/tasks?completed=false',  {
      headers: this.authHeader
    })
    .pipe( map( res => {
      const tasksArray = [];
      for(const key in res){
        tasksArray.push({...res[key]})
      }
      return tasksArray
    }))
    .subscribe( (tasks) => {
      this.loadedTasks = tasks;
    }, (error) => {
      console.log(error['error']);
    });

    this.isLoading = false;
    
  }

  fetchCompletedTasks() {
    this.isLoading = true;

    this.http
    .get('https://bsviraj-task-manager.herokuapp.com/tasks?completed=true',  {
      headers:this.authHeader
    })
    .pipe( map( res => {
      const tasksArray = [];
      for(const key in res){
        tasksArray.push({...res[key]})
      }
      return tasksArray
    }))
    .subscribe( (tasks) => {
      this.loadedTasks = tasks;
    }, (error) => {
      console.log(error['error']);
    });

    this.isLoading = false;
  }

  markCompleted(id, pos) {
    this.http.patch('https://bsviraj-task-manager.herokuapp.com/tasks/' + id, {
      "completed": "true"
    }, {
      headers: this.authHeader
    })
    .subscribe( (res) => {
      //code
    }, (error) => {
      console.log(error['error']);
    });

    this.loadedTasks.splice(pos, 1);
  }


  deleteTask(id, pos) {
    this.http.delete('https://bsviraj-task-manager.herokuapp.com/tasks/' + id, {
      headers: this.authHeader
    })
    .subscribe( (res) => {
      //code
    }, (error) => {
      console.log(error['error']);
    });

    this.loadedTasks.splice(pos, 1);
  }

}
