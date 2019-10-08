import { Injectable } from '@angular/core';

@Injectable( {providedIn: 'root'})
export class OfflineDataService {

    private newTasks: [{
        _id: string,
        description: string,
        completed: boolean,
        owner: string,
        createdAt: string,
        updatedAt: string,
        __v: number
    }];

    private completedTasks: [{
        _id: string,
        description: string,
        completed: boolean,
        owner: string,
        createdAt: string,
        updatedAt: string,
        __v: number
    }];

    private offlineTasks = [];

    // private deletedTasks = [];

    saveNewTasks(tasksData) {
        this.newTasks = tasksData;
        localStorage.setItem('newTasksData', JSON.stringify(tasksData));
    }

    saveCompletedTasks(tasksData) {
        this.completedTasks = tasksData;
        localStorage.setItem('completedTasksData', JSON.stringify(tasksData));
    }

    saveTaskOffline(taskData){
        this.offlineTasks.push(taskData);
    }

    getNewTasks() {
        return this.newTasks;
    }

    getCompletedTasks() {
        return this.completedTasks;
    }

    getOfflineTasks() {
        return this.offlineTasks;
    }

    clearOfflineTasks() {
        this.offlineTasks = [];
    }

    // deleteofflineTask(id, delTask) {
    //     this.deletedTasks.push(id);
    //     this.offlineTasks.forEach( (task, index) => {
    //         if(task.description === delTask.description){
    //             this.offlineTasks.splice(index, 1);
    //         }
    //     })
    //     console.log(this.offlineTasks);
    // }

    loadTasks(){
        this.newTasks = JSON.parse(localStorage.getItem('newTasksData'));
        this.completedTasks = JSON.parse(localStorage.getItem('completedTasksData'));
    }
}