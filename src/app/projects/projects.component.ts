import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  project:any;
  projects=[];
  teamId: any;
  isLoading: boolean;
  seliseLogoUrl="https://selise.ch/wp-content/uploads/2019/06/selise-logo.png"
  imagesources=[{
    "name":"Outdoorchef",
    "imageUrl":"https://ch.outdoorchef.com/wp-content/themes/outdoorchef/assets/images/outdoorchef_new_logo1.png"
  },
  {
    "name":"Vorwerk CH",
    "imageUrl":"https://switzerland.thermomix.com/wp-content/themes/thermomix/assets/images/logo/thermomix-logo.png"
  },
  {
    "name":"SWICA",
    "imageUrl":"https://cdn.selise.biz/swica/assets/images/logos/swica_logo.svg"
  },
  {
    "name":"Fincentrum_CZ",
    "imageUrl":"https://ecap-cdn.filip.at/slnetwork/assets/images/flip-logo.svg"
  },
  {
    "name":"Fincentrum_SK",
    "imageUrl":"https://ecap-cdn.filip.at/slnetwork/assets/images/flip-logo.svg"
  },
  {
    "name":"CLM",
    "imageUrl":"https://www.amlogclm.com/assets/images/clm_logo.png"
  },
  {
    "name":"BG",
    "imageUrl":"https://datasset.bg-21.com/tenant/scbg/site/D4A16576-1B12-5B82-C870-CE7A7136DCB2/assets/images/bg_logo.png"
  },
  {
    "name":"Swisslife - ePW",
    "imageUrl":"https://cdn.selise.biz/slpc/assets/images/LOGO.png"
  },
  {
    "name":"SWICA UD",
    "imageUrl":"https://cdn.selise.biz/swica/assets/images/logos/swica_logo.svg"
  },
  {
    "name":"Fincentrum_CZ",
    "imageUrl":"https://ecap-cdn.portalsk.fincentrum.com/slnetwork/fc-cz/assets/fincentrum-logo.svg"
  },
  {
    "name":"Fincentrum_SK",
    "imageUrl":"https://ecap-cdn.portalsk.fincentrum.com/slnetwork/fc-cz/assets/fincentrum-logo.svg"
  }, 
]


  constructor(private service:DataService) { }
  ngOnInit() {
    this.isLoading=true
    this.getToken()
  }

   /**
	 * @param projects[].
	 * gets projects with project name and item id
	 */
  getProjects(token) {
    this.service.getprojects(token).subscribe((res:any)=>{
      this.projects=res;
      this.projects.forEach((project,index)=>{
        if(project.name=="Demo-Project"){
          this.projects.splice(index,1);
        }
      })
      this.attachImage(this.projects);
    })
  }

   /**
	 * @param projects[].
	 * attaches logo with respective project
	 */
  attachImage(projects){
    projects.forEach(element => {
      this.imagesources.forEach(image=>{
        if(element.name==image.name){
          element['imageUrl']=image.imageUrl
        }
      })
    });
    this.isLoading=false
    console.log("projects",projects);
  }

  /**
	 * @param projects[].
	 * gets token from databse
	 */
  getToken(){
    this.service.getToken().subscribe(res=>{
      console.log(res);
     this.getProjects(res)
    })
  }
  
}
