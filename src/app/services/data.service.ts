import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import {map} from "rxjs/internal/operators";
import {urlFront} from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class DataService {
  projects: any=[];
  httpOptions:any;
  constructor(private http:HttpClient) { }

  /**
	 * @param token.
	 * Gets all projects for organizaion.
	 */
  getprojects(token):Observable<any>{
    var url=urlFront+"_apis/projects?api-version=5.0"
    var auth="Basic "+btoa("Basic" + ':' + token);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': auth
      })
    };
    return this.http.get(url,this.httpOptions).pipe(map((res:any)=>{
      if(res){
        this.projects=res;
        return this.projects.value;  
      }
      else 
      return "Something went wrong"     
    }))
  }

  /** 
	 * @Prepares token for rest of the http calls to azure backend
	 * 
	 */
  getToken(){
   return this.http.get('http://localhost:3000/api/getToken').pipe(map((res:any)=>{
      console.log(res);
      return res.Token
    }))
  }

  /**
	 * @param projectId.
	 * Gets team responsible for the project.
	 */

  getTeam(projectId){
  var url=urlFront+"_apis/projects/"+projectId+"?api-version=5.0"
  return this.http.get(url,this.httpOptions).pipe(map((res:any)=>{
    const teamId=res.defaultTeam.id;
    return teamId

  }))
  }
  
  /**
	 * @param projectId.
	 * Gets team responsible for the project.
	 */
  getStatus(id){
    var url=urlFront+id+"/_apis/reporting/TransformQuery/WorkitemTracking.Queries"
    return this.http.post(url,this.httpOptions).pipe(map((res:any)=>{
      this.projects=res;
      return this.projects.value;
  
    }))
  };


  /**
	 * @param projectName,projectId,TeamId.
	 * Gets tasks assigned to team members fassion.
	 */
  getTasksByAsignedTo(projectName,projectId,teamId){
    var url=urlFront+projectId+"/_apis/reporting/TransformQuery/WorkitemTracking.Queries?api-version=5.0-preview"
    var raw = JSON.stringify([{"filter":"21342a8f-d7bf-472d-b682-d96cfe2b8c40","groupBy":"System.AssignedTo","orderBy":{"propertyName":"value","direction":"descending"},"measure":{"aggregation":"count","propertyName":""},"historyRange":null,"filterContext":{"project":projectName,"projectId":projectId,"teamId":teamId}}]);
    return this.http.post(url,raw,this.httpOptions).pipe(map((res:any)=>{
      console.log(res);
      if(res && res.result[0] && res.result[0].data[0] && res.result[0].data[0].value){
        var item=res.result[0].data[0].value;
        return item;
      }
      else return false
      // var items=res.result[0].data[0].value;
    }))
  }

  /**
	 * @param projectName,projectId,TeamId.
	 * Gets tasks by task states.
	 */
  getTasksByState(projectName,projectId,teamId){
  var url=urlFront+projectId+"/_apis/reporting/TransformQuery/WorkitemTracking.Queries?api-version=5.0-preview";
  var raw = JSON.stringify([{"filter":"1beb241d-3cc5-482e-b1e3-7af3df19b573","groupBy":"System.State","orderBy":{"direction":"descending","propertyName":"value"},"measure":{"aggregation":"count","propertyName":""},"historyRange":null,"filterContext":{"project":projectName,"projectId":projectId,"teamId":teamId}}]);
  return this.http.post(url,raw,this.httpOptions).pipe(map((res:any)=>{
    console.log(res);
    var item=res.result[0].data[0].value;
    return item;
   
  }))  
}

/**
	 * @param projectName,projectId,TeamId.
	 * Gets tasks assigned to team members and task status combined.
	 */

getTasksByStateAndMember(projectName,projectId,teamId){
  var url=urlFront+projectId+"/_apis/reporting/TransformQuery/WorkitemTracking.Queries?api-version=5.0-preview";
  var raw = JSON.stringify([{"filter":"1beb241d-3cc5-482e-b1e3-7af3df19b573","groupBy":"System.State","orderBy":{"propertyName":"label","direction":"ascending"},"measure":{"aggregation":"count","propertyName":""},"historyRange":null,"series":"System.AssignedTo","filterContext":{"project":projectName,"projectId":projectId,"teamId":teamId}}]);
  return this.http.post(url,raw,this.httpOptions).pipe(map((res:any)=>{
    var item=res.result[0].data
    return item;
  }))
}
}
