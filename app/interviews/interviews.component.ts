import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {
  roles: any[] = [];
  companies: any[] = [];
  filteredRoles: any[] = [];
  regForm: any;

  // Filters
  selectedCompanies = [];
  selectedRoles = [];
  selectedSalaries = [];
  selectedLocations = [];
  selectedExperiences = [];
  selectedSkills = [];

  salaries = [];
  locations = [];
  experiences = [];
  skills = [];

  constructor(private data: DataService,private fb: FormBuilder) {}

  ngOnInit() {
    this.roles = this.data.roles;
    this.companies = this.data.companies;
    this.filteredRoles = this.roles; // Initialize filteredRoles with all roles

    this.salaries = Array.from(new Set(this.roles.map(role => role.salary)));
    this.locations = Array.from(new Set(this.roles.map(role => role.location)));
    this.experiences = Array.from(new Set(this.roles.map(role => role.experience)));
    this.skills = Array.from(new Set(this.roles.flatMap(role => role.skills.split(','))));

    this.regForm = this.fb.group({
      formData: this.fb.group({
        name: ['', { validators: Validators.required, updateOn: 'blur' }],
        email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
        contact: ['', { validators: [Validators.required, Validators.pattern('[0-9]{10}')], updateOn: 'blur' }],
    })
  })
  }
  applyFilters():void {
    // If no filter is selected, return immediately
    if (this.selectedCompanies.length === 0 && this.selectedRoles.length === 0 &&
        this.selectedSalaries.length === 0 && this.selectedLocations.length === 0 &&
        this.selectedExperiences.length === 0 && this.selectedSkills.length === 0) {
      return;
    }

    this.filteredRoles = this.roles.filter(role => 
      (this.selectedLocations.length === 0 || this.selectedLocations.includes(role.location)) &&
      (this.selectedSalaries.length === 0 || this.selectedSalaries.includes(role.salary)) &&
      (this.selectedRoles.length === 0 || this.selectedRoles.includes(role.role)) &&
      (this.selectedCompanies.length === 0 || this.selectedCompanies.includes(role.company)) &&
      (this.selectedExperiences.length === 0 || this.selectedExperiences.includes(role.experience)) &&
      (this.selectedSkills.length === 0 || role.skills.split(',').some((skill: string) => this.selectedSkills.includes(skill.trim()))));
      window.scrollTo(0, 0);
    }

  clearFilters():void {
    this.salaries.forEach(salary => {
      this.onSalaryChange(salary, false);
    });
    this.locations.forEach(location => {
      this.onLocationChange(location, false);
    });
    this.experiences.forEach(experience => {
      this.onExperienceChange(experience, false);
    });
    this.skills.forEach(skill => {
      this.onSkillChange(skill, false);
    });

    // Reset filteredRoles to display all content
    this.filteredRoles = this.roles;
    window.scrollTo(0, 0);
  }


  getCompanyPath(companyName: string): string | null {
    let companyInfo = this.companies.find(c => c.company === companyName);
    if (companyInfo) {
      return companyInfo.path;
    }
    return null;
  }

  // Filter change handlers
  onCompanyChange(company: string, isChecked: boolean):void {
    this.updateSelectedFilters(this.selectedCompanies, company, isChecked);
  }

  onRoleChange(role: string, isChecked: boolean):void {
    this.updateSelectedFilters(this.selectedRoles, role, isChecked);
  }
  
  onSalaryChange(salary: string, isChecked: boolean):void {
    this.updateSelectedFilters(this.selectedSalaries, salary, isChecked);
  }
  
  onLocationChange(location: string, isChecked: boolean):void {
    this.updateSelectedFilters(this.selectedLocations, location, isChecked);
  }
  
  onExperienceChange(experience: string, isChecked: boolean):void {
    this.updateSelectedFilters(this.selectedExperiences, experience, isChecked);
  }
  
  onSkillChange(skill: string, isChecked: boolean):void {
    this.updateSelectedFilters(this.selectedSkills, skill, isChecked);
  }

  isSalarySelected(salary: string): boolean {
    return this.selectedSalaries.includes(salary);
  }
  isLocationSelected(location: string): boolean {
    return this.selectedLocations.includes(location);
  }
  
  isExperienceSelected(experience: string): boolean {
    return this.selectedExperiences.includes(experience);
  }
  
  isSkillSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }
  
  
  
  private updateSelectedFilters(selectedFilters: string[], filter: string, isChecked: boolean):void {
    if (isChecked) {
      selectedFilters.push(filter);
    } else {
      const index = selectedFilters.indexOf(filter);
      if (index > -1) {
        selectedFilters.splice(index, 1);
      }
    }
  }

  display = "none";

  issubmitted = false;

  curr_cl:any=[];

  cname:string;



openModal(cl: { company: any; role: any; location: any; salary: any; }):void {
  //this.curr_cl = this.filteredRoles.find(x=>x.company==cl.company);
  this.curr_cl = this.filteredRoles.find(x=>x.company==cl.company&&x.role==cl.role&&x.location==cl.location&&x.salary==cl.salary);

  //console.log(this.curr_cl.company);
  //console.log(this.curr_cl);
  this.display = "block";
}
onCloseHandled():void {
  this.display = "none";
  if(!this.issubmitted){
    alert("Details are not Submitted, do you want to close ?");
  }
  this.issubmitted = false;
}

isControlInvalid(form: FormGroup, controlName: string):boolean {
  const control = form.get(controlName);
  return control.invalid && control.touched;
}

// calc_fees() {
//   let price = this.curr_cl.price;
//  this.total_fees = Number.parseInt(price.substring(3,price.length-2)) * this.seats;
// }

submitForm(): void {
  //alert('Thanks for registering!');
  const formData = this.regForm.get('formData') as FormGroup;

  let name = formData.get('name')?.value;
  // let email = formData.get('email')?.value;
  // let contact = formData.get('contact')?.value;

  this.cname = name;
  this.issubmitted = true;

  this.resetFormData();
}



resetFormData():void {
const formData = this.regForm.get('formData') as FormGroup;
formData.reset();
}
}
