import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  view: any[] = [600, 400];
  // options for the chart
  id:string;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  loading:boolean;
  timeline = true;
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  noDataAvailableImage="https://cdn.vsassets.io/ext/ms.vss-reporting/reporting-visuals-common/images/errorWidget-large.ioJbBClKfjicdp7c.png"
  seliseLogoUrl="https://selise.ch/wp-content/uploads/2019/06/selise-logo.png"
  colorScheme = {
    domain: ['#75e0cb', '#65b8f0', '#b8f065','#f0c965','#c098f5']
  };
 assignedData=[]
taskStatusPerPersonData=[]
taskStatusData=[];
projects: any;
name: any;
teamId: any;
activeTaskCount: any;
completedTaskCount: any;
dataAvailable: boolean;

  constructor(private route: ActivatedRoute,private service:DataService) { }

  ngOnInit() {
    this.loading=true;
    const sub = this.route.params.subscribe(params => {
      this.id = params['projectId'];
      });
      this.getToken();
    }

   /**
	 * @param projectId
	 *gets token provided by azure 
	 */ 
    getToken() {
      this.service.getToken().subscribe(res=>{
        this.getAllProjects(res)
      })
    }

  /**
	 * @param projectId
	 *gets default team id respected with current project
	 */ 
    getTeam(id) {
      this.service.getTeam(id).subscribe(res=>{
        console.log(res);
        this.teamId=res;
        this.getTask(this.name,this.teamId);
      })
    }

   /**
	 * @param ProjectName,teamId.
	 *gets tasks by assigned to person manner
	 */
    getTask(name,teamId) {
      var obj;
      this.service.getTasksByAsignedTo(name,this.id,teamId).subscribe((res:any)=>{
        if(!res){
          this.loading=false
          this.dataAvailable=false;
        }
        else{
          console.log(res);
          res.forEach(element => {
            if(element.key=="[NULL]"){
              element.key="Unassigned"
            }
            obj={
              "name":element.key,
              "value":element.value
            }
            this.assignedData.push(obj);
          });
          this.getTasksByState(name,teamId)
        }
              
      })
    }

    /**
	 * @param ProjectName,teamId.
	 * gets tasks by task state
	 */
    getTasksByState(name,teamId) {
      var obj;
      this.service.getTasksByState(name,this.id,teamId).subscribe((res:any)=>{
        this.activeTaskCount=0;
        this.completedTaskCount=0;
        res.forEach(element => {
          if(element.key=="In Progress"){
            this.activeTaskCount=element.value;
          }
          else if(element.key=="Done"){
            this.completedTaskCount=element.value;
          }
          obj={
            "name":element.key,
            "value":element.value
          }
          this.taskStatusData.push(obj);
          this.getTasksByStateAndMember()     
        });
      })
    }
     
    /**
	 * @param .
	 * gets tasks by assiged to person and task status manner
	 */
    getTasksByStateAndMember() {
      var model;
      var obj;
      this.service.getTasksByStateAndMember(this.name,this.id,this.teamId).subscribe((res:any)=>{
        console.log(res)
        this.taskStatusPerPersonData=[]
       res.forEach(element => {
         if(element.key== "[NULL]"){
          element.key="Unassigned"
         }
         
         model={
            "name":element.key,
            "series":[]
              }           
         element.value.forEach(childElement => {
          obj={
            "name":childElement.key,
            "value":childElement.value
          }
          model.series.push(obj);
         });
         this.taskStatusPerPersonData.push(model);
         this.loading=false;
         this.dataAvailable=true;
       });
      })
    }

    onSelect(data): void {
      console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
  
    onActivate(data): void {
      console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
  
    onDeactivate(data): void {
      console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
    
    /**
	 * @param token.
	 * gets all projects with project name and item id
	 */
    getAllProjects(token) {
      this.service.getprojects(token).subscribe(res=>{
        this.projects=res;
        this.projects.forEach(element => {
          if(element.id==this.id){
            this.name=element.name
          }
        });
        this.getTeam(this.id);
      })
    }
}
